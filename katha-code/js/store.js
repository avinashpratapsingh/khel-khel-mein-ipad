/* Katha Code — storage (localStorage, all wrapped so nothing ever throws).
   Keys, under one prefix (options.storageKey, default 'katha-code'):
     :settings   { voice, sounds, lang, myVoice }
     :progress   { kitId: [bool, bool, bool] }   challenge stars
     :games      [ { id, kitId, updatedAt, finished } ]   index, newest first
     :game:<id>  the project itself
     :clip:<n>   a recorded voice clip (data URL), n = 0..2
   Older saves (one project per kit, key :<kitId>) are moved into My Games once. */
(function (KC) {
  'use strict';

  var DEFAULTS = { voice: true, sounds: true, lang: 'hi', myVoice: false };
  var MAX_CLIPS = 3;

  // Accept a project only if everything in it still exists; upgrades older saves in place.
  KC._validProject = function (p) {
    if (!p || !p.scenes || !p.scenes.length || !KC._kits[p.storyId]) return false;
    var kit = KC._kits[p.storyId];
    return p.scenes.every(function (sc) {
      if (!sc.template) sc.template = kit.scenes[0].id;          // Phase 1 projects had one scene
      var tpl = KC._sceneTemplate(kit, sc.template);
      if (!KC._art.backgrounds[sc.background]) sc.background = tpl.background;
      return sc.characters && sc.characters.every(function (c) {
        return KC._art.characters[c.sprite] && kit.characters[c.id] && c.scripts &&
          c.scripts.every(function (s) { return s.every(function (b) { return !!KC._blocks.DEFS[b.type]; }); });
      });
    });
  };

  function Store(base) {
    this.base = base || 'katha-code';
    this._migrate();
  }

  Store.prototype._get = function (k) {
    try { var s = window.localStorage.getItem(this.base + k); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  };
  Store.prototype._set = function (k, v) {
    try { window.localStorage.setItem(this.base + k, JSON.stringify(v)); return true; } catch (e) { return false; }
  };
  Store.prototype._del = function (k) {
    try { window.localStorage.removeItem(this.base + k); } catch (e) { /* ignore */ }
  };

  /* ---- settings & stars ---- */
  Store.prototype.settings = function () {
    var s = this._get(':settings') || {}, out = {}, k;
    for (k in DEFAULTS) out[k] = s[k] == null ? DEFAULTS[k] : s[k];
    return out;
  };
  Store.prototype.saveSettings = function (s) { this._set(':settings', s); };
  Store.prototype.progress = function () { return this._get(':progress') || {}; };
  Store.prototype.saveProgress = function (p) { this._set(':progress', p); };

  /* ---- My Games ---- */
  Store.prototype.listGames = function () {
    var list = this._get(':games');
    return Array.isArray(list) ? list.filter(function (g) { return g && g.id && KC._kits[g.kitId]; }) : [];
  };
  Store.prototype.loadGame = function (id) {
    var p = this._get(':game:' + id);
    return KC._validProject(p) ? p : null;
  };
  Store.prototype.saveGame = function (p) {
    if (!p || !p.id) return false;
    var ok = this._set(':game:' + p.id, p);
    var list = this.listGames().filter(function (g) { return g.id !== p.id; });
    list.unshift({ id: p.id, kitId: p.storyId, updatedAt: p.updatedAt || Date.now(), finished: !!p.finished });
    this._set(':games', list);
    return ok;
  };
  Store.prototype.deleteGame = function (id) {
    this._del(':game:' + id);
    this._set(':games', this.listGames().filter(function (g) { return g.id !== id; }));
  };

  /* ---- recorded voice clips ---- */
  Store.prototype.clips = function () {
    var out = [];
    for (var i = 0; i < MAX_CLIPS; i++) out.push(this._get(':clip:' + i));
    return out;
  };
  Store.prototype.saveClip = function (i, dataUrl) { return this._set(':clip:' + i, dataUrl); };
  Store.prototype.deleteClip = function (i) { this._del(':clip:' + i); };

  /* ---- backup ---- */
  Store.prototype.exportAll = function () {
    var self = this;
    return {
      format: 'katha-code-backup', version: 1, exportedAt: new Date().toISOString(),
      progress: this.progress(),
      games: this.listGames().map(function (g) { return self._get(':game:' + g.id); }).filter(Boolean)
    };
  };
  // Adds games that are not here yet and merges stars. Returns the number of games added (or -1 if not a backup).
  Store.prototype.importAll = function (data) {
    if (!data || data.format !== 'katha-code-backup' || !Array.isArray(data.games)) return -1;
    var have = {}, added = 0, self = this;
    this.listGames().forEach(function (g) { have[g.id] = true; });
    data.games.slice().reverse().forEach(function (p) {
      if (!p || have[p.id] || !KC._validProject(p)) return;
      if (self.saveGame(p)) added++;
    });
    var prog = this.progress();
    Object.keys(data.progress || {}).forEach(function (k) {
      if (!KC._kits[k]) return;
      var a = prog[k] || [false, false, false], b = data.progress[k] || [];
      prog[k] = [0, 1, 2].map(function (i) { return !!(a[i] || b[i]); });
    });
    this.saveProgress(prog);
    return added;
  };

  Store.prototype.resetAll = function () {
    var self = this;
    this.listGames().forEach(function (g) { self._del(':game:' + g.id); });
    this._del(':games'); this._del(':progress');
    for (var i = 0; i < MAX_CLIPS; i++) this._del(':clip:' + i);
  };

  /* ---- one-time move of Phase 1–3 saves (one project per kit) into My Games ---- */
  Store.prototype._migrate = function () {
    var self = this;
    (KC._kitOrder || []).forEach(function (kitId) {
      var old = self._get(':' + kitId);
      if (!old) return;
      if (KC._validProject(old)) {
        old.storyId = kitId;
        old.id = old.id || ('p' + Date.now() + kitId);
        if (!self._get(':game:' + old.id)) self.saveGame(old);
      }
      self._del(':' + kitId);
    });
  };

  KC._Store = Store;
  KC._MAX_CLIPS = MAX_CLIPS;
})(window.KathaCode = window.KathaCode || {});
