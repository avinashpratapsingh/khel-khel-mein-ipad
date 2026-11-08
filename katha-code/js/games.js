/* Katha Code — "My Games" (मेरे खेल) and the finish card.
   My Games: every game the child has built, as a picture of where they left it.
   Deleting games is only possible in the parents' area, so nothing is lost by a stray tap.
   Finish card: when a child's own game reaches the red diya block, a card shows
   their game, the story's lesson and the mantra, with: play again · My Games · keep building. */
(function (KC) {
  'use strict';

  var ART = KC._art;
  var ICON = {
    back:  '<svg viewBox="0 0 40 40"><path d="M24 8 L12 20 L24 32" fill="none" stroke="#C96A06" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play:  '<svg viewBox="0 0 40 40"><path d="M13 8 L32 20 L13 32 Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>',
    hand:  '<svg viewBox="0 0 40 40"><path d="M15 34 L9 22 Q8 19 11 19 L14 23 V8 Q14 5 17 5 Q20 5 20 8 V18 V12 Q20 9 23 9 Q26 9 26 12 V19 V15 Q26 12 29 12 Q32 12 32 15 V26 Q32 34 24 34 Z" fill="#fff"/></svg>',
    games: '<svg viewBox="0 0 40 40"><rect x="5" y="5" width="13" height="13" rx="3" fill="#fff"/><rect x="22" y="5" width="13" height="13" rx="3" fill="#fff"/><rect x="5" y="22" width="13" height="13" rx="3" fill="#fff"/><rect x="22" y="22" width="13" height="13" rx="3" fill="#fff"/></svg>'
  };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function Games(root, opts) {
    this.root = root;
    this.audio = opts.audio;
    this.store = opts.store;
    this.onOpen = opts.onOpen;     // (gameId)
    this.onHome = opts.onHome;
    this.onStart = opts.onStart;   // empty state: go and pick a story
    this.el = el('div', 'kc-overlay kc-games');
    this.el.hidden = true;
    root.appendChild(this.el);
  }

  Games.prototype.render = function () {
    var self = this;
    this.el.innerHTML = '';
    var head = el('div', 'kc-picker-head');
    var back = el('button', 'kc-btn kc-exit', ICON.back);
    back.setAttribute('aria-label', 'वापस');
    back.addEventListener('click', function () { self.audio.sfx('tap'); self.audio.speak('वापस', 'back'); self.hide(); self.onHome(); });
    head.appendChild(back);
    head.appendChild(el('div', 'kc-sec-label kc-games-label', '<span class="kc-sec-pic">' + ART.pic('star') + '</span><span>' + KC.t('मेरे खेल', 'My Games') + '</span>'));
    this.el.appendChild(head);

    var list = this.store.listGames();
    if (!list.length) {
      var empty = el('div', 'kc-games-empty',
        '<div class="kc-games-empty-kids"><div>' + ART.characters.bittu() + '</div><div>' + ART.characters.prabal() + '</div></div>' +
        '<button class="kc-act kc-act-own"><span class="kc-act-ic">' + ICON.hand + '</span><span>' + KC.t('पहला खेल बनाओ', 'Make your first game') + '</span></button>');
      empty.querySelector('button').addEventListener('click', function () { self.audio.sfx('tap'); self.hide(); self.onStart(); });
      this.el.appendChild(empty);
      this.audio.speak('अभी कोई खेल नहीं है। आओ, पहला खेल बनाएँ!', 'games-empty');
      return;
    }
    var grid = el('div', 'kc-cards kc-cards-grid');
    list.forEach(function (g) {
      var p = self.store.loadGame(g.id);
      if (!p) return;
      var kit = KC._kits[g.kitId];
      var card = el('button', 'kc-card kc-game-card',
        '<div class="kc-card-art">' + KC._projectArt(p) + (g.finished ? '<span class="kc-game-diya">' + ART.diya() + '</span>' : '') +
        (p.scenes.length > 1 ? '<span class="kc-game-scenes">' + p.scenes.length + '</span>' : '') + '</div>' +
        '<div class="kc-card-title">' + KC.t(kit.title, kit.titleEn) + '</div>');
      card.setAttribute('aria-label', kit.title);
      card.setAttribute('data-game', g.id);
      card.addEventListener('click', function () { self.audio.unlock(); self.audio.sfx('tap'); self.audio.speak(kit.title, 'kit-' + kit.id); self.hide(); self.onOpen(g.id); });
      grid.appendChild(card);
    });
    this.el.appendChild(grid);
  };

  Games.prototype.show = function () { this.render(); this.el.hidden = false; };
  Games.prototype.hide = function () { this.el.hidden = true; };

  /* ---- finish card ---- */
  KC._showFinishCard = function (root, o) {
    // o: { project, kit, audio, onReplay, onGames, onClose }
    var old = root.querySelector('.kc-finish');
    if (old) old.parentNode.removeChild(old);
    var lit = '';
    for (var i = 0; i < 5; i++) lit += '<span class="kc-finish-diya" style="animation-delay:' + (i * 0.12) + 's">' + ART.diya() + '</span>';
    var card = el('div', 'kc-overlay kc-finish',
      '<div class="kc-finish-card">' +
        '<div class="kc-finish-art">' + KC._projectArt(o.project) + '</div>' +
        '<div class="kc-finish-side">' +
          '<div class="kc-finish-title">' + KC.t('शाबाश!', 'Well done!') + '</div>' +
          '<div class="kc-finish-lesson">' + o.kit.lesson.replace(/^शाबाश!\s*/, '') + '</div>' +
          '<div class="kc-finish-mantra">' + KC.MANTRA + '</div>' +
          '<div class="kc-finish-diyas">' + lit + '</div>' +
          '<div class="kc-finish-acts">' +
            '<button class="kc-btn kc-finish-replay" aria-label="फिर से चलाओ">' + ICON.play + '</button>' +
            '<button class="kc-btn kc-finish-games" aria-label="मेरे खेल">' + ICON.games + '</button>' +
            '<button class="kc-btn kc-finish-more" aria-label="और बनाओ">' + ICON.hand + '</button>' +
          '</div>' +
        '</div>' +
      '</div>');
    function close() { if (card.parentNode) card.parentNode.removeChild(card); }
    card.querySelector('.kc-finish-replay').addEventListener('click', function () { o.audio.sfx('play'); o.audio.speak('फिर से चलाओ', 'replay'); close(); o.onReplay(); });
    card.querySelector('.kc-finish-games').addEventListener('click', function () { o.audio.sfx('tap'); o.audio.speak('मेरे खेल', 'door-games'); close(); o.onGames(); });
    card.querySelector('.kc-finish-more').addEventListener('click', function () { o.audio.sfx('tap'); o.audio.speak('और बनाओ', 'more'); close(); o.onClose(); });
    root.appendChild(card);
    return close;
  };

  KC._Games = Games;
})(window.KathaCode = window.KathaCode || {});
