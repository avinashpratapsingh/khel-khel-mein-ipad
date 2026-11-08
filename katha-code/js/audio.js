/* Katha Code — sound.
   1. speak(): Hindi voice, in this order:
        a. the Android app's speech bridge (window.AndroidTTS), because Android
           WebView has no browser speech
        b. the Web Speech API with a Hindi (hi-IN) voice (browsers, iPad)
        c. a recorded /assets/audio/<key>.mp3, only if listed in options.audioFiles
      otherwise it stays silent: never an error.
   2. sfx(): tiny sound effects synthesized with Web Audio, so they work
      offline with no files and respond in well under 100 ms. */
(function (KC) {
  'use strict';

  function Audio_(opts) {
    this.base = opts.assetBase || '';
    this.voiceOn = opts.voice !== false;
    this.sfxOn = opts.sounds !== false;
    this.clipPlayer = null;
    this.ctx = null;
    this.hindiVoice = null;
    this.player = null;
    this.files = {};
    (opts.audioFiles || []).forEach(function (k) { this.files[k] = true; }, this);
    this._findVoice();
    var self = this;
    try {
      if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.addEventListener('voiceschanged', function () { self._findVoice(); });
      }
    } catch (e) { /* ignore */ }
  }

  Audio_.prototype._findVoice = function () {
    try {
      var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      for (var i = 0; i < vs.length; i++) {
        if (/^hi(-|_|$)/i.test(vs[i].lang)) { this.hindiVoice = vs[i]; return; }
      }
    } catch (e) { /* ignore */ }
  };

  // Must be called from a user tap (iOS rule) before any sound can play.
  Audio_.prototype.unlock = function () {
    try {
      if (!this.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (window.speechSynthesis) {               // iOS needs one utterance inside the gesture
        var u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
    } catch (e) { /* ignore */ }
  };

  Audio_.prototype._bridge = function () {
    var b = window.AndroidTTS;
    return b && typeof b.speak === 'function' ? b : null;
  };

  Audio_.prototype.stopSpeech = function () {
    try {
      var b = this._bridge();
      if (b && b.stop) b.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.player) this.player.pause();
    } catch (e) { /* ignore */ }
  };

  Audio_.prototype.speak = function (text, key) {
    if (!this.voiceOn || !text) return;
    try {
      var bridge = this._bridge();
      if (bridge) { bridge.speak(String(text)); return; }
      if (window.speechSynthesis && this.hindiVoice) {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.voice = this.hindiVoice;
        u.lang = this.hindiVoice.lang;
        u.rate = 0.9;
        u.pitch = 1.1;
        window.speechSynthesis.speak(u);
        return;
      }
      // Only ask for recordings that really exist (listed in options.audioFiles),
      // so a missing file never causes a network error.
      if (key && this.files[key]) {
        if (this.player) this.player.pause();
        this.player = new window.Audio(this.base + 'assets/audio/' + key + '.mp3');
        var p = this.player.play();
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) { /* stay silent */ }
  };

  // ---- synthesized effects ----
  Audio_.prototype._tone = function (type, f0, f1, dur, vol, delay) {
    var c = this.ctx;
    if (!c) return;
    try {
      var t = c.currentTime + (delay || 0);
      var o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { /* ignore */ }
  };

  // A tone with vibrato and a soft attack (used for shankh and flute).
  Audio_.prototype._voice = function (type, freq, dur, vol, delay, vibrato, filterHz) {
    var c = this.ctx;
    if (!c) return;
    try {
      var t = c.currentTime + (delay || 0);
      var o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      lfo.frequency.value = 5.5; lg.gain.value = vibrato || 0;
      lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.25, dur / 3));
      g.gain.setValueAtTime(vol, t + dur * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      var out = g;
      if (filterHz) { var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterHz; g.connect(f); out = f; }
      o.connect(g); out.connect(c.destination);
      o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    } catch (e) { /* ignore */ }
  };

  // A short noise burst (used for clap and the dhol's slap).
  Audio_.prototype._noise = function (dur, vol, delay, hz) {
    var c = this.ctx;
    if (!c) return;
    try {
      if (!this._nbuf) {
        var len = c.sampleRate * 0.5, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        this._nbuf = buf;
      }
      var t = c.currentTime + (delay || 0);
      var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = this._nbuf; f.type = 'bandpass'; f.frequency.value = hz || 1500; f.Q.value = 0.8;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start(t); s.stop(t + dur + 0.02);
    } catch (e) { /* ignore */ }
  };

  // Story sounds. Returns how long the sound lasts (ms), so blocks can wait for it.
  // Play a recorded clip (data URL). Resolves when it ends, fails, or after 8 seconds.
  Audio_.prototype.playClip = function (dataUrl) {
    var self = this;
    this.stopClip();
    return new Promise(function (resolve) {
      var done = false;
      function end() { if (!done) { done = true; resolve(); } }
      try {
        var p = new window.Audio(dataUrl);
        self.clipPlayer = p;
        p.onended = end; p.onerror = end;
        var r = p.play();
        if (r && r.catch) r.catch(end);
      } catch (e) { end(); }
      setTimeout(end, 8000);
    });
  };
  Audio_.prototype.stopClip = function () {
    try { if (this.clipPlayer) { this.clipPlayer.pause(); this.clipPlayer = null; } } catch (e) { /* ignore */ }
  };

  Audio_.prototype.sound = function (name, chant) {
    if (!this.sfxOn) return name === 'jai' ? (this.speak(chant || 'जय श्री राम', 'sound-jai'), 1500) : 600;
    var i;
    switch (name) {
      case 'shankh':   // conch: a deep, swelling note with its overtone
        this._voice('sawtooth', 233, 1.8, 0.11, 0, 3, 900);
        this._voice('triangle', 466, 1.8, 0.06, 0.05, 3);
        return 1900;
      case 'bell':     // temple bell: bright strike, long ring
        this._tone('sine', 880, 870, 1.6, 0.22); this._tone('sine', 2212, 2200, 0.9, 0.07); this._tone('sine', 1320, 1310, 1.2, 0.06);
        return 1400;
      case 'flute':    // bansuri: a short pentatonic phrase (Sa Re Ga Pa Ga)
        [523, 587, 659, 784, 659].forEach(function (f, k) { this._voice('sine', f, 0.38, 0.16, k * 0.34, 6); }, this);
        return 1800;
      case 'drum':     // dhol: dha - dhin - dha
        for (i = 0; i < 3; i++) {
          this._tone('sine', i === 1 ? 140 : 110, 50, 0.32, 0.45, i * 0.28);
          this._noise(0.07, 0.25, i * 0.28 + 0.01, 2200);
        }
        return 900;
      case 'clap':
        for (i = 0; i < 4; i++) { this._noise(0.09, 0.5, i * 0.22, 1600); this._noise(0.05, 0.3, i * 0.22 + 0.015, 2500); }
        return 900;
      case 'jai':
        this.speak(chant || 'जय श्री राम', 'sound-jai');
        this._tone('sine', 523, 523, 0.18, 0.1); this._tone('sine', 659, 659, 0.3, 0.1, 0.18);
        return 1500;
    }
    return 300;
  };

  Audio_.prototype.sfx = function (name) {
    if (!this.sfxOn) return;
    switch (name) {
      case 'tap':   this._tone('sine', 660, 880, 0.07, 0.15); break;
      case 'pop':   this._tone('sine', 420, 1100, 0.12, 0.22); break;
      case 'snap':  this._tone('triangle', 900, 600, 0.08, 0.2); this._tone('triangle', 1200, 900, 0.06, 0.12, 0.05); break;
      case 'poof':  this._tone('sawtooth', 500, 80, 0.25, 0.08); break;
      case 'step':  this._tone('triangle', 240, 200, 0.05, 0.08); break;
      case 'boing': this._tone('sine', 220, 700, 0.18, 0.2); this._tone('sine', 700, 350, 0.15, 0.12, 0.18); break;
      case 'whoosh':this._tone('sawtooth', 180, 900, 0.5, 0.05); this._tone('sine', 300, 1200, 0.5, 0.08); break;
      case 'bump':  this._tone('square', 160, 110, 0.12, 0.08); break;
      case 'play':  this._tone('sine', 523, 523, 0.1, 0.18); this._tone('sine', 659, 659, 0.1, 0.18, 0.1); this._tone('sine', 784, 784, 0.16, 0.18, 0.2); break;
      case 'stop':  this._tone('sine', 523, 330, 0.18, 0.18); break;
      case 'undo':  this._tone('sine', 800, 400, 0.15, 0.16); break;
      case 'nope':  this._tone('sine', 300, 260, 0.12, 0.12); break;
      case 'grow':  this._tone('sine', 300, 900, 0.35, 0.16); break;
      case 'shrink':this._tone('sine', 900, 300, 0.35, 0.16); break;
      case 'hide':  this._tone('triangle', 700, 200, 0.3, 0.1); break;
      case 'show':  this._tone('triangle', 200, 700, 0.3, 0.1); break;
      case 'send':  this._tone('sine', 660, 990, 0.12, 0.15); this._tone('sine', 990, 1320, 0.12, 0.12, 0.1); break;
      case 'scene': this._tone('sine', 440, 660, 0.25, 0.14); break;
      case 'finish':
        [523, 659, 784, 1047].forEach(function (f, k) { this._tone('sine', f, f, 0.35, 0.16, k * 0.15); }, this);
        this._tone('sine', 880, 870, 1.4, 0.12, 0.6);
        break;
    }
  };

  KC._Audio = Audio_;
})(window.KathaCode = window.KathaCode || {});
