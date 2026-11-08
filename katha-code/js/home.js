/* Katha Code — home screen.
   Bittu and Prabal wave and greet; four big doors: Ramayan · Gita · Upanishad · My Games.
   A small lock opens the parents' area only after being held for 3 seconds. */
(function (KC) {
  'use strict';

  var ART = KC._art;
  var HOLD_MS = 3000;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  // Label text for the chosen label language (children always hear Hindi).
  KC._lang = 'hi';
  KC.t = function (hi, en) { return KC._lang === 'en' && en ? en : hi; };

  /* A button that only acts after a long press, with a filling ring to show progress.
     Used for the parents' lock and for "reset everything". */
  KC._holdButton = function (btn, ms, onDone) {
    var ring = el('span', 'kc-hold-ring', '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/></svg>');
    btn.appendChild(ring);
    btn.classList.add('kc-holdable');
    var timer = null;
    function cancel() {
      clearTimeout(timer); timer = null;
      btn.classList.remove('kc-holding');
    }
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      cancel();
      btn.style.setProperty('--kc-hold-ms', ms + 'ms');
      void btn.offsetWidth;
      btn.classList.add('kc-holding');
      timer = setTimeout(function () { cancel(); onDone(); }, ms);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  };

  var LOCK = '<svg viewBox="0 0 40 40"><rect x="9" y="18" width="22" height="16" rx="4" fill="#B49A78"/><path d="M14 18 V13 Q14 6 20 6 Q26 6 26 13 V18" fill="none" stroke="#B49A78" stroke-width="4"/><circle cx="20" cy="26" r="2.6" fill="#FFF7EA"/></svg>';
  var BACK = '<svg viewBox="0 0 40 40"><path d="M24 8 L12 20 L24 32" fill="none" stroke="#C96A06" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOOR_PIC = { ramayan: 'sun', gita: 'wheel', upanishad: 'om', games: 'star' };

  function Home(root, opts) {
    this.root = root;
    this.audio = opts.audio;
    this.onDoor = opts.onDoor;           // (sectionId | 'games')
    this.onParents = opts.onParents;
    this.onExit = opts.onExit;
    this.gameCount = opts.gameCount;     // () => number
    this.el = el('div', 'kc-overlay kc-home-screen');
    root.appendChild(this.el);
    this.render();
  }

  Home.prototype.render = function () {
    var self = this;
    this.el.innerHTML = '';

    var head = el('div', 'kc-home-head');
    if (this.onExit) {
      var exit = el('button', 'kc-btn kc-exit', BACK);
      exit.setAttribute('aria-label', 'खेल खेल में');
      exit.addEventListener('click', function () { self.audio.sfx('tap'); self.onExit(); });
      head.appendChild(exit);
    }
    head.appendChild(el('div', 'kc-picker-diya', ART.diya()));
    head.appendChild(el('div', 'kc-picker-title', 'कथा कोड'));
    var lock = el('button', 'kc-btn kc-lock', LOCK);
    lock.setAttribute('aria-label', KC.t('बड़ों के लिए: 3 सेकंड दबाकर रखें', 'For parents: press and hold for 3 seconds'));
    lock.setAttribute('title', lock.getAttribute('aria-label'));
    KC._holdButton(lock, HOLD_MS, function () { self.audio.sfx('pop'); self.onParents(); });
    head.appendChild(lock);
    this.el.appendChild(head);

    var body = el('div', 'kc-home-body');

    // Bittu and Prabal, waving. Tap them to hear a greeting.
    var kids = el('button', 'kc-home-kids');
    kids.setAttribute('aria-label', 'बिट्टू और प्रबल');
    kids.innerHTML =
      '<div class="kc-home-bubble" hidden></div>' +
      '<div class="kc-home-kid kc-home-bittu">' + ART.characters.bittu() + '</div>' +
      '<div class="kc-home-kid kc-home-prabal">' + ART.characters.prabal() + '</div>';
    kids.addEventListener('click', function () { self.greet(); });
    body.appendChild(kids);

    var doors = el('div', 'kc-doors');
    KC.SECTIONS.concat([{ id: 'games', title: 'मेरे खेल', titleEn: 'My Games' }]).forEach(function (sec) {
      var count = sec.id === 'games' ? self.gameCount() : 0;
      var d = el('button', 'kc-door kc-door-' + sec.id,
        '<span class="kc-door-arch"><span class="kc-door-pic">' + ART.pic(DOOR_PIC[sec.id]) + '</span></span>' +
        '<span class="kc-door-title">' + KC.t(sec.title, sec.titleEn) + '</span>' +
        (count ? '<span class="kc-door-count">' + count + '</span>' : ''));
      d.setAttribute('aria-label', sec.title);
      d.addEventListener('click', function () {
        self.audio.unlock();
        self.audio.sfx('tap');
        self.audio.speak(sec.title, 'door-' + sec.id);
        self.onDoor(sec.id);
      });
      doors.appendChild(d);
    });
    body.appendChild(doors);
    this.el.appendChild(body);
  };

  Home.prototype.greet = function () {
    this.audio.unlock();
    this.audio.sfx('pop');
    var line = 'नमस्ते! आओ, कहानी से अपना खेल बनाएँ।';
    this.audio.speak(line, 'home-greet');
    var b = this.el.querySelector('.kc-home-bubble'), kids = this.el.querySelector('.kc-home-kids');
    b.textContent = line;
    b.hidden = false;
    kids.classList.remove('kc-waving'); void kids.offsetWidth; kids.classList.add('kc-waving');
    clearTimeout(this._t);
    this._t = setTimeout(function () { b.hidden = true; }, 4500);
  };

  Home.prototype.show = function () { this.render(); this.el.hidden = false; };
  Home.prototype.hide = function () { clearTimeout(this._t); this.el.hidden = true; };

  KC._Home = Home;
})(window.KathaCode = window.KathaCode || {});
