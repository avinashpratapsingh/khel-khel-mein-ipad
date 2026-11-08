/* Katha Code — block definitions.
   Every block: icon + colour + spoken Hindi name. Labels exist only for parents (tooltip).
   Param kinds (tap a block in the strip to change it):
     count  1–5 dots          repeat 1–5 dots, then ∞
     color  4 message colours  mood   happy / sad / calm
     phrase the character's own story lines */
(function (KC) {
  'use strict';

  var W = 'stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  function svg(inner) { return '<svg class="kc-icon" viewBox="0 0 40 40">' + inner + '</svg>'; }
  function arrow(rot) { return svg('<g transform="rotate(' + rot + ' 20 20)"><path d="M8 20 H31 M22 11 L31 20 L22 29" ' + W + '/></g>'); }

  var COLORS = ['#E0483A', '#2FA36B', '#2F86D6', '#8E5BD0'];
  var COLOR_NAMES = ['लाल', 'हरा', 'नीला', 'बैंगनी'];
  var MOODS = ['खुश', 'उदास', 'शांत'];
  var NUMBERS = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'हमेशा'];

  function flag(color) {
    return svg('<path d="M11 6 V35" ' + W + '/><path d="M12 7 H31 L26 14 L31 21 H12 Z" fill="' + color + '" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>');
  }
  var CLIP_COLORS = ['#E0483A', '#2F86D6', '#8E5BD0'];
  function micIcon(slot) {
    return svg('<rect x="14" y="4" width="12" height="20" rx="6" fill="#fff"/><path d="M9 18 Q9 29 20 29 Q31 29 31 18 M20 29 V35 M13 35 H27" ' + W.replace('4.5', '3.2') + '/>' +
      '<circle cx="31" cy="8" r="6" fill="' + CLIP_COLORS[(slot || 0) % 3] + '" stroke="#fff" stroke-width="2"/>');
  }
  KC._micIcon = micIcon;
  KC._CLIP_COLORS = CLIP_COLORS;

  function moodFace(m) {
    var mouth = m === 0 ? '<path d="M13 23 Q20 31 27 23" ' + W + '/>' :
                m === 1 ? '<path d="M13 28 Q20 21 27 28" ' + W + '/>' :
                          '<path d="M14 25 Q20 28 26 25" ' + W + '/>';
    var eyes = m === 2 ? '<path d="M11 16 Q14 18.5 17 16 M23 16 Q26 18.5 29 16" ' + W.replace('4.5', '3') + '/>' :
                         '<circle cx="14" cy="16" r="2.6" fill="#fff"/><circle cx="26" cy="16" r="2.6" fill="#fff"/>';
    return svg('<circle cx="20" cy="20" r="16" ' + W.replace('4.5', '3') + '/>' + eyes + mouth);
  }

  var ICONS = {
    flag:  svg('<path d="M13 8 L32 20 L13 32 Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>'),
    tap:   svg('<circle cx="20" cy="13" r="7" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>' +
               '<path d="M20 13 V30 M20 20 Q26 18 27 23 V30 Q27 35 22 35 H19 Q15 35 13 31 L10 25" ' + W + '/>'),
    touch: svg('<circle cx="13" cy="20" r="8" fill="#fff"/><circle cx="27" cy="20" r="8" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M19 9 L21 4 M21 31 L19 36" ' + W.replace('4.5', '3') + '/>'),
    right: arrow(0), left: arrow(180), up: arrow(-90), down: arrow(90),
    jump:  svg('<path d="M6 32 Q20 -2 34 32" ' + W + ' stroke-dasharray="2 6"/><path d="M28 27 L34 32 L36 24" ' + W + '/>'),
    fly:   svg('<path d="M5 30 Q20 4 35 22" ' + W + '/><path d="M28 18 L35 22 L31 29" ' + W + '/>' +
               '<path d="M8 34 Q14 31 20 34 T32 34" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7" stroke-linecap="round"/>'),
    home:  svg('<path d="M7 20 L20 8 L33 20 M11 17 V32 H29 V17" ' + W + '/><rect x="17" y="23" width="6" height="9" fill="#fff"/>'),
    grow:  svg('<rect x="14" y="14" width="12" height="12" rx="2" fill="#fff"/><path d="M5 12 V5 H12 M28 5 H35 V12 M35 28 V35 H28 M12 35 H5 V28" ' + W + '/>'),
    shrink:svg('<rect x="16" y="16" width="8" height="8" rx="2" fill="#fff"/><path d="M5 5 L12 12 M12 7 V12 H7 M35 5 L28 12 M28 7 V12 H33 M35 35 L28 28 M33 28 H28 V33 M5 35 L12 28 M7 28 H12 V33" ' + W.replace('4.5', '3.2') + '/>'),
    hide:  svg('<path d="M4 20 Q20 6 36 20 Q20 34 4 20 Z" ' + W.replace('4.5', '3') + ' opacity=".55"/><path d="M7 33 L33 7" ' + W + '/>'),
    show:  svg('<path d="M4 20 Q20 6 36 20 Q20 34 4 20 Z" ' + W.replace('4.5', '3') + '/><circle cx="20" cy="20" r="5.5" fill="#fff"/>'),
    shankh:svg('<path d="M8 26 C 6 14 18 6 28 10 C 34 13 34 22 28 25 C 22 28 18 22 22 19 C 25 17 27 21 25 22" ' + W.replace('4.5', '3.4') + '/><path d="M8 26 L5 34 L14 30 Z" fill="#fff"/>'),
    bell:  svg('<path d="M20 5 V8 M10 29 C 10 22 11 12 20 11 C 29 12 30 22 30 29 Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M7 29 H33" ' + W + '/><circle cx="20" cy="34" r="3" fill="#fff"/>'),
    flute: svg('<path d="M5 30 L35 10" stroke="#fff" stroke-width="6" stroke-linecap="round"/><g fill="#2FA36B"><circle cx="15" cy="23.3" r="1.4"/><circle cx="20" cy="20" r="1.4"/><circle cx="25" cy="16.7" r="1.4"/></g><path d="M30 26 q3 -3 6 0" ' + W.replace('4.5', '2.5') + '/>'),
    drum:  svg('<ellipse cx="9" cy="20" rx="4" ry="10" fill="#fff"/><ellipse cx="31" cy="20" rx="4" ry="10" fill="#fff"/><path d="M9 10 H31 M9 30 H31 M12 10 L28 30 M28 10 L12 30" ' + W.replace('4.5', '2.6') + '/>'),
    clap:  svg('<path d="M14 34 L8 22 Q7 19 10 18 L18 30 M18 34 L24 14 Q25 11 28 12 L24 32" ' + W.replace('4.5', '3.6') + '/><path d="M30 5 L28 9 M35 9 L31 11 M23 4 L24 8" ' + W.replace('4.5', '2.6') + '/>'),
    jai:   svg('<path d="M15 5 C 11 10 10 19 10.5 27 L 15 33 L 19.5 27 C 20 19 19 10 15 5 Z" fill="#fff"/><path d="M25 14 q4 6 0 12 M30 10 q7 10 0 20" ' + W.replace('4.5', '3') + '/>'),
    wait:  svg('<circle cx="20" cy="21" r="14" ' + W.replace('4.5', '3.6') + '/><path d="M20 12 V21 L26 25" ' + W + '/>'),
    repeat:svg('<path d="M30 14 A 12 12 0 1 0 32 24" ' + W + '/><path d="M24 13 L31 13.5 L31 6" ' + W + '/>'),
    stop:  svg('<path d="M14 5 H26 L35 14 V26 L26 35 H14 L5 26 V14 Z" fill="#fff"/><rect x="14" y="14" width="12" height="12" rx="2" fill="#F28C1B"/>'),
    next:  svg('<rect x="4" y="9" width="21" height="17" rx="3" ' + W.replace('4.5', '3.2') + '/><path d="M24 31 H35 M30 26 L35 31 L30 36" ' + W + '/>'),
    finish:svg('<path d="M20 5 C 25 12 25 18 20 21 C 15 18 15 12 20 4 Z" fill="#FFD84D"/><path d="M4 22 H36 C 34 32 28 36 20 36 C 12 36 6 32 4 22 Z" fill="#fff"/>')
  };

  // cat: category · voice: spoken Hindi · label: parent tooltip · kind: param kind · def: default
  var DEFS = {
    flag:  { cat: 'start', trigger: 'flag',  voice: 'शुरू करो',  label: 'शुरू (▶ दबाने पर)' },
    tap:   { cat: 'start', trigger: 'tap',   voice: 'मुझे छुओ',  label: 'छूने पर शुरू' },
    touch: { cat: 'start', trigger: 'touch', voice: 'जब कोई मिले', label: 'किसी से मिलने पर शुरू' },
    msg:   { cat: 'start', trigger: 'msg',   voice: 'संदेश मिले तो', label: 'संदेश मिलने पर शुरू', kind: 'color', def: 0 },

    right: { cat: 'move', voice: 'दाएँ चलो',  label: 'दाएँ चलो', kind: 'count', def: 2 },
    left:  { cat: 'move', voice: 'बाएँ चलो',  label: 'बाएँ चलो', kind: 'count', def: 2 },
    up:    { cat: 'move', voice: 'ऊपर जाओ',  label: 'ऊपर',     kind: 'count', def: 1 },
    down:  { cat: 'move', voice: 'नीचे आओ',  label: 'नीचे',     kind: 'count', def: 1 },
    jump:  { cat: 'move', voice: 'कूदो',      label: 'कूदो',     kind: 'count', def: 1 },
    fly:   { cat: 'move', voice: 'उड़ो',       label: 'उड़ो (केवल जो कथा में उड़ते हैं)', kind: 'count', def: 3, needs: 'canFly' },
    home:  { cat: 'move', voice: 'घर जाओ',   label: 'अपनी जगह वापस' },

    say:   { cat: 'looks', voice: 'बोलो',     label: 'बोलो (कथा के शब्द)', kind: 'phrase', def: 0, needs: 'hasPhrases' },
    mood:  { cat: 'looks', voice: 'चेहरा',    label: 'चेहरा: खुश / उदास / शांत', kind: 'mood', def: 0 },
    grow:  { cat: 'looks', voice: 'बड़े हो जाओ', label: 'बड़े बनो', kind: 'count', def: 1, needs: 'canChangeSize' },
    shrink:{ cat: 'looks', voice: 'छोटे हो जाओ', label: 'छोटे बनो', kind: 'count', def: 1, needs: 'canChangeSize' },
    hide:  { cat: 'looks', voice: 'छिप जाओ',  label: 'छिप जाओ', needs: 'canHide' },
    show:  { cat: 'looks', voice: 'दिख जाओ',  label: 'दिख जाओ', needs: 'canShow' },

    shankh:{ cat: 'sound', voice: 'शंख',      label: 'शंख' },
    bell:  { cat: 'sound', voice: 'घंटी',     label: 'घंटी' },
    flute: { cat: 'sound', voice: 'बाँसुरी',   label: 'बाँसुरी' },
    drum:  { cat: 'sound', voice: 'ढोल',      label: 'ढोल' },
    clap:  { cat: 'sound', voice: 'ताली',      label: 'ताली' },
    jai:   { cat: 'sound', voice: 'जय श्री राम', label: 'जयकार / शान्ति पाठ (कथा के अनुसार)' },

    wait:  { cat: 'control', voice: 'रुको और देखो', label: 'थोड़ा रुको', kind: 'count', def: 2 },
    repeat:{ cat: 'control', voice: 'फिर से करो',  label: 'पहले वाले डिब्बे फिर से करो', kind: 'repeat', def: 2 },
    send:  { cat: 'control', voice: 'संदेश भेजो',  label: 'संदेश भेजो', kind: 'color', def: 0 },
    stop:  { cat: 'control', voice: 'सब रुको',    label: 'सब रुक जाओ' },
    next:  { cat: 'control', voice: 'अगला दृश्य',  label: 'अगले दृश्य पर जाओ' },
    finish:{ cat: 'end',     voice: 'पूरा हुआ',   label: 'खेल पूरा (दीये जलाओ)' },
    // A clip a parent recorded in the parents' area. Plays as a sound: no speech bubble,
    // so a recording is never shown as words a story character said.
    myvoice:{ cat: 'sound',  voice: 'मेरी आवाज़',  label: 'मेरी आवाज़ (बड़ों ने रिकॉर्ड की)', kind: 'clip', def: 0, needs: 'hasClips' }
  };

  // Labels for parents when the label language is English (children always hear Hindi).
  var LABEL_EN = {
    flag: 'Start when ▶ is tapped', tap: 'Start when tapped', touch: 'Start when touching someone', msg: 'Start on message',
    right: 'Walk right', left: 'Walk left', up: 'Up', down: 'Down', jump: 'Jump', fly: 'Fly (only those who fly in the story)', home: 'Go back to start',
    say: 'Say (lines from the story)', mood: 'Face: happy / sad / calm', grow: 'Grow', shrink: 'Shrink', hide: 'Hide', show: 'Appear',
    shankh: 'Conch', bell: 'Temple bell', flute: 'Flute', drum: 'Dhol', clap: 'Clap', jai: 'Chant (by story)',
    wait: 'Wait', repeat: 'Repeat the blocks before', send: 'Send message', stop: 'Stop all', next: 'Next scene', finish: 'Finish (light the diyas)',
    myvoice: 'My voice (recorded by a parent)'
  };

  // How many values each param kind cycles through.
  function cycleSize(kind, opts) {
    if (kind === 'count') return 5;
    if (kind === 'repeat') return 6;
    if (kind === 'color') return 4;
    if (kind === 'mood') return 3;
    if (kind === 'phrase') return Math.max(1, (opts && opts.phrases ? opts.phrases.length : 1));
    return 1;
  }
  // Recorded clip slots (0..2) that hold a recording.
  function clipSlots() {
    var out = [];
    (KC._clips || []).forEach(function (c, i) { if (c) out.push(i); });
    return out;
  }
  function nextValue(block, opts) {
    var d = DEFS[block.type], n = cycleSize(d.kind, opts);
    var v = block.param == null ? d.def : block.param;
    if (d.kind === 'clip') {
      var slots = clipSlots();
      if (!slots.length) return v;
      for (var k = 0; k < slots.length; k++) if (slots[k] > v) return slots[k];
      return slots[0];
    }
    if (d.kind === 'count' || d.kind === 'repeat') return (v % n) + 1;   // 1..n
    return (v + 1) % n;                                                  // 0..n-1
  }

  // Palette pages: never more than 6 choices. Blocks a character cannot do in
  // the story are simply not offered for that character.
  var PAGES = {
    start:   ['flag', 'tap', 'touch', 'msg'],
    move:    ['right', 'left', 'up', 'down', 'jump', 'fly', 'home'],
    looks:   ['say', 'mood', 'grow', 'shrink', 'hide', 'show'],
    sound:   ['shankh', 'bell', 'flute', 'drum', 'clap', 'jai'],
    control: ['wait', 'repeat', 'send', 'stop', 'next', 'finish']
  };
  function allowed(type, info) {
    var d = DEFS[type];
    return !d.needs || !!(info && info[d.needs]);
  }
  function paletteFor(cat, info) {
    var list = PAGES[cat].filter(function (t) { return allowed(t, info); });
    if (cat === 'sound' && allowed('myvoice', info)) list[list.indexOf('drum')] = 'myvoice';   // keeps the page at 6
    if (cat === 'move') {
      // 6th move slot: "fly" for those who fly in the story, otherwise "go home".
      list = list.filter(function (t) { return t !== (info && info.canFly ? 'home' : 'fly'); });
    }
    return list.slice(0, 6);
  }

  function iconFor(block, opts) {
    var d = DEFS[block.type], v = block.param == null ? d.def : block.param;
    if (d.kind === 'color') return block.type === 'msg' || block.type === 'send' ? flag(COLORS[v % 4]) : ICONS[block.type];
    if (d.kind === 'mood') return moodFace(v % 3);
    if (d.kind === 'clip') return micIcon(v);
    if (d.kind === 'phrase' && opts && opts.phrases && opts.phrases.length) {
      var ph = opts.phrases[v % opts.phrases.length];
      return '<div class="kc-saybox">' + KC._art.pic(ph.icon) + '</div>';
    }
    return ICONS[block.type];
  }

  function render(block, opts) {
    var d = DEFS[block.type];
    var el = document.createElement('div');
    el.className = 'kc-block kc-cat-' + d.cat + ' kc-t-' + block.type;
    el.setAttribute('data-type', block.type);
    var lab = KC.t ? KC.t(d.label, LABEL_EN[block.type]) : d.label;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('title', lab);
    el.setAttribute('aria-label', lab);
    var dots = d.kind === 'count' || d.kind === 'repeat';
    el.innerHTML = '<div class="kc-iconwrap">' + iconFor(block, opts) + '</div>' + (dots ? '<div class="kc-dots"></div>' : '');
    if (dots) setDots(el, block.param == null ? d.def : block.param);
    return el;
  }

  function refresh(el, block, opts) {
    var d = DEFS[block.type];
    var w = el.querySelector('.kc-iconwrap');
    if (w) w.innerHTML = iconFor(block, opts);
    if (d.kind === 'count' || d.kind === 'repeat') setDots(el, block.param == null ? d.def : block.param);
  }

  function setDots(el, n) {
    var box = el.querySelector('.kc-dots');
    if (!box) return;
    if (n >= 6) { box.innerHTML = '<b>∞</b>'; return; }
    var s = '';
    for (var i = 0; i < n; i++) s += '<i></i>';
    box.innerHTML = s;
  }

  // What to say aloud when a child changes a block's value.
  function paramWord(block, opts) {
    var d = DEFS[block.type], v = block.param == null ? d.def : block.param;
    if (d.kind === 'count' || d.kind === 'repeat') return NUMBERS[v];
    if (d.kind === 'color') return COLOR_NAMES[v % 4];
    if (d.kind === 'mood') return MOODS[v % 3];
    if (d.kind === 'clip') return 'मेरी आवाज़ ' + NUMBERS[(v || 0) + 1];
    if (d.kind === 'phrase' && opts && opts.phrases && opts.phrases.length) return opts.phrases[v % opts.phrases.length].text;
    return d.voice;
  }

  KC._blocks = {
    DEFS: DEFS, ICONS: ICONS, COLORS: COLORS, NUMBERS: NUMBERS,
    paletteFor: paletteFor, allowed: allowed, render: render, refresh: refresh,
    setDots: setDots, nextValue: nextValue, paramWord: paramWord
  };
})(window.KathaCode = window.KathaCode || {});
