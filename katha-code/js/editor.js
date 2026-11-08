/* Katha Code — the editor: stage, characters, scenes, palette, script strip,
   drag & drop, undo. One script strip per character per scene. */
(function (KC) {
  'use strict';

  var B = KC._blocks, ART = KC._art;
  var DRAG_START = 8;     // px before a press becomes a drag
  var MAGNET = 40;        // px of extra "magnetic" zone around the strip
  var MAX_SCENES = 4;

  var BTN_ICONS = {
    play: '<svg viewBox="0 0 40 40"><path d="M13 8 L32 20 L13 32 Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>',
    stop: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" rx="4" fill="#fff"/></svg>',
    undo: '<svg viewBox="0 0 40 40"><path d="M15 10 L8 17 L15 24 M8 17 H24 Q33 17 33 25 Q33 33 24 33 H16" fill="none" stroke="#C96A06" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 40 40"><path d="M6 20 L20 7 L34 20 M10 17 V33 H30 V17" fill="none" stroke="#C96A06" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="23" width="6" height="10" fill="#C96A06"/></svg>',
    plus: '<svg viewBox="0 0 40 40"><path d="M20 9 V31 M9 20 H31" stroke="#C96A06" stroke-width="5" stroke-linecap="round"/></svg>'
  };

  var TABS = [
    { cat: 'start',   icon: 'flag',   voice: 'शुरू' },
    { cat: 'move',    icon: 'right',  voice: 'चलना' },
    { cat: 'looks',   icon: 'show',   voice: 'दिखना और बोलना' },
    { cat: 'sound',   icon: 'bell',   voice: 'आवाज़' },
    { cat: 'control', icon: 'repeat', voice: 'नियंत्रण' }
  ];
  var SCENE_WORDS = ['एक', 'दो', 'तीन', 'चार'];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function Editor(root, ctx) {
    this.root = root;            // the .katha-code element
    this.ctx = ctx;              // { project, kit, audio, save, onHome }
    this.kit = ctx.kit;
    this.audio = ctx.audio;
    this.history = [];
    this.cat = 'move';
    this.cur = 0;                // current scene index
    this.charEls = {};
    this.bubbles = {};
    this.scale = 1;
    this.isRunning = false;
    this.challenge = ctx.challenge || null;
    var chars = this.scene().characters;
    this.selected = chars.length ? chars[0].id : null;
    if (this.challenge) {
      // Start on the character the challenge is about.
      var first = Object.keys(this.challenge.data.steps)[0];
      if (first) this.selected = first;
    }
    this._build();
    var self = this;
    this.runtime = new KC._Runtime({
      kit: this.kit,
      getScene: function () { return { data: self.scene(), tpl: self.tpl() }; },
      view: {
        setState: function (id, s) { self._place(id, s); },
        say: function (id, ph) { self._say(id, ph); },
        celebrate: function () { self._celebrate(); }
      },
      onBlock: function (id, i, on) { self._highlight(id, i, on); },
      onRunning: function (r) { self._setRunning(r); },
      onNextScene: function () {
        if (self.cur + 1 < self.ctx.project.scenes.length) { self.goToScene(self.cur + 1, true); return true; }
        return false;
      },
      audio: this.audio
    });
    this.renderAll();
  }

  // What a block is called aloud. The chant block follows the story (Jai Shri Ram / Jai Shri Krishna / Om Shanti).
  Editor.prototype._voice = function (type) { return type === 'jai' ? this.kit.chant : B.DEFS[type].voice; };

  Editor.prototype.scene = function () { return this.ctx.project.scenes[this.cur]; };
  Editor.prototype.tpl = function () { return KC._sceneTemplate(this.kit, this.scene().template); };
  Editor.prototype.charData = function (id) {
    var cs = this.scene().characters;
    for (var i = 0; i < cs.length; i++) if (cs[i].id === id) return cs[i];
    return null;
  };
  Editor.prototype.strip = function () {
    var c = this.charData(this.selected);
    if (!c) return [];
    if (!c.scripts[0]) c.scripts[0] = [];
    return c.scripts[0];
  };
  Editor.prototype._blockOpts = function () { return { phrases: this.runtime ? this.runtime.phrasesFor(this.selected) : [] }; };
  Editor.prototype._info = function (id) { return this.runtime.cast(id); };

  /* ================= build ================= */
  Editor.prototype._build = function () {
    var self = this;
    var app = el('div', 'kc-app');
    this.tabs = el('div', 'kc-tabs');
    this.stageBox = el('div', 'kc-stagebox');
    this.stage = el('div', 'kc-stage');
    this.stageBox.appendChild(this.stage);
    this.stripEl = el('div', 'kc-strip');
    this.palette = el('div', 'kc-palette');
    this.shelf = el('div', 'kc-shelf');
    this.scenesEl = el('div', 'kc-scenes');
    var controls = el('div', 'kc-controls');
    var g1 = el('div', 'kc-group'), g2 = el('div', 'kc-group');
    this.btnPlay = this._button('kc-play', 'play', 'चलाओ', function () { self.audio.sfx('play'); self.runtime.play(); });
    this.btnStop = this._button('kc-stop', 'stop', 'रुको', function () { self.audio.sfx('stop'); self.runtime.stop(); });
    this.btnUndo = this._button('kc-undo', 'undo', 'वापस', function () { self.undo(); });
    this.btnHome = this._button('kc-home', 'home', 'घर', function () { self.runtime.stop(); self.ctx.onHome(); });
    g1.appendChild(this.btnPlay); g1.appendChild(this.btnStop);
    g2.appendChild(this.btnUndo); g2.appendChild(this.btnHome);
    controls.appendChild(g1); controls.appendChild(g2);

    this.tabEls = {};
    TABS.forEach(function (t) {
      var b = el('button', 'kc-btn kc-tab kc-tab-' + t.cat, B.ICONS[t.icon].replace('kc-icon', ''));
      b.setAttribute('aria-label', t.voice);
      b.setAttribute('title', t.voice);
      b.addEventListener('click', function () {
        self.audio.sfx('tap'); self.audio.speak(t.voice, 'tab-' + t.cat);
        self.cat = t.cat; self.renderPalette(); self._hint();
      });
      self.tabEls[t.cat] = b;
      self.tabs.appendChild(b);
    });

    [this.tabs, this.stageBox, this.stripEl, this.palette, this.shelf, this.scenesEl, controls].forEach(function (n) { app.appendChild(n); });
    if (this.challenge) {
      // The goal, as a star badge on the stage: tap it to hear the goal again.
      this.goalEl = el('button', 'kc-goal', '<svg viewBox="0 0 40 40"><path d="M20 4 L24.5 14.5 L36 15.5 L27 23 L30 34 L20 28 L10 34 L13 23 L4 15.5 L15.5 14.5 Z" fill="#F5B819"/></svg><span>' + (this.challenge.index + 1) + '</span>');
      this.goalEl.setAttribute('aria-label', this.challenge.data.goal);
      this.goalEl.setAttribute('title', this.challenge.data.goal);
      this.goalEl.addEventListener('click', function () { self.sayGoal(); });
      this.stageBox.appendChild(this.goalEl);
      this.hand = el('div', 'kc-hand', '<svg viewBox="0 0 48 48"><path d="M18 4 Q22 4 22 8 V22 L24 21 Q28 20 28 24 L30 23 Q34 22 34 26 L36 26 Q40 26 40 30 V36 Q40 44 32 44 H24 Q18 44 15 38 L9 28 Q8 24 12 24 Q14 24 16 27 V8 Q16 4 18 4 Z" fill="#fff" stroke="#3A2A1E" stroke-width="2.4" stroke-linejoin="round"/></svg>');
      this.hand.hidden = true;
      this.root.appendChild(this.hand);
    }
    this.root.appendChild(app);
    this.app = app;

    this._onResize = function () { self._layout(); };
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onResize);
    if (window.ResizeObserver) { this._ro = new ResizeObserver(this._onResize); this._ro.observe(this.stageBox); }
  };

  Editor.prototype._button = function (cls, icon, voice, fn) {
    var self = this, b = el('button', 'kc-btn ' + cls, BTN_ICONS[icon]);
    b.setAttribute('aria-label', voice);
    b.setAttribute('title', voice);
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); });
    b.addEventListener('click', function () { self.audio.speak(voice, icon); fn(); });
    return b;
  };

  /* ================= rendering ================= */
  Editor.prototype.renderAll = function () {
    if (!this.charData(this.selected)) this.selected = this.scene().characters[0].id;
    this.renderStage();
    this.renderShelf();
    this.renderScenes();
    this.renderPalette();
    this.renderStrip();
    this._layout();
  };

  /* ================= challenges: goal + guiding hand ================= */
  Editor.prototype.sayGoal = function () {
    if (!this.challenge) return;
    this.audio.speak(this.challenge.data.goal, 'goal-' + this.kit.id + '-' + this.challenge.index);
    if (this.goalEl) { this.goalEl.classList.remove('kc-pop'); void this.goalEl.offsetWidth; this.goalEl.classList.add('kc-pop'); }
  };

  // Compare each character's strip with the challenge steps.
  // Returns null when complete, else { id, index, kind: 'select' | 'param' | 'remove' | 'add' }.
  Editor.prototype._challengeGap = function () {
    var steps = this.challenge.data.steps, ids = Object.keys(steps);
    for (var k = 0; k < ids.length; k++) {
      var id = ids[k], want = steps[id], c = this.charData(id);
      var strip = (c && c.scripts[0]) || [];
      for (var i = 0; i < want.length; i++) {
        var have = strip[i], w = want[i];
        if (!have || have.type !== w.type) return { id: id, index: i, kind: have ? 'remove' : 'add', want: w };
        if (w.param !== undefined) {
          var d = B.DEFS[have.type], v = have.param == null ? d.def : have.param;
          if (v !== w.param) return { id: id, index: i, kind: 'param', want: w };
        }
      }
    }
    return null;
  };

  Editor.prototype._hint = function () {
    if (!this.challenge) return;
    var self = this;
    cancelAnimationFrame(this._hintRaf);
    this._hintRaf = requestAnimationFrame(function () { self._placeHint(); });
  };

  Editor.prototype._placeHint = function () {
    var gap = this._challengeGap(), target = null;
    if (!gap) {
      if (!this.challenge.done) {
        this.challenge.done = true;
        if (this.challenge.onDone) this.challenge.onDone();
        this._starBurst();
        this.audio.sfx('finish');
        this.audio.speak('शाबाश! अब हरा बटन दबाकर देखो', 'challenge-done');
      }
      target = this.btnPlay;
    } else if (gap.id !== this.selected) {
      target = this.shelf.querySelector('.kc-portrait[data-id="' + gap.id + '"]');
    } else if (gap.kind === 'param' || gap.kind === 'remove') {
      target = this.stripEl.querySelectorAll('.kc-block')[gap.index];
    } else {
      var cat = B.DEFS[gap.want.type].cat;
      if (cat === 'end') cat = 'control';
      target = cat !== this.cat ? this.tabEls[cat] : this.palette.querySelector('.kc-block[data-type="' + gap.want.type + '"]');
    }
    if (this.isRunning && gap === null) target = null;
    if (!target) { this.hand.hidden = true; return; }
    var r = target.getBoundingClientRect(), rr = this.root.getBoundingClientRect();
    this.hand.hidden = false;
    this.hand.classList.toggle('kc-hand-remove', !!gap && gap.kind === 'remove');
    this.hand.style.left = (r.left - rr.left + r.width / 2 - 14) + 'px';
    this.hand.style.top = (r.top - rr.top + r.height / 2 - 2) + 'px';
  };

  Editor.prototype._starBurst = function () {
    var b = el('div', 'kc-starburst', '<svg viewBox="0 0 40 40"><path d="M20 4 L24.5 14.5 L36 15.5 L27 23 L30 34 L20 28 L10 34 L13 23 L4 15.5 L15.5 14.5 Z" fill="#F5B819" stroke="#fff" stroke-width="1.5"/></svg>');
    this.stageBox.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 2200);
    if (this.goalEl) this.goalEl.classList.add('kc-goal-done');
  };

  Editor.prototype.renderStage = function () {
    var self = this, sc = this.scene();
    this.stage.innerHTML = ART.backgrounds[sc.background]();
    this.charEls = {};
    this.bubbles = {};
    sc.characters.forEach(function (c) {
      var ce = el('div', 'kc-char');
      var sp = el('div', 'kc-sprite', ART.characters[c.sprite]());
      ce.appendChild(sp);
      ce._sprite = sp;
      ce._sprite_name = c.sprite;
      var eyes = sp.querySelector('.kc-eyes'), mouth = sp.querySelector('.kc-mouth');
      ce._face = { eyes: eyes, mouth: mouth, eyes0: eyes ? eyes.innerHTML : '', mouth0: mouth ? mouth.innerHTML : '' };
      ce.setAttribute('role', 'img');
      ce.setAttribute('aria-label', self._info(c.id).name || c.id);
      self._bindCharacter(ce, c.id);
      self.stage.appendChild(ce);
      self.charEls[c.id] = ce;
    });
    this.runtime.resetAll();
    this._markSelected();
  };

  Editor.prototype.renderShelf = function () {
    var self = this;
    this.shelf.innerHTML = '';
    this.scene().characters.forEach(function (c) {
      var box = ART.portraitBox && ART.portraitBox[c.sprite];
      var svg = ART.characters[c.sprite]();
      if (box) svg = svg.replace('viewBox="0 0 100 150"', 'viewBox="' + box + '"');
      var p = el('div', 'kc-portrait' + (box ? ' kc-portrait-fit' : ''), svg);
      p.setAttribute('data-id', c.id);
      p.setAttribute('title', self._info(c.id).name || c.id);
      p.addEventListener('click', function () { self.select(c.id, true); });
      self.shelf.appendChild(p);
    });
    this._markSelected();
  };

  Editor.prototype.renderScenes = function () {
    var self = this, scenes = this.ctx.project.scenes;
    this.scenesEl.innerHTML = '';
    scenes.forEach(function (sc, i) {
      var t = el('button', 'kc-scene' + (i === self.cur ? ' kc-on' : ''), ART.backgrounds[sc.background]().replace('kc-bg', 'kc-thumb'));
      t.appendChild(el('span', 'kc-scene-n', String(i + 1)));
      t.setAttribute('aria-label', 'दृश्य ' + SCENE_WORDS[i]);
      t.setAttribute('data-i', i);
      t.addEventListener('click', function () {
        self.audio.sfx('scene');
        self.audio.speak('दृश्य ' + SCENE_WORDS[i] + ', ' + KC._sceneTemplate(self.kit, sc.template).title, 'scene-' + i);
        self.goToScene(i, false);
      });
      self.scenesEl.appendChild(t);
    });
    if (scenes.length < MAX_SCENES && !this.challenge) {
      var add = el('button', 'kc-scene kc-scene-add', BTN_ICONS.plus);
      add.setAttribute('aria-label', 'नया दृश्य');
      add.addEventListener('click', function () { self.addScene(); });
      this.scenesEl.appendChild(add);
    }
  };

  Editor.prototype.renderPalette = function () {
    var self = this, opts = this._blockOpts();
    Object.keys(this.tabEls).forEach(function (c) { self.tabEls[c].classList.toggle('kc-on', c === self.cat); });
    this.palette.innerHTML = '';
    B.paletteFor(this.cat, this._info(this.selected)).forEach(function (type) {
      var d = B.DEFS[type];
      var blk = { type: type, param: d.kind ? d.def : undefined };
      if (d.kind === 'clip') (KC._clips || []).some(function (c, i) { if (c) { blk.param = i; return true; } return false; });
      var be = B.render(blk, opts);
      self._bindDrag(be, { from: 'palette', block: blk });
      self.palette.appendChild(be);
    });
  };

  Editor.prototype.renderStrip = function (popIndex) {
    var self = this, strip = this.strip(), opts = this._blockOpts();
    this.stripEl.innerHTML = '';
    if (!strip.length) {
      this.stripEl.appendChild(el('div', 'kc-empty-slot', '+'));
      return;
    }
    strip.forEach(function (blk, i) {
      var be = B.render(blk, opts);
      if (i === popIndex) be.classList.add('kc-pop');
      self._bindDrag(be, { from: 'strip', index: i });
      self.stripEl.appendChild(be);
    });
  };

  Editor.prototype._markSelected = function () {
    var self = this;
    var ps = this.shelf.querySelectorAll('.kc-portrait');
    for (var i = 0; i < ps.length; i++) ps[i].classList.toggle('kc-selected', ps[i].getAttribute('data-id') === this.selected);
    Object.keys(this.charEls).forEach(function (id) { self.charEls[id].classList.toggle('kc-picked', id === self.selected); });
  };

  Editor.prototype.select = function (id, speak) {
    if (speak) { this.audio.sfx('tap'); this.audio.speak(this._info(id).name, 'char-' + id); }
    if (this.selected === id) return;
    this.selected = id;
    this._markSelected();
    this.renderPalette();
    this.renderStrip();
    this._hint();
  };

  /* ================= scenes ================= */
  Editor.prototype.goToScene = function (i, autoplay) {
    var scenes = this.ctx.project.scenes;
    if (i < 0 || i >= scenes.length) return;
    this.runtime.stop();
    this.cur = i;
    var keep = this.selected;
    this.selected = this.charData(keep) ? keep : this.scene().characters[0].id;
    this.renderAll();
    if (autoplay) { this.audio.sfx('scene'); this.runtime.play(); }
  };

  Editor.prototype.addScene = function () {
    var scenes = this.ctx.project.scenes;
    if (scenes.length >= MAX_SCENES) return;
    this.history.push(this._snapshot());
    // Next story place in order (the kit's scenes follow the story).
    scenes.push(KC._newScene(this.kit, scenes.length));
    this.audio.sfx('pop');
    this.audio.speak('नया दृश्य, ' + KC._sceneTemplate(this.kit, scenes[scenes.length - 1].template).title, 'scene-new');
    this.goToScene(scenes.length - 1, false);
    this.changed();
  };

  /* ---- stage geometry: logical units -> pixels ---- */
  Editor.prototype._layout = function () {
    this._hint();
    var r = this.stageBox.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var w = Math.min(r.width, r.height * ART.aspect), h = w / ART.aspect;
    this.stage.style.width = w + 'px';
    this.stage.style.height = h + 'px';
    this.scale = w / ART.stageW;
    var ch = ART.charH * this.scale, cw = ch * 100 / 150;
    var self = this;
    Object.keys(this.charEls).forEach(function (id) {
      self.charEls[id].style.width = cw + 'px';
      self.charEls[id].style.height = ch + 'px';
      if (self.runtime && self.runtime.state[id]) self._place(id, self.runtime.state[id]);
    });
  };

  Editor.prototype._place = function (id, s) {
    var ce = this.charEls[id];
    if (!ce) return;
    var k = this.scale, ch = ART.charH * k, cw = ch * 100 / 150, sc = s.scale || 1;
    var px = s.x * k - cw / 2;
    var py = (s.y - (s.air || 0) - (s.bob || 0)) * k - ch;
    ce.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)';
    ce.style.zIndex = String(Math.round(s.y * 10 + (s.air > 0.5 ? 500 : 0)));
    ce._sprite.style.transform = 'scale(' + ((s.dir < 0 ? -1 : 1) * sc).toFixed(3) + ',' + sc.toFixed(3) + ')';
    // Hidden characters vanish while playing, and show faintly while building.
    var op = s.visible === false ? (this.isRunning ? '0' : '0.3') : '1';
    if (ce.style.opacity !== op) ce.style.opacity = op;
    var airborne = (s.air || 0) > 0.5;
    if (airborne !== !!ce._air) { ce._air = airborne; ce.classList.toggle('kc-airborne', airborne); }
    if (ce._mood !== s.mood) { ce._mood = s.mood; this._applyFace(ce, s.mood); }
    if (this.bubbles[id] && !this.bubbles[id].hidden) this._placeBubble(id);
  };

  Editor.prototype._applyFace = function (ce, mood) {
    var f = ce._face;
    if (!f.eyes || !f.mouth) return;
    if (mood == null || mood < 0) { f.eyes.innerHTML = f.eyes0; f.mouth.innerHTML = f.mouth0; return; }
    var m = ART.face(ce._sprite_name, mood);
    if (m) { f.eyes.innerHTML = m.eyes; f.mouth.innerHTML = m.mouth; }
  };

  /* ---- speech bubbles ---- */
  Editor.prototype._say = function (id, ph) {
    var b = this.bubbles[id];
    if (!ph) { if (b) b.hidden = true; return; }
    if (!b) {
      b = el('div', 'kc-bubble');
      this.stage.appendChild(b);
      this.bubbles[id] = b;
    }
    b.innerHTML = '<div class="kc-bubble-pic">' + ART.pic(ph.icon) + '</div><div class="kc-bubble-text">' + ph.text + '</div>';
    b.hidden = false;
    b.classList.remove('kc-pop'); void b.offsetWidth; b.classList.add('kc-pop');
    this._placeBubble(id);
  };
  Editor.prototype._placeBubble = function (id) {
    var s = this.runtime.state[id], b = this.bubbles[id];
    if (!s || !b) return;
    var k = this.scale;
    var x = Math.max(14, Math.min(86, s.x)) * k;
    var y = Math.max(0, (s.y - s.air - ART.charH * (s.scale || 1) * 0.95)) * k;
    b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-100%)';
    b.classList.toggle('kc-bubble-low', y < 70);
  };

  /* ---- finish celebration: diyas light up, marigold petals fall ---- */
  Editor.prototype._celebrate = function () {
    var old = this.stage.querySelector('.kc-celebrate');
    if (old) old.parentNode.removeChild(old);
    var c = el('div', 'kc-celebrate'), row = el('div', 'kc-diyas'), i;
    for (i = 0; i < 7; i++) {
      var d = el('div', 'kc-diya', ART.diya());
      d.style.animationDelay = (i * 0.12) + 's';
      row.appendChild(d);
    }
    c.appendChild(row);
    var colors = ['#F28C1B', '#F7C531', '#E85A1B', '#FFB13B'];
    for (i = 0; i < 26; i++) {
      var p = el('i', 'kc-petal');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 1.6) + 's';
      p.style.animationDuration = (2.4 + Math.random() * 1.6) + 's';
      c.appendChild(p);
    }
    this.stage.appendChild(c);
    clearTimeout(this._celebTimer);
    this._celebTimer = setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 6000);
    // In the child's own game, the finish block also shows the finish card.
    var self = this;
    if (this.ctx.onFinish) {
      clearTimeout(this._finishTimer);
      this._finishTimer = setTimeout(function () { self.ctx.onFinish(); }, 1800);
    }
  };

  Editor.prototype._setRunning = function (r) {
    this.isRunning = r;
    this._hint();
    this.btnPlay.classList.toggle('kc-running', r);
    var self = this;
    Object.keys(this.runtime.state).forEach(function (id) { self._place(id, self.runtime.state[id]); });
  };

  Editor.prototype._highlight = function (id, i, on) {
    if (id === null) {
      var all = this.stripEl.querySelectorAll('.kc-active');
      for (var k = 0; k < all.length; k++) all[k].classList.remove('kc-active');
      return;
    }
    if (id !== this.selected) return;
    var b = this.stripEl.children[i];
    if (b && b.classList.contains('kc-block')) b.classList.toggle('kc-active', on);
  };

  /* ================= characters on stage ================= */
  Editor.prototype._bindCharacter = function (ce, id) {
    var self = this;
    ce.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      var start = { x: e.clientX, y: e.clientY }, moved = false, snap = null, offset = null;
      function move(ev) {
        var dx = ev.clientX - start.x, dy = ev.clientY - start.y;
        if (!moved && Math.sqrt(dx * dx + dy * dy) > DRAG_START) {
          moved = true;
          self.runtime.stop();
          snap = self._snapshot();
          self.select(id, false);
          var s0 = self.runtime.state[id];
          offset = { x: s0.x, y: s0.y - s0.air };
        }
        if (moved) {
          var s = self.runtime.state[id];
          s.x = Math.max(2, Math.min(98, offset.x + dx / self.scale));
          s.y = Math.max(20, Math.min(61, offset.y + dy / self.scale));
          s.air = 0;
          self._place(id, s);
        }
      }
      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        if (!moved) {
          self.select(id, true);
          self.runtime.tap(id);
          return;
        }
        // Story rule: a character can only be placed where the story allows (on its land).
        var s = self.runtime.state[id], c = self.charData(id);
        var spot = self.runtime.snapToLand(id, s.x, s.y);
        self.history.push(snap);
        c.x = Math.round(spot.x * 10) / 10;
        c.y = Math.round(spot.y * 10) / 10;
        c.air = 0;
        var back = Math.abs(spot.x - s.x) > 0.5 || Math.abs(spot.y - s.y) > 0.5;
        self.audio.sfx(back ? 'bump' : 'snap');
        self.runtime.resetOne(c);
        self.changed();
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
  };

  /* ================= blocks: drag, drop, tap ================= */
  Editor.prototype._bindDrag = function (be, src) {
    var self = this;
    // Keyboard / switch access: Enter or Space taps the block (adds it, or changes its value).
    be.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self._tapBlock(src, be); }
    });
    be.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      var start = { x: e.clientX, y: e.clientY }, ghost = null, lastIdx = -1;
      var block = src.from === 'palette' ? src.block : self.strip()[src.index];

      function move(ev) {
        var dx = ev.clientX - start.x, dy = ev.clientY - start.y;
        if (!ghost && Math.sqrt(dx * dx + dy * dy) > DRAG_START) {
          ghost = B.render(block, self._blockOpts());
          ghost.classList.add('kc-ghost');
          self.root.appendChild(ghost);
          if (src.from === 'strip') be.classList.add('kc-hidden');
          self.audio.sfx('tap');
          self.audio.speak(self._voice(block.type), 'block-' + block.type);
          if (self.hand) self.hand.hidden = true;
        }
        if (!ghost) return;
        ghost.style.left = (ev.clientX - 34) + 'px';
        ghost.style.top = (ev.clientY - 34) + 'px';
        if (self._overStrip(ev.clientX, ev.clientY)) {
          self.stripEl.classList.add('kc-hot');
          var idx = self._dropIndex(ev.clientX, be);
          if (idx !== lastIdx) { lastIdx = idx; self._showMarker(idx, be); }
        } else {
          self.stripEl.classList.remove('kc-hot');
          lastIdx = -1; self._hideMarker();
        }
      }

      function up(ev) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        self.stripEl.classList.remove('kc-hot');
        self._hideMarker();
        if (!ghost) { self._tapBlock(src, be); return; }
        ghost.parentNode.removeChild(ghost);
        var over = ev.type !== 'pointercancel' && self._overStrip(ev.clientX, ev.clientY);
        if (src.from === 'palette') {
          if (over) self._insert({ type: block.type, param: block.param }, self._dropIndex(ev.clientX, null));
        } else if (over) {
          self._move(src.index, self._dropIndex(ev.clientX, be));
        } else {
          self._delete(src.index, ev.clientX, ev.clientY);
        }
      }

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
  };

  Editor.prototype._overStrip = function (x, y) {
    var r = this.stripEl.getBoundingClientRect();
    return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - MAGNET && y <= r.bottom + MAGNET;
  };

  // Index among the visible blocks (the one being dragged is skipped).
  Editor.prototype._dropIndex = function (x, skipEl) {
    var kids = this.stripEl.querySelectorAll('.kc-block'), n = 0;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i] === skipEl) continue;
      var r = kids[i].getBoundingClientRect();
      if (x > r.left + r.width / 2) n++;
    }
    return n;
  };

  Editor.prototype._showMarker = function (idx, skipEl) {
    if (!this.marker) this.marker = el('div', 'kc-marker');
    var empty = this.stripEl.querySelector('.kc-empty-slot');
    if (empty) empty.style.display = 'none';
    var kids = [], all = this.stripEl.querySelectorAll('.kc-block');
    for (var i = 0; i < all.length; i++) if (all[i] !== skipEl) kids.push(all[i]);
    if (idx < kids.length) this.stripEl.insertBefore(this.marker, kids[idx]);
    else this.stripEl.appendChild(this.marker);
  };
  Editor.prototype._hideMarker = function () {
    if (this.marker && this.marker.parentNode) this.marker.parentNode.removeChild(this.marker);
    var empty = this.stripEl.querySelector('.kc-empty-slot');
    if (empty) empty.style.display = '';
  };

  // Only one trigger per strip, and it always sits at the front like a train engine.
  Editor.prototype._normalize = function (strip, keep) {
    var trig = (keep && B.DEFS[keep.type].trigger) ? keep : null;
    for (var i = 0; i < strip.length; i++) {
      if (!trig && B.DEFS[strip[i].type].trigger) trig = strip[i];
    }
    for (var j = strip.length - 1; j >= 0; j--) {
      if (B.DEFS[strip[j].type].trigger) strip.splice(j, 1);   // drop all triggers…
    }
    if (trig) strip.unshift(trig);                               // …then put the one we keep in front
    return strip.indexOf(keep);
  };

  Editor.prototype._insert = function (blk, idx) {
    this.history.push(this._snapshot());
    var strip = this.strip();
    strip.splice(Math.min(idx, strip.length), 0, blk);
    var at = this._normalize(strip, blk);
    this.audio.sfx('snap');
    this.renderStrip(at);
    this._scrollStripTo(at);
    this.changed();
  };

  Editor.prototype._move = function (from, to) {
    var strip = this.strip();
    if (from === to) { this.renderStrip(); return; }
    this.history.push(this._snapshot());
    var item = strip.splice(from, 1)[0];
    strip.splice(Math.min(to, strip.length), 0, item);
    var at = this._normalize(strip, item);
    this.audio.sfx('snap');
    this.renderStrip(at);
    this.changed();
  };

  Editor.prototype._delete = function (idx, x, y) {
    this.history.push(this._snapshot());
    this.strip().splice(idx, 1);
    var p = el('div', 'kc-poof');
    p.style.left = (x - 35) + 'px'; p.style.top = (y - 35) + 'px';
    this.root.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 500);
    this.audio.sfx('poof');
    this.renderStrip();
    this.changed();
  };

  Editor.prototype._tapBlock = function (src, be) {
    var self = this, opts = this._blockOpts();
    if (src.from === 'palette') {
      // Tap = add to the end of the train. Easiest possible way for a 4-year-old.
      this.audio.speak(this._voice(src.block.type), 'block-' + src.block.type);
      this._insert({ type: src.block.type, param: src.block.param }, this.strip().length);
      return;
    }
    var blk = this.strip()[src.index], d = B.DEFS[blk.type];
    if (d.kind) {
      // Tap a block in the train: its value changes and the character shows it.
      this.history.push(this._snapshot());
      blk.param = B.nextValue(blk, opts);
      B.refresh(be, blk, opts);
      if (blk.type !== 'say') this.audio.speak(B.paramWord(blk, opts), 'param-' + blk.type + '-' + blk.param);
      this.changed();
    } else {
      this.audio.speak(this._voice(blk.type), 'block-' + blk.type);
    }
    be.classList.remove('kc-pop'); void be.offsetWidth; be.classList.add('kc-pop');
    if (d.trigger) {
      // Tapping the engine runs the whole train for this character.
      this.runtime.runStrip(this.selected);
    } else if (['send', 'stop', 'next', 'repeat'].indexOf(blk.type) < 0) {
      setTimeout(function () { self.runtime.preview(self.selected, blk); }, 150);
    }
  };

  Editor.prototype._scrollStripTo = function (i) {
    var b = this.stripEl.children[i];
    if (b && b.scrollIntoView) { try { b.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (e) { /* old Safari */ } }
  };

  /* ================= undo + save ================= */
  Editor.prototype._snapshot = function () { return JSON.stringify({ scenes: this.ctx.project.scenes, cur: this.cur }); };

  Editor.prototype.undo = function () {
    if (!this.history.length) {
      this.audio.sfx('nope');
      this.btnUndo.classList.remove('kc-shake'); void this.btnUndo.offsetWidth; this.btnUndo.classList.add('kc-shake');
      return;
    }
    this.runtime.stop();
    var snap = JSON.parse(this.history.pop());
    this.ctx.project.scenes = snap.scenes;
    this.cur = Math.min(snap.cur, snap.scenes.length - 1);
    this.audio.sfx('undo');
    this.renderAll();
    this.changed();
  };

  Editor.prototype.changed = function () {
    this._hint();
    if (this.history.length > 60) this.history.shift();
    this.ctx.project.updatedAt = Date.now();
    this.ctx.save();
  };

  Editor.prototype.destroy = function () {
    this.runtime.stop();
    clearTimeout(this._celebTimer);
    clearTimeout(this._finishTimer);
    cancelAnimationFrame(this._hintRaf);
    if (this.hand && this.hand.parentNode) this.hand.parentNode.removeChild(this.hand);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('orientationchange', this._onResize);
    if (this._ro) this._ro.disconnect();
    if (this.app.parentNode) this.app.parentNode.removeChild(this.app);
  };

  KC._Editor = Editor;
})(window.KathaCode = window.KathaCode || {});
