/* Katha Code — story kit engine.
   STORY RULE: game logic may vary what children build, but it must never
   contradict the source text. Each kit therefore records, as data:
     - source:     the text (and section / verse) it follows; anything taken
                   from folk tradition rather than scripture is labelled so
     - facts:      plain facts each scene is built on (for parents, reviewers
                   and future content writers)
     - characters: what each character can do in the story (fly, change
                   size, hide or appear) and only lines they actually say
     - scenes:     story places: where land is (no walking on water) and where
                   each character starts
   The runtime enforces abilities and places, so any game a child makes stays
   aligned with the story.

   Kits are written in a compact form in kits-*.js:
     example:    [ { charId: [['flag'], ['fly', 5], ['say', 'phraseKey']] }, ...per scene ]
     challenges: [ { goal: 'spoken goal', scene: 0, steps: { charId: [...same form] } } ]
   defineKit() turns phrase keys into numbers and blocks into objects. */
(function (KC) {
  'use strict';

  KC._kits = {};
  KC._kitOrder = [];

  KC.SECTIONS = [
    { id: 'ramayan',   title: 'रामायण',   titleEn: 'Ramayana',      chant: 'जय श्री राम' },
    { id: 'gita',      title: 'भगवद्गीता', titleEn: 'Bhagavad Gita', chant: 'जय श्री कृष्ण' },
    { id: 'upanishad', title: 'उपनिषद्',   titleEn: 'Upanishads',    chant: 'ॐ शान्तिः शान्तिः शान्तिः' }
  ];

  KC.MANTRA = 'हमें अपने मन को संतुलित रखना है, इसमें हमारा आत्मविकास समाया है।';

  function block(kit, charId, b) {
    var type = b[0], param = b[1];
    if (type === 'say' && typeof param === 'string') {
      var keys = (kit.characters[charId] && kit.characters[charId].phrases) || [];
      var idx = keys.indexOf(param);
      if (idx < 0) throw new Error('Kit ' + kit.id + ': ' + charId + ' does not say "' + param + '"');
      param = idx;
    }
    var out = { type: type };
    if (param !== undefined) out.param = param;
    return out;
  }
  function scripts(kit, map) {
    var out = {};
    Object.keys(map || {}).forEach(function (id) {
      out[id] = map[id].map(function (b) { return block(kit, id, b); });
    });
    return out;
  }

  KC._defineKit = function (kit) {
    var section = KC.SECTIONS.filter(function (s) { return s.id === kit.section; })[0];
    kit.chant = kit.chant || (section ? section.chant : 'जय श्री राम');
    kit.finishLine = KC.MANTRA;
    // Every phrase key a character uses must exist.
    Object.keys(kit.characters).forEach(function (id) {
      (kit.characters[id].phrases || []).forEach(function (k) {
        if (!kit.phrases[k]) throw new Error('Kit ' + kit.id + ': missing phrase ' + k);
      });
    });
    kit.scenes.forEach(function (sc) { sc.starter = scripts(kit, sc.starter); });
    kit.example = (kit.example || []).map(function (m) { return scripts(kit, m); });
    kit.challenges = (kit.challenges || []).map(function (c) {
      return { goal: c.goal, scene: c.scene || 0, steps: scripts(kit, c.steps) };
    });
    KC._kits[kit.id] = kit;
    KC._kitOrder.push(kit.id);
  };

  KC._sceneTemplate = function (kit, templateId) {
    for (var i = 0; i < kit.scenes.length; i++) if (kit.scenes[i].id === templateId) return kit.scenes[i];
    return kit.scenes[0];
  };

  function copy(blocks) { return (blocks || []).map(function (b) { return { type: b.type, param: b.param }; }); }

  // scriptsFor: optional { charId: [blocks] } to start with instead of the starter.
  KC._newScene = function (kit, tplIndex, scriptsFor) {
    var tpl = kit.scenes[tplIndex % kit.scenes.length];
    return {
      template: tpl.id,
      background: tpl.background,
      characters: tpl.cast.map(function (c) {
        var src = scriptsFor ? scriptsFor[c.id] : (tpl.starter && tpl.starter[c.id]);
        return {
          id: c.id, sprite: c.sprite || kit.characters[c.id].sprite,
          x: c.x, y: c.y, air: c.air || 0, scale: 1,
          scripts: [copy(src)]
        };
      })
    };
  };

  KC._newProjectFromKit = function (kitId) {
    var kit = KC._kits[kitId], now = Date.now();
    return { id: 'p' + now, title: kit.title, storyId: kit.id, scenes: [KC._newScene(kit, 0)], createdAt: now, updatedAt: now };
  };

  // The ready-made example game: every scene, with its example scripts.
  KC._exampleProject = function (kitId) {
    var kit = KC._kits[kitId], now = Date.now();
    return {
      id: 'ex' + now, title: kit.title, storyId: kit.id,
      scenes: kit.scenes.map(function (sc, i) { return KC._newScene(kit, i, kit.example[i] || {}); }),
      createdAt: now, updatedAt: now
    };
  };

  // A challenge starts from just its scene, with the starter blocks.
  KC._challengeProject = function (kitId, n) {
    var kit = KC._kits[kitId], ch = kit.challenges[n], now = Date.now();
    return { id: 'ch' + now, title: kit.title, storyId: kit.id, scenes: [KC._newScene(kit, ch.scene)], createdAt: now, updatedAt: now };
  };
})(window.KathaCode = window.KathaCode || {});
