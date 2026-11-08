/* Katha Code — story picker and story sheet.
   Picker: one section (Ramayan · Gita · Upanishad) at a time, as picture cards.
   Sheet: tapping a card tells the story in Hindi (≈20 seconds) while the
   characters sway, and offers: watch the story game · make my own · 3 challenges. */
(function (KC) {
  'use strict';

  var ART = KC._art;
  var SECTION_PIC = { ramayan: 'sun', gita: 'wheel', upanishad: 'om' };
  var ICON = {
    back:  '<svg viewBox="0 0 40 40"><path d="M24 8 L12 20 L24 32" fill="none" stroke="#C96A06" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play:  '<svg viewBox="0 0 40 40"><path d="M13 8 L32 20 L13 32 Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>',
    hand:  '<svg viewBox="0 0 40 40"><path d="M15 34 L9 22 Q8 19 11 19 L14 23 V8 Q14 5 17 5 Q20 5 20 8 V18 V12 Q20 9 23 9 Q26 9 26 12 V19 V15 Q26 12 29 12 Q32 12 32 15 V26 Q32 34 24 34 Z" fill="#fff"/></svg>',
    speak: '<svg viewBox="0 0 40 40"><path d="M7 15 H13 L21 8 V32 L13 25 H7 Z" fill="#C96A06"/><path d="M26 14 Q30 20 26 26 M30 10 Q37 20 30 30" fill="none" stroke="#C96A06" stroke-width="3" stroke-linecap="round"/></svg>',
    star:  '<svg viewBox="0 0 40 40"><path d="M20 4 L24.5 14.5 L36 15.5 L27 23 L30 34 L20 28 L10 34 L13 23 L4 15.5 L15.5 14.5 Z"/></svg>'
  };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  // A scene picture: background + characters where the story puts them.
  KC._sceneArt = function (kit, sceneIndex) {
    var sc = kit.scenes[sceneIndex || 0], A = ART;
    var html = A.backgrounds[sc.background]();
    sc.cast.forEach(function (c) {
      if (c.hidden) return;
      var info = kit.characters[c.id], size = c.size || info.size || 1;
      var h = A.charH * size, w = h * 100 / 150, air = info.canFly ? (c.air || 0) : 0;
      var flip = c.face ? c.face < 0 : c.x > 50;
      html += '<div class="kc-art-char" style="left:' + ((c.x - w / 2) / A.stageW * 100) + '%;top:' + ((c.y - air - h) / A.stageH * 100) + '%;' +
        'width:' + (w / A.stageW * 100) + '%;height:' + (h / A.stageH * 100) + '%;">' +
        '<div class="kc-art-sprite"' + (flip ? ' style="transform:scaleX(-1)"' : '') + '>' + A.characters[c.sprite || info.sprite]() + '</div></div>';
    });
    return html;
  };

  // A saved game's picture: its first scene with the characters where the child left them.
  KC._projectArt = function (project) {
    var kit = KC._kits[project.storyId], sc = project.scenes[0], A = ART;
    var tpl = KC._sceneTemplate(kit, sc.template), html = A.backgrounds[sc.background]();
    sc.characters.forEach(function (c) {
      var castEntry = {};
      tpl.cast.forEach(function (e) { if (e.id === c.id) castEntry = e; });
      if (castEntry.hidden) return;
      var info = kit.characters[c.id], size = castEntry.size || info.size || 1;
      var h = A.charH * size, w = h * 100 / 150, air = info.canFly ? (c.air || 0) : 0;
      var flip = castEntry.face ? castEntry.face < 0 : c.x > 50;
      html += '<div class="kc-art-char" style="left:' + ((c.x - w / 2) / A.stageW * 100) + '%;top:' + ((c.y - air - h) / A.stageH * 100) + '%;' +
        'width:' + (w / A.stageW * 100) + '%;height:' + (h / A.stageH * 100) + '%;">' +
        '<div class="kc-art-sprite"' + (flip ? ' style="transform:scaleX(-1)"' : '') + '>' + A.characters[c.sprite]() + '</div></div>';
    });
    return html;
  };

  function Picker(root, opts) {
    this.root = root;
    this.audio = opts.audio;
    this.onChoose = opts.onChoose;     // (kitId, mode, challengeIndex)
    this.progress = opts.progress;     // () => { kitId: [bool, bool, bool] }
    this.onHome = opts.onHome;         // back from a section to the home screen
    this.section = 'ramayan';
    this.el = el('div', 'kc-overlay kc-picker');
    this.sheet = el('div', 'kc-overlay kc-sheet');
    this.el.hidden = true;
    this.sheet.hidden = true;
    root.appendChild(this.el);
    root.appendChild(this.sheet);
  }

  Picker.prototype._stars = function (kitId) {
    var p = (this.progress() || {})[kitId] || [];
    return [0, 1, 2].map(function (i) { return !!p[i]; });
  };

  // One section (Ramayan, Gita or Upanishad): its story cards in a grid.
  Picker.prototype.render = function () {
    var self = this, sec = KC.SECTIONS.filter(function (x) { return x.id === self.section; })[0];
    this.el.innerHTML = '';
    this.el.className = 'kc-overlay kc-picker kc-sec-' + sec.id;
    var head = el('div', 'kc-picker-head');
    var back = el('button', 'kc-btn kc-exit', ICON.back);
    back.setAttribute('aria-label', 'वापस');
    back.addEventListener('click', function () { self.audio.sfx('tap'); self.audio.speak('वापस', 'back'); self.hide(); self.onHome(); });
    head.appendChild(back);
    var label = el('button', 'kc-sec-label', '<span class="kc-sec-pic">' + ART.pic(SECTION_PIC[sec.id]) + '</span><span>' + KC.t(sec.title, sec.titleEn) + '</span>');
    label.addEventListener('click', function () { self.audio.unlock(); self.audio.speak(sec.title, 'section-' + sec.id); });
    head.appendChild(label);
    this.el.appendChild(head);
    var cards = el('div', 'kc-cards kc-cards-grid');
    KC._kitOrder.forEach(function (id) {
      var kit = KC._kits[id];
      if (kit.section !== sec.id) return;
      var stars = self._stars(id).filter(Boolean).length;
      var card = el('button', 'kc-card',
        '<div class="kc-card-art">' + KC._sceneArt(kit, 0) + '</div>' +
        '<div class="kc-card-title">' + KC.t(kit.title, kit.titleEn) + '</div>' +
        '<div class="kc-card-stars" aria-label="' + stars + ' / 3">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < stars ? 'kc-on' : '') + '">' + ICON.star + '</i>'; }).join('') + '</div>');
      card.setAttribute('aria-label', kit.title);
      card.setAttribute('data-kit', id);
      card.addEventListener('click', function () { self.audio.unlock(); self.audio.sfx('tap'); self.showKit(id); });
      cards.appendChild(card);
    });
    this.el.appendChild(cards);
  };

  Picker.prototype.show = function (sectionId) {
    this.stopNarration();
    if (sectionId) this.section = sectionId;
    this.render();
    this.sheet.hidden = true;
    this.el.hidden = false;
  };

  Picker.prototype.hide = function () {
    this.stopNarration();
    this.el.hidden = true;
    this.sheet.hidden = true;
  };

  Picker.prototype.stopNarration = function () {
    clearTimeout(this._bobTimer);
    var art = this.sheet.querySelector('.kc-sheet-art');
    if (art) art.classList.remove('kc-telling');
    this.audio.stopSpeech();
  };

  Picker.prototype.tell = function (kit) {
    var art = this.sheet.querySelector('.kc-sheet-art');
    if (!art) return;
    art.classList.add('kc-telling');
    this.audio.speak(kit.narration, 'story-' + kit.id);
    clearTimeout(this._bobTimer);
    this._bobTimer = setTimeout(function () { art.classList.remove('kc-telling'); }, 22000);
  };

  Picker.prototype.showKit = function (kitId, quiet) {
    var self = this, kit = KC._kits[kitId], stars = this._stars(kitId);
    this.section = kit.section;
    this.render();               // the section's cards sit behind the sheet, for "back"
    this.el.hidden = false;
    var s = this.sheet;
    s.innerHTML = '';
    var card = el('div', 'kc-sheet-card');
    var back = el('button', 'kc-btn kc-sheet-back', ICON.back);
    back.setAttribute('aria-label', 'वापस');
    back.addEventListener('click', function () { self.audio.sfx('tap'); self.audio.speak('वापस', 'back'); self.show(kit.section); });

    var art = el('div', 'kc-sheet-art', KC._sceneArt(kit, 0));
    art.setAttribute('role', 'button');
    art.setAttribute('aria-label', 'कहानी सुनो');
    art.addEventListener('click', function () { self.tell(kit); });

    var side = el('div', 'kc-sheet-side');
    this.section = kit.section;
    var title = el('div', 'kc-sheet-title', KC.t(kit.title, kit.titleEn));
    var value = el('div', 'kc-sheet-value', kit.value);
    var src = el('div', 'kc-sheet-src', kit.source);
    var listen = el('button', 'kc-btn kc-sheet-listen', ICON.speak);
    listen.setAttribute('aria-label', 'कहानी सुनो');
    listen.addEventListener('click', function () { self.audio.unlock(); self.tell(kit); });

    var acts = el('div', 'kc-sheet-acts');
    var ex = el('button', 'kc-act kc-act-example', '<span class="kc-act-ic">' + ICON.play + '</span><span>कहानी का खेल</span>');
    ex.addEventListener('click', function () { self.audio.speak('कहानी का खेल', 'mode-example'); self.hide(); self.onChoose(kitId, 'example'); });
    var own = el('button', 'kc-act kc-act-own', '<span class="kc-act-ic">' + ICON.hand + '</span><span>अपना खेल बनाओ</span>');
    own.addEventListener('click', function () { self.audio.speak('अपना खेल बनाओ', 'mode-build'); self.hide(); self.onChoose(kitId, 'build'); });
    acts.appendChild(ex); acts.appendChild(own);

    var chRow = el('div', 'kc-sheet-challenges');
    kit.challenges.forEach(function (c, i) {
      var b = el('button', 'kc-chal' + (stars[i] ? ' kc-done' : ''), ICON.star + '<b>' + (i + 1) + '</b>');
      b.setAttribute('aria-label', 'चुनौती ' + (i + 1));
      b.addEventListener('click', function () {
        self.audio.speak('चुनौती ' + ['एक', 'दो', 'तीन'][i], 'challenge-' + i);
        self.hide();
        self.onChoose(kitId, 'challenge', i);
      });
      chRow.appendChild(b);
    });

    side.appendChild(title); side.appendChild(value);
    var row = el('div', 'kc-sheet-row');
    row.appendChild(listen); row.appendChild(src);
    side.appendChild(row);
    side.appendChild(acts); side.appendChild(chRow);
    card.appendChild(art); card.appendChild(side);
    s.appendChild(back);
    s.appendChild(card);
    s.hidden = false;
    if (!quiet) this.tell(kit);
  };

  KC._Picker = Picker;
})(window.KathaCode = window.KathaCode || {});
