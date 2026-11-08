/* Katha Code — entry point.
   Public API (the only global): window.KathaCode.mount(containerEl, options)
   options: { lang, onExit, storageKey, startKit, assetBase, voice, audioFiles }
     startKit:   open straight at one story's sheet (e.g. 'hanuman-leap')
     onExit:     shows a back button on the home screen that calls this (to return to Khel Khel Mein)
     audioFiles: keys of recorded Hindi .mp3 files in assets/audio, used only on
                 devices with no Hindi text-to-speech voice
   Returns: { destroy(), getProject() }

   Screens:  Home → section (story cards) → story sheet → editor (example · build · challenge)
             Home → My Games → editor (build)
             Home → (hold lock 3 s) → parents' area */
(function (KC) {
  'use strict';

  var ROTATE_ICON = '<svg viewBox="0 0 120 120"><rect x="38" y="18" width="44" height="84" rx="8" fill="none" stroke="#F28C1B" stroke-width="6"/><circle cx="60" cy="92" r="4" fill="#F28C1B"/></svg>';

  KC.mount = function (container, options) {
    var o = options || {};
    var store = new KC._Store(o.storageKey || 'katha-code');
    var settings = store.settings();
    if (o.voice === false) settings.voice = false;
    var progress = store.progress();

    var root = document.createElement('div');
    root.className = 'katha-code';
    root.setAttribute('lang', o.lang || 'hi');
    container.appendChild(root);

    var audio = new KC._Audio({ assetBase: o.assetBase || '', voice: settings.voice, sounds: settings.sounds, audioFiles: o.audioFiles });

    function applySettings(s) {
      settings = s;
      audio.voiceOn = s.voice;
      audio.sfxOn = s.sounds;
      KC._lang = s.lang;
      KC._clips = s.myVoice ? store.clips() : [];
    }
    applySettings(settings);

    var editor = null, project = null, current = null, timer = null, closeFinish = null;

    /* ---- saving: the child's own games autosave into My Games ---- */
    function saveNow() {
      clearTimeout(timer); timer = null;
      if (project && current && current.mode === 'build') store.saveGame(project);
    }
    function save() { clearTimeout(timer); timer = setTimeout(saveNow, 250); }
    window.addEventListener('pagehide', saveNow);
    document.addEventListener('visibilitychange', saveNow);

    function closeEditor() {
      saveNow();
      if (closeFinish) { closeFinish(); closeFinish = null; }
      if (editor) { editor.destroy(); editor = null; }
      project = null; current = null;     // a closed game is never saved again (e.g. after a reset)
    }
    function hideAll() {
      home.hide(); picker.hide(); games.hide(); parents.hide();
    }
    function keepOverlaysOnTop() {
      [home.el, picker.el, picker.sheet, games.el, parents.el, rotate].forEach(function (n) { root.appendChild(n); });
    }

    function open(kitId, mode, n, gameId) {
      closeEditor();
      hideAll();
      var kit = KC._kits[kitId];
      current = { kitId: kitId, mode: mode, n: n, from: gameId ? 'games' : 'sheet' };
      if (mode === 'build') {
        project = (gameId && store.loadGame(gameId)) || KC._newProjectFromKit(kitId);
      } else if (mode === 'example') {
        project = KC._exampleProject(kitId);
      } else {
        project = KC._challengeProject(kitId, n);
      }
      var challenge = mode === 'challenge' ? {
        index: n,
        data: kit.challenges[n],
        onDone: function () {
          var p = progress[kitId] || [false, false, false];
          p[n] = true; progress[kitId] = p;
          store.saveProgress(progress);
        }
      } : null;
      editor = new KC._Editor(root, {
        project: project, kit: kit, audio: audio, save: save, challenge: challenge, mode: mode,
        onHome: function () {
          var from = current && current.from;
          closeEditor();
          if (from === 'games') games.show(); else picker.showKit(kitId, true);
        },
        // Only the child's own game gets the finish card (and is marked finished in My Games).
        onFinish: mode === 'build' ? function () {
          if (!project) return;
          project.finished = true;
          saveNow();
          closeFinish = KC._showFinishCard(root, {
            project: project, kit: kit, audio: audio,
            onReplay: function () { closeFinish = null; if (editor) editor.runtime.play(); },
            onGames: function () { closeFinish = null; closeEditor(); games.show(); },
            onClose: function () { closeFinish = null; if (editor) editor.runtime.stop(); }
          });
        } : null
      });
      keepOverlaysOnTop();
      if (mode === 'example') setTimeout(function () { if (editor) editor.runtime.play(); }, 600);
      if (challenge) setTimeout(function () { if (editor) editor.sayGoal(); }, 400);
    }

    function showHome() { closeEditor(); hideAll(); home.show(); }

    var home = new KC._Home(root, {
      audio: audio,
      gameCount: function () { return store.listGames().length; },
      onExit: typeof o.onExit === 'function' ? function () { closeEditor(); o.onExit(); } : null,
      onDoor: function (id) {
        home.hide();
        if (id === 'games') games.show(); else picker.show(id);
      },
      onParents: function () { home.hide(); parents.show(); }
    });

    var picker = new KC._Picker(root, {
      audio: audio,
      progress: function () { return progress; },
      onChoose: function (kitId, mode, n) { open(kitId, mode, n); },
      onHome: showHome
    });

    var games = new KC._Games(root, {
      audio: audio, store: store,
      onOpen: function (id) {
        var g = store.listGames().filter(function (x) { return x.id === id; })[0];
        if (g) open(g.kitId, 'build', null, id);
      },
      onHome: showHome,
      onStart: function () { picker.show('ramayan'); }
    });

    var parents = new KC._Parents(root, {
      audio: audio, store: store,
      onChange: function (s) { applySettings(s); progress = store.progress(); },
      onClose: showHome
    });

    var rotate = document.createElement('div');
    rotate.className = 'kc-overlay kc-rotate';
    rotate.innerHTML = ROTATE_ICON;
    root.appendChild(rotate);

    if (o.startKit && KC._kits[o.startKit]) { home.hide(); picker.showKit(o.startKit, true); }

    return {
      getProject: function () { return project ? JSON.parse(JSON.stringify(project)) : null; },
      destroy: function () {
        closeEditor();
        picker.stopNarration();
        parents.hide();
        window.removeEventListener('pagehide', saveNow);
        document.removeEventListener('visibilitychange', saveNow);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  };
})(window.KathaCode = window.KathaCode || {});
