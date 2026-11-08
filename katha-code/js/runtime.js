/* Katha Code — the interpreter.
   Design:
   - Each character has one script strip: [trigger?, block, block, ...].
   - play(): everyone goes back to their story starting place, then every strip
     that starts with "when play" (or has no trigger at all) starts running.
   - Other triggers: tap a character · two characters meet (touch) · a coloured
     message is sent.
   - Each strip runs as its own async loop; each block awaits a rAF tween, so
     many strips run side by side (cooperative coroutines).
   - repeat (no nesting, so a 4-year-old can read it): runs everything before
     it in the strip again, N times in total, or forever.
   - stop(): bumps `token`. Every tween checks the token each frame and ends at
     once, so stopping is instant.
   - STORY RULES: movement respects the scene's places and the character's
     abilities. No walking on water; only those who fly in the story fly; only
     those who change size or hide in the story can do so. */
(function (KC) {
  'use strict';

  var STEP = 6;          // walk step in logical units
  var DEPTH_STEP = 3;    // up/down step while standing on land
  var AIR_STEP = 5;      // up/down step while flying
  var HOVER = 12;        // height kept while flying over water
  var MAX_AIR = 32;
  var MIN_SCALE = 0.4, MAX_SCALE = 2.2;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function frame() { return new Promise(function (r) { requestAnimationFrame(r); }); }

  function Runtime(o) {
    this.kit = o.kit;
    this.getScene = o.getScene;     // () => { data: scene, tpl: scene template }
    this.view = o.view;             // { setState(id, s), say(id, phrase|null), celebrate() }
    this.onBlock = o.onBlock;       // (id, index, isOn)
    this.onRunning = o.onRunning;   // (bool)
    this.onNextScene = o.onNextScene;
    this.audio = o.audio;
    this.token = 0;
    this.active = 0;
    this.running = {};              // "id|trigger" -> token, to avoid double starts
    this.contacts = {};
    this.state = {};
    this.resetAll();
  }

  /* ---------- story rules ---------- */
  Runtime.prototype.chars = function () { return this.getScene().data.characters; };
  Runtime.prototype.cast = function (id) {
    var base = this.kit.characters[id] || {}, tpl = this.getScene().tpl, entry = {};
    for (var i = 0; i < tpl.cast.length; i++) if (tpl.cast[i].id === id) entry = tpl.cast[i];
    var out = {}, k;
    for (k in base) out[k] = base[k];
    for (k in entry) out[k] = entry[k];
    if (!out.places) out.places = Object.keys(tpl.places);
    if (out.canShow == null) out.canShow = !!out.canHide;   // whoever can hide can also appear again
    out.hasPhrases = !!(base.phrases && base.phrases.length);
    out.hasClips = (KC._clips || []).some(Boolean);
    out.size = out.size || 1;
    return out;
  };
  Runtime.prototype.phrasesFor = function (id) {
    var kit = this.kit, keys = (kit.characters[id] && kit.characters[id].phrases) || [];
    return keys.map(function (k) { var p = kit.phrases[k]; return { key: k, icon: p.icon, text: p.text }; });
  };
  // The allowed place (land) that contains x for this character, or null (water / not allowed).
  Runtime.prototype.placeAt = function (id, x) {
    var names = this.cast(id).places, P = this.getScene().tpl.places;
    for (var i = 0; i < names.length; i++) {
      var p = P[names[i]];
      if (p && x >= p.x0 && x <= p.x1) return p;
    }
    return null;
  };
  // The stretch of land you can walk along from x: touching places join up
  // (e.g. the shore and the half-built bridge). Water breaks the stretch.
  Runtime.prototype.landRange = function (id, x) {
    var names = this.cast(id).places, P = this.getScene().tpl.places, list = [];
    for (var i = 0; i < names.length; i++) if (P[names[i]]) list.push(P[names[i]]);
    var r = null;
    for (i = 0; i < list.length; i++) if (x >= list[i].x0 && x <= list[i].x1) { r = { x0: list[i].x0, x1: list[i].x1 }; break; }
    if (!r) return null;
    var grew = true;
    while (grew) {
      grew = false;
      for (i = 0; i < list.length; i++) {
        var p = list[i];
        if (p.x0 <= r.x1 + 0.5 && p.x1 >= r.x0 - 0.5 && (p.x0 < r.x0 || p.x1 > r.x1)) {
          r.x0 = Math.min(r.x0, p.x0); r.x1 = Math.max(r.x1, p.x1); grew = true;
        }
      }
    }
    return r;
  };

  // Nearest allowed spot on land for a dropped / loaded character.
  Runtime.prototype.snapToLand = function (id, x, y) {
    var names = this.cast(id).places, P = this.getScene().tpl.places, best = null, bd = 1e9;
    for (var i = 0; i < names.length; i++) {
      var p = P[names[i]];
      if (!p) continue;
      var cx = clamp(x, p.x0, p.x1), d = Math.abs(cx - x);
      if (d < bd) { bd = d; best = { x: cx, y: clamp(y, p.y0, p.y1) }; }
    }
    return best || { x: x, y: y };
  };

  /* ---------- state ---------- */
  Runtime.prototype.resetAll = function () {
    var chars = this.chars();
    this.state = {};
    this.contacts = {};
    for (var i = 0; i < chars.length; i++) this.resetOne(chars[i]);
  };
  Runtime.prototype.resetOne = function (c) {
    var info = this.cast(c.id), spot = this.snapToLand(c.id, c.x, c.y);
    var face = info.face || (spot.x > 50 ? -1 : 1);
    this.state[c.id] = {
      x: spot.x, y: spot.y,
      air: info.canFly ? (c.air || 0) : 0,   // only those who can fly may start up high
      dir: face, scale: info.size, visible: !info.hidden,
      mood: info.mood != null ? info.mood : -1, bob: 0
    };
    this.view.setState(c.id, this.state[c.id]);
    this.view.say(c.id, null);
  };

  /* ---------- starting scripts ---------- */
  Runtime.prototype._begin = function () {
    if (this.active++ === 0) {
      if (this.onRunning) this.onRunning(true);
      this._watchTouches();
    }
  };
  Runtime.prototype._end = function () { if (--this.active === 0 && this.onRunning) this.onRunning(false); };

  Runtime.prototype._strip = function (id) {
    var cs = this.chars();
    for (var i = 0; i < cs.length; i++) if (cs[i].id === id) return cs[i].scripts[0] || [];
    return [];
  };

  // Start a character's strip for a trigger, unless it is already running.
  Runtime.prototype._fire = function (id, trigger) {
    var key = id + '|' + trigger;
    if (this.running[key] === this.token) return false;
    this.running[key] = this.token;
    this._run(id, this._strip(id), this.token, false, key);
    return true;
  };

  Runtime.prototype.play = function () {
    this.stop();
    this.resetAll();
    var cs = this.chars();
    for (var i = 0; i < cs.length; i++) {
      var strip = cs[i].scripts[0] || [];
      if (!strip.length) continue;
      var first = KC._blocks.DEFS[strip[0].type];
      // No trigger at all still runs on play, so nothing a child builds is ignored.
      if (first.trigger === 'flag' || !first.trigger) this._fire(cs[i].id, 'flag');
    }
  };

  Runtime.prototype.tap = function (id) {
    var strip = this._strip(id);
    if (strip.length && strip[0].type === 'tap') return this._fire(id, 'tap');
    return false;
  };

  Runtime.prototype.broadcast = function (color) {
    var cs = this.chars();
    for (var i = 0; i < cs.length; i++) {
      var strip = cs[i].scripts[0] || [];
      if (strip.length && strip[0].type === 'msg' && (strip[0].param || 0) === color) this._fire(cs[i].id, 'msg');
    }
  };

  // Run the whole strip now (tapping its first block), or one block (preview).
  Runtime.prototype.runStrip = function (id) { this._fire(id, 'manual'); };
  Runtime.prototype.preview = function (id, block) {
    if (!this.state[id]) return;
    this._run(id, [block], this.token, true);
  };

  Runtime.prototype.stop = function () {
    this.token++;
    if (this.audio.stopClip) this.audio.stopClip();
    if (this.onBlock) this.onBlock(null, -1, false);
    var cs = this.chars();
    for (var i = 0; i < cs.length; i++) this.view.say(cs[i].id, null);
  };

  /* ---------- touch detection (runs while anything is running) ---------- */
  Runtime.prototype._watchTouches = function () {
    var self = this;
    function loop() {
      if (self.active <= 0) return;
      var cs = self.chars();
      for (var i = 0; i < cs.length; i++) {
        for (var j = i + 1; j < cs.length; j++) {
          var a = self.state[cs[i].id], b = self.state[cs[j].id];
          if (!a || !b) continue;
          var key = cs[i].id + '+' + cs[j].id;
          var near = a.visible && b.visible &&
            Math.abs(a.x - b.x) < 6 * (a.scale + b.scale) &&
            Math.abs((a.y - a.air) - (b.y - b.air)) < 8 * (a.scale + b.scale);
          if (near && !self.contacts[key]) {
            self._touchStart(cs[i].id);
            self._touchStart(cs[j].id);
          }
          self.contacts[key] = near;
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };
  Runtime.prototype._touchStart = function (id) {
    var strip = this._strip(id);
    if (strip.length && strip[0].type === 'touch') this._fire(id, 'touch');
  };

  /* ---------- the loop that runs one strip ---------- */
  Runtime.prototype._run = async function (id, strip, tok, isPreview, key) {
    this._begin();
    var counters = {};
    try {
      var start = (strip.length && KC._blocks.DEFS[strip[0].type].trigger) ? 1 : 0;
      for (var i = start; i < strip.length; i++) {
        if (tok !== this.token) break;
        var b = strip[i], def = KC._blocks.DEFS[b.type];
        if (!def || def.trigger) continue;

        if (b.type === 'repeat') {
          var n = b.param || def.def;           // total times; 6 = forever
          if (counters[i] === undefined) counters[i] = n >= 6 ? Infinity : n - 1;
          if (!isPreview && this.onBlock) this.onBlock(id, i, true);
          await this._sleep(250, tok);
          if (!isPreview && this.onBlock) this.onBlock(id, i, false);
          if (counters[i] > 0) {
            counters[i]--;
            for (var k in counters) if (+k < i) delete counters[k];   // inner repeats start fresh
            await frame();                      // never spin without yielding
            i = start - 1;
          } else {
            delete counters[i];
          }
          continue;
        }

        if (!isPreview && this.onBlock) this.onBlock(id, i, true);
        await this._exec(id, b, def, tok);
        if (!isPreview && this.onBlock) this.onBlock(id, i, false);
      }
    } catch (e) {
      /* never show errors to children */
    }
    if (key && this.running[key] === tok) delete this.running[key];
    this._end();
  };

  // Animate for `ms`, calling fn(t) with t in 0..1. Ends early if stopped.
  Runtime.prototype._tween = function (ms, fn, tok) {
    var self = this;
    return new Promise(function (resolve) {
      var t0 = null;
      function step(now) {
        if (tok !== self.token) { resolve(false); return; }
        if (t0 === null) t0 = now;
        var t = Math.min(1, (now - t0) / ms);
        fn(t);
        if (t < 1) requestAnimationFrame(step); else resolve(true);
      }
      requestAnimationFrame(step);
    });
  };
  Runtime.prototype._sleep = function (ms, tok) { return this._tween(ms, function () {}, tok); };

  Runtime.prototype._show = function (id) { this.view.setState(id, this.state[id]); };

  Runtime.prototype._exec = async function (id, b, def, tok) {
    var s = this.state[id], self = this, info = this.cast(id), a = this.audio;
    var n = b.param == null ? def.def : b.param;
    var sx, sy, sa, tx, ty, ta, place;

    // Story rule: a block this character cannot do in the story does nothing but a friendly wobble.
    if (def.needs && !info[def.needs]) { await this._bump(id, 0, tok); return; }

    switch (b.type) {
      case 'right':
      case 'left': {
        var d = b.type === 'right' ? 1 : -1;
        s.dir = d;
        sx = s.x; tx = s.x + d * n * STEP;
        var blocked = false;
        if (s.air > 0) {
          tx = clamp(tx, 4, 96);                       // moving through the sky
        } else {
          var range = this.landRange(id, s.x) || this.landRange(id, this.snapToLand(id, s.x, s.y).x);
          if (range) {
            var c = clamp(tx, range.x0, range.x1);     // land ends at the shore: no walking on water
            blocked = c !== tx; tx = c;
          }
        }
        var dur = Math.max(250, Math.abs(tx - sx) / STEP * 280), lastStep = -1;
        await this._tween(dur, function (t) {
          s.x = lerp(sx, tx, t);
          if (s.air === 0) {
            var k = Math.floor(t * dur / 280);
            if (k !== lastStep) { lastStep = k; a.sfx('step'); }
            s.bob = Math.abs(Math.sin(t * Math.PI * dur / 280)) * 1.2;
          }
          self._show(id);
        }, tok);
        s.bob = 0;
        place = this.placeAt(id, s.x);
        if (place && s.air === 0) s.y = clamp(s.y, place.y0, place.y1);
        this._show(id);
        if (blocked && tok === this.token) await this._bump(id, d, tok);
        break;
      }

      case 'up':
      case 'down': {
        var u = b.type === 'up' ? 1 : -1;
        sy = s.y; sa = s.air; ty = s.y; ta = s.air;
        if (s.air > 0) {
          ta = clamp(s.air + u * n * AIR_STEP, 0, MAX_AIR);
          place = this.placeAt(id, s.x);
          if (!place && ta < HOVER) ta = HOVER;        // cannot come down into the water
          if (place && ta === 0) ty = clamp(s.y, place.y0, place.y1);
        } else {
          place = this.placeAt(id, s.x);
          if (place) ty = clamp(s.y - u * n * DEPTH_STEP, place.y0, place.y1);
        }
        if (ty === sy && ta === sa) { await this._bump(id, 0, tok); break; }
        await this._tween(220 + n * 120, function (t) {
          var e = ease(t); s.y = lerp(sy, ty, e); s.air = lerp(sa, ta, e); self._show(id);
        }, tok);
        break;
      }

      case 'jump': {
        for (var j = 0; j < n && tok === this.token; j++) {
          a.sfx('boing');
          var base = s.air, h = s.air > 0 ? 4 : 9;
          await this._tween(480, function (t) { s.air = base + 4 * h * t * (1 - t); self._show(id); }, tok);
          s.air = base; this._show(id);
        }
        break;
      }

      case 'fly': {
        a.sfx('whoosh');
        sx = s.x; sa = s.air;
        tx = clamp(s.x + s.dir * n * 14, 4, 96);
        place = this.placeAt(id, tx);
        ta = place ? 0 : HOVER;                        // land only on land; otherwise keep flying
        sy = s.y; ty = place ? clamp(s.y, place.y0, place.y1) : s.y;
        var arc = 14 + n * 2;
        await this._tween(500 + n * 260, function (t) {
          var e = ease(t);
          s.x = lerp(sx, tx, e); s.y = lerp(sy, ty, e);
          s.air = lerp(sa, ta, e) + 4 * arc * e * (1 - e);
          self._show(id);
        }, tok);
        break;
      }

      case 'home': {
        var c0 = this._dataChar(id);
        if (!c0) break;
        var home = this.snapToLand(id, c0.x, c0.y);
        var homeAir = info.canFly ? (c0.air || 0) : 0;
        var crossesWater = !this._sameLand(id, s.x, home.x);
        if (crossesWater && !info.canFly) { await this._bump(id, 0, tok); break; }   // story: cannot cross water
        sx = s.x; sy = s.y; sa = s.air;
        var hump = crossesWater ? 20 : 0;
        await this._tween(600, function (t) {
          var e = ease(t);
          s.x = lerp(sx, home.x, e); s.y = lerp(sy, home.y, e);
          s.air = lerp(sa, homeAir, e) + 4 * hump * e * (1 - e);
          self._show(id);
        }, tok);
        break;
      }

      case 'say': {
        var list = this.phrasesFor(id);
        if (!list.length) break;
        var ph = list[n % list.length];
        this.view.say(id, ph);
        a.speak(ph.text, 'phrase-' + ph.key);
        await this._sleep(Math.max(1800, ph.text.length * 110), tok);
        this.view.say(id, null);
        break;
      }

      case 'mood':
        s.mood = n % 3; this._show(id);
        a.sfx('tap');
        await this._sleep(350, tok);
        break;

      case 'grow':
      case 'shrink': {
        var g = b.type === 'grow' ? 1 : -1, s0 = s.scale;
        var s1 = clamp(s0 * Math.pow(1.25, g * n), MIN_SCALE * info.size, MAX_SCALE * info.size);
        if (Math.abs(s1 - s0) < 0.01) { await this._bump(id, 0, tok); break; }
        a.sfx(b.type);
        await this._tween(350 + n * 120, function (t) { s.scale = lerp(s0, s1, ease(t)); self._show(id); }, tok);
        break;
      }

      case 'hide':
      case 'show':
        s.visible = b.type === 'show';
        a.sfx(b.type);
        this._show(id);
        await this._sleep(400, tok);
        break;

      case 'shankh': case 'bell': case 'flute': case 'drum': case 'clap': case 'jai': {
        var ms = a.sound(b.type, this.kit.chant);
        await this._tween(ms, function (t) { s.bob = Math.sin(t * Math.PI * 4) * 0.6; self._show(id); }, tok);
        s.bob = 0; this._show(id);
        break;
      }

      case 'wait':
        await this._sleep(n * 500, tok);
        break;

      case 'send':
        a.sfx('send');
        this.broadcast(n % 4);
        await this._sleep(200, tok);
        break;

      case 'stop':
        this.stop();
        break;

      case 'next':
        if (this.onNextScene) {
          var go = this.onNextScene;
          await this._sleep(150, tok);
          if (tok === this.token) go();
        }
        break;

      case 'myvoice': {
        var clip = (KC._clips || [])[n];
        if (!clip) { await this._bump(id, 0, tok); break; }
        var done = false;
        a.playClip(clip).then(function () { done = true; });
        var t0 = Date.now();
        while (!done && tok === this.token && Date.now() - t0 < 8000) {
          s.bob = Math.sin((Date.now() - t0) / 120) * 0.6; this._show(id);
          await frame();
        }
        s.bob = 0; this._show(id);
        break;
      }

      case 'finish':
        a.sfx('finish');
        this.view.celebrate();
        await this._sleep(900, tok);
        if (tok !== this.token) break;
        a.speak((this.kit.lesson ? this.kit.lesson + ' ' : '') + this.kit.finishLine, 'finish-' + this.kit.id);
        await this._sleep(7000, tok);
        break;
    }
  };

  Runtime.prototype._sameLand = function (id, x1, x2) {
    var r1 = this.landRange(id, x1), r2 = this.landRange(id, x2);
    return !!r1 && !!r2 && r1.x0 === r2.x0 && r1.x1 === r2.x1;
  };
  Runtime.prototype._dataChar = function (id) {
    var cs = this.chars();
    for (var i = 0; i < cs.length; i++) if (cs[i].id === id) return cs[i];
    return null;
  };

  // A small friendly wobble: "I can't do that here" (no error message).
  Runtime.prototype._bump = async function (id, d, tok) {
    var s = this.state[id], x0 = s.x, self = this;
    this.audio.sfx('bump');
    await this._tween(300, function (t) {
      s.x = x0 + Math.sin(t * Math.PI * 3) * 0.8 * (1 - t) * (d || 1);
      self._show(id);
    }, tok);
    s.x = x0; this._show(id);
  };

  KC._Runtime = Runtime;
})(window.KathaCode = window.KathaCode || {});
