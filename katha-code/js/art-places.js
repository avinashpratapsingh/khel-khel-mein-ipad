/* Katha Code — story places (backgrounds), 100 × 62.5 logical units.
   Built from small parts so every place shares one warm style.
   Ground where characters stand is y ≈ 44–62. */
(function (KC) {
  'use strict';

  var A = KC._art;

  function wrap(inner) {
    return '<svg class="kc-bg" viewBox="0 0 100 62.5" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function sky(id, top, bottom) {
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bottom + '"/></linearGradient></defs>' +
      '<rect width="100" height="62.5" fill="url(#' + id + ')"/>';
  }
  function sun(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 1.7) + '" fill="#FFE2A8" opacity=".55"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFB547"/>'; }
  function moon(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#FFF6D8" opacity=".3"/><circle cx="' + x + '" cy="' + y + '" r="4" fill="#FFF6D8"/>'; }
  function stars(list) { return list.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] || .35) + '" fill="#fff"/>'; }).join(''); }
  function clouds(list) {
    return list.map(function (c) {
      var x = c[0], y = c[1], s = c[2] || 1;
      return '<g fill="#fff" opacity=".9"><ellipse cx="' + x + '" cy="' + y + '" rx="' + 6 * s + '" ry="' + 2 * s + '"/><ellipse cx="' + (x + 3.5 * s) + '" cy="' + (y - 1 * s) + '" rx="' + 4 * s + '" ry="' + 2.3 * s + '"/></g>';
    }).join('');
  }
  function ground(y, c1, c2) {
    return '<rect x="0" y="' + y + '" width="100" height="' + (62.5 - y) + '" fill="' + c1 + '"/>' +
      '<path d="M0 ' + (y + 5) + ' Q30 ' + (y + 2) + ' 60 ' + (y + 5) + ' T100 ' + (y + 4) + ' V62.5 H0 Z" fill="' + c2 + '"/>';
  }
  function hills(color, d) { return '<path d="' + d + '" fill="' + color + '"/>'; }
  function tree(x, base, s, c1, c2, blossom) {
    var t = '<path d="M' + x + ' ' + base + ' L' + (x + .4) + ' ' + (base - 10 * s) + '" stroke="#7A4A22" stroke-width="' + 1.6 * s + '"/>' +
      '<ellipse cx="' + x + '" cy="' + (base - 13 * s) + '" rx="' + 7 * s + '" ry="' + 5.5 * s + '" fill="' + c1 + '"/>' +
      '<ellipse cx="' + (x - 3.5 * s) + '" cy="' + (base - 10 * s) + '" rx="' + 4 * s + '" ry="' + 3 * s + '" fill="' + c2 + '"/>' +
      '<ellipse cx="' + (x + 3.5 * s) + '" cy="' + (base - 10.5 * s) + '" rx="' + 4 * s + '" ry="' + 3 * s + '" fill="' + c2 + '"/>';
    if (blossom) {
      [[-3, -14], [2, -16], [4, -12], [-1, -11], [-5, -11]].forEach(function (b) {
        t += '<circle cx="' + (x + b[0] * s) + '" cy="' + (base + b[1] * s) + '" r="' + .8 * s + '" fill="' + blossom + '"/>';
      });
    }
    return t;
  }
  function palm(x, base, s) {
    var t = x + ',' + (base - 14 * s);
    return '<path d="M' + x + ' ' + base + ' Q' + (x + 1.5 * s) + ' ' + (base - 7 * s) + ' ' + x + ' ' + (base - 14 * s) + '" fill="none" stroke="#8A5A2B" stroke-width="' + 1.2 * s + '"/>' +
      '<g fill="#3E8E3A" transform="translate(' + t + ') scale(' + s + ')"><path d="M0 0 q-5 0 -7 3 q4 -1 7 -3z"/><path d="M0 0 q5 -1 7 2 q-4 -1 -7 -2z"/><path d="M0 0 q-1 -4 -4 -5 q2 3 4 5z"/><path d="M0 0 q2 -4 6 -4 q-3 2 -6 4z"/></g>';
  }
  function hut(x, base, s) {
    var w = 16 * s, h = 9 * s;
    return '<rect x="' + (x - w / 2) + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" fill="#D9B27C"/>' +
      '<path d="M' + (x - w / 2 - 3 * s) + ' ' + (base - h) + ' L' + x + ' ' + (base - h - 9 * s) + ' L' + (x + w / 2 + 3 * s) + ' ' + (base - h) + ' Z" fill="#B8893E"/>' +
      '<path d="M' + (x - w / 2) + ' ' + (base - h - 1.5 * s) + ' L' + x + ' ' + (base - h - 8 * s) + ' L' + (x + w / 2) + ' ' + (base - h - 1.5 * s) + '" fill="none" stroke="#9C7232" stroke-width=".5"/>' +
      '<rect x="' + (x - 2.2 * s) + '" y="' + (base - 6.5 * s) + '" width="' + 4.4 * s + '" height="' + 6.5 * s + '" fill="#6E4824"/>';
  }
  function palace(x, base, s, lit) {
    var g = '#E8B33A', gd = '#C4891A', wall = '#F3DFB0';
    var p = '<g transform="translate(' + x + ',' + base + ') scale(' + s + ')">' +
      '<rect x="-20" y="-16" width="40" height="16" fill="' + wall + '" stroke="' + gd + '" stroke-width=".3"/>' +
      '<rect x="-27" y="-11" width="8" height="11" fill="' + wall + '" stroke="' + gd + '" stroke-width=".3"/><rect x="19" y="-11" width="8" height="11" fill="' + wall + '" stroke="' + gd + '" stroke-width=".3"/>' +
      '<path d="M-27 -11 Q-23 -18 -19 -11 Z M19 -11 Q23 -18 27 -11 Z" fill="' + g + '"/>' +
      '<path d="M-12 -16 Q0 -32 12 -16 Z" fill="' + g + '" stroke="' + gd + '" stroke-width=".3"/><path d="M0 -29 V-33" stroke="' + gd + '" stroke-width=".6"/><path d="M0 -33 L4 -32 L0 -31 Z" fill="#F28C1B"/>' +
      '<path d="M-20 -16 Q-16 -21 -12 -16 Z M12 -16 Q16 -21 20 -16 Z" fill="' + g + '"/>';
    for (var i = -16; i <= 12; i += 7) p += '<path d="M' + i + ' 0 V-8 Q' + (i + 2) + ' -11 ' + (i + 4) + ' -8 V0 Z" fill="' + (lit ? '#FFC96B' : '#C99A45') + '"/>';
    p += '</g>';
    return p;
  }
  function wall(y, c, arch) {
    var s = '<rect x="0" y="' + y + '" width="100" height="9" fill="' + c + '"/>';
    for (var x = 2; x < 100; x += 8) s += '<path d="M' + x + ' ' + (y + 8) + ' V' + (y + 4.5) + ' Q' + (x + 2.5) + ' ' + (y + 1.5) + ' ' + (x + 5) + ' ' + (y + 4.5) + ' V' + (y + 8) + ' Z" fill="' + arch + '"/>';
    return s;
  }
  function diya(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><circle cx="0" cy="-2" r="2.2" fill="#FFD36B" opacity=".45"/><path d="M0 -3.6 C 1.2 -2 1.2 -1 0 -0.4 C -1.2 -1 -1.2 -2 0 -3.6 Z" fill="#FFC531"/><path d="M-2 0 H2 Q1.6 1.6 0 1.6 Q-1.6 1.6 -2 0 Z" fill="#C2571A"/></g>';
  }
  function kalash(x, base, s) {
    return '<g transform="translate(' + x + ',' + base + ') scale(' + s + ')">' +
      '<rect x="-5" y="-2" width="10" height="2" fill="#8A5A2B"/>' +
      '<path d="M-4.5 -2 C -7 -6, -6 -11, -2.5 -12 H2.5 C 6 -11, 7 -6, 4.5 -2 Z" fill="#D8A031"/>' +
      '<rect x="-3" y="-14" width="6" height="2.4" rx="1" fill="#C88A04"/><ellipse cx="0" cy="-14" rx="3" ry=".9" fill="#6FB6D0"/>' +
      '<path d="M-5.5 -7 H5.5" stroke="#F2B705" stroke-width=".5"/></g>';
  }
  function tulsi(x, base, s) {
    return '<g transform="translate(' + x + ',' + base + ') scale(' + s + ')">' +
      '<rect x="-4" y="-7" width="8" height="7" fill="#E8D3B0" stroke="#C99A45" stroke-width=".4"/><rect x="-4.6" y="-8" width="9.2" height="1.4" fill="#C99A45"/>' +
      '<path d="M0 -8 V-14" stroke="#3E8E3A" stroke-width=".7"/><g fill="#4FA048"><ellipse cx="-1.6" cy="-11" rx="1.6" ry=".9"/><ellipse cx="1.6" cy="-12" rx="1.6" ry=".9"/><ellipse cx="-1.2" cy="-13.6" rx="1.3" ry=".8"/><ellipse cx="1.2" cy="-14.6" rx="1.2" ry=".7"/></g></g>';
  }
  function fireAltar(x, base) {
    return '<rect x="' + (x - 4) + '" y="' + (base - 3) + '" width="8" height="3" fill="#B5562E"/><rect x="' + (x - 4.6) + '" y="' + (base - 3.6) + '" width="9.2" height="1" fill="#C97048"/>' +
      '<path d="M' + x + ' ' + (base - 10) + ' C ' + (x + 3) + ' ' + (base - 7) + ' ' + (x + 3) + ' ' + (base - 4) + ' ' + x + ' ' + (base - 3.6) + ' C ' + (x - 3) + ' ' + (base - 4) + ' ' + (x - 3) + ' ' + (base - 7) + ' ' + x + ' ' + (base - 10) + ' Z" fill="#FFB13B"/>' +
      '<path d="M' + x + ' ' + (base - 7.5) + ' C ' + (x + 1.4) + ' ' + (base - 6) + ' ' + (x + 1.4) + ' ' + (base - 4.4) + ' ' + x + ' ' + (base - 3.8) + ' C ' + (x - 1.4) + ' ' + (base - 4.4) + ' ' + (x - 1.4) + ' ' + (base - 6) + ' ' + x + ' ' + (base - 7.5) + ' Z" fill="#E85A1B"/>';
  }
  function cow(x, base, s) {
    return '<g transform="translate(' + x + ',' + base + ') scale(' + s + ')">' +
      '<rect x="-6" y="-6" width="1.4" height="6" fill="#E9E2D6"/><rect x="-3.4" y="-6" width="1.4" height="6" fill="#E9E2D6"/><rect x="2.4" y="-6" width="1.4" height="6" fill="#E9E2D6"/><rect x="5" y="-6" width="1.4" height="6" fill="#E9E2D6"/>' +
      '<ellipse cx="0" cy="-8" rx="8" ry="4" fill="#F7F3EC"/><ellipse cx="-2" cy="-8.6" rx="2.6" ry="1.6" fill="#C9A27A"/>' +
      '<ellipse cx="9" cy="-10" rx="2.6" ry="2.2" fill="#F7F3EC"/><path d="M8 -12 L7 -14 M10 -12 L11 -14" stroke="#C9A27A" stroke-width=".6"/>' +
      '<path d="M-8 -9 Q-10 -7 -9 -4" stroke="#E9E2D6" stroke-width=".6" fill="none"/></g>';
  }
  function chariot(x, base, s) {
    // Arjun's chariot with Hanuman on its flag (kapidhvaja), standing still before the teaching.
    return '<g transform="translate(' + x + ',' + base + ') scale(' + s + ')">' +
      '<path d="M0 -24 V-8" stroke="#8A5A2B" stroke-width=".8"/><path d="M0 -24 L9 -22 L0 -19 Z" fill="#F28C1B"/>' +
      '<circle cx="3.2" cy="-21.8" r="1.1" fill="#B8461F"/>' +
      '<path d="M-9 -8 H9 L7 -2 H-7 Z" fill="#E8B33A" stroke="#C4891A" stroke-width=".4"/>' +
      '<path d="M-8 -8 Q0 -15 8 -8" fill="#F7D57A" stroke="#C4891A" stroke-width=".4"/>' +
      '<path d="M9 -4 H16" stroke="#8A5A2B" stroke-width="1"/>' +
      '<circle cx="-2" cy="-2" r="5" fill="none" stroke="#8A5A2B" stroke-width="1.2"/><circle cx="-2" cy="-2" r="1" fill="#8A5A2B"/>' +
      '<path d="M-2 -7 V3 M-7 -2 H3 M-5.5 -5.5 L1.5 1.5 M1.5 -5.5 L-5.5 1.5" stroke="#8A5A2B" stroke-width=".5"/></g>';
  }
  function farFlags(x0, x1, y, color) {
    var s = '';
    for (var x = x0; x < x1; x += 2.6) s += '<path d="M' + x + ' ' + y + ' V' + (y - 3) + ' L' + (x + 1.6) + ' ' + (y - 2.3) + ' L' + x + ' ' + (y - 1.6) + '" fill="' + color + '" stroke="' + color + '" stroke-width=".25" opacity=".75"/>';
    return s;
  }
  function flowers(list) {
    return list.map(function (f) { return '<circle cx="' + f[0] + '" cy="' + f[1] + '" r=".7" fill="' + (f[2] || '#F7D046') + '"/>'; }).join('');
  }
  function bush(x, y, c) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="5" ry="2.6" fill="' + (c || '#4FA048') + '"/>'; }
  function rangoli(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')"><ellipse rx="7" ry="2.4" fill="#E0483A"/><ellipse rx="5" ry="1.7" fill="#F2B705"/><ellipse rx="3" ry="1" fill="#2E8B57"/><ellipse rx="1.2" ry=".45" fill="#fff"/></g>';
  }

  var P = {};

  P.ayodhyaPalace = function () {
    return wrap(sky('kcAy', '#FFF2DC', '#FFD9A8') + sun(84, 10, 4.5) + clouds([[18, 9, 1], [60, 7, .8]]) +
      palace(50, 44, 1.25, false) +
      tree(8, 44, 1.1, '#3E8E3A', '#4FA048') + tree(92, 44, 1.1, '#3E8E3A', '#4FA048') +
      ground(43, '#E2CFA2', '#D9C38A') +
      '<path d="M0 50 H100 M0 56 H100 M20 43 L14 62.5 M40 43 L38 62.5 M60 43 L62 62.5 M80 43 L86 62.5" stroke="#CDB57E" stroke-width=".35"/>' +
      flowers([[6, 47, '#E0483A'], [94, 48, '#E0483A'], [10, 49], [90, 49]]));
  };

  P.forestHut = function () {
    return wrap(sky('kcFh', '#E6F4FF', '#FFE8C2') + sun(16, 9, 4) + clouds([[60, 8, .9]]) +
      hills('#9CC98A', 'M0 40 Q15 28 32 36 T64 32 T100 36 V45 H0 Z') + hills('#86BC70', 'M0 44 Q25 36 50 42 T100 40 V46 H0 Z') +
      tree(9, 45, 1.2, '#2F7D3A', '#3E8E3A') + tree(26, 44, .9, '#3E8E3A', '#4FA048') + tree(95, 45, 1.3, '#2F7D3A', '#3E8E3A') +
      hut(78, 45, 1.1) +
      ground(44, '#7DBB4A', '#6BAA3A') + bush(60, 47) + bush(4, 50) +
      flowers([[58, 46], [61, 46.5, '#F48FB1'], [3, 49, '#F48FB1'], [30, 55], [70, 57]]));
  };

  P.deepForest = function () {
    var t = '';
    [[5, 40, 1.4], [18, 38, 1.2], [33, 40, 1.5], [52, 38, 1.2], [68, 40, 1.5], [84, 38, 1.3], [97, 40, 1.4]].forEach(function (a) { t += tree(a[0], a[1], a[2], '#2A6B33', '#2F7D3A'); });
    var f = '';
    [[2, 46, 1.4], [24, 45, 1.2], [44, 46, 1.3], [62, 45, 1.1], [80, 46, 1.4], [99, 45, 1.2]].forEach(function (a) { f += tree(a[0], a[1], a[2], '#3E8E3A', '#4FA048'); });
    return wrap(sky('kcDf', '#DCEFD0', '#F6E6B6') + t + f + ground(45, '#6BAA3A', '#5E9A35') +
      '<path d="M30 62.5 Q44 52 60 47 T96 45" fill="none" stroke="#D9C38A" stroke-width="3" opacity=".75"/>' +
      flowers([[12, 52], [48, 56, '#F48FB1'], [86, 53], [70, 59, '#F48FB1']]));
  };

  P.ayodhyaOutskirts = function () {
    // Nandigram, where Bharat lived in a hut and waited for Ram; Ayodhya in the distance.
    return wrap(sky('kcNg', '#FFE3B8', '#F9B77A') + sun(50, 14, 4) + clouds([[20, 10, .9], [78, 8, 1]]) +
      palace(84, 41, .55, false) +
      hills('#B9D37A', 'M0 42 Q30 37 60 41 T100 40 V46 H0 Z') +
      hut(14, 45, 1) + tree(28, 45, 1, '#3E8E3A', '#4FA048') +
      ground(44, '#9CC45A', '#8DB84F') +
      '<path d="M0 53 H100 M0 58 H100" stroke="#86AE48" stroke-width=".4"/>' +
      flowers([[40, 50], [60, 54, '#F48FB1'], [76, 50], [90, 56]]));
  };

  P.ayodhyaDiwali = function () {
    // Diwali falls on the new-moon night (amavasya), so there is no moon here.
    var d = '';
    for (var x = 25; x <= 75; x += 4.2) d += diya(x, 44.6, .9);
    for (var x2 = 6; x2 <= 94; x2 += 8) d += diya(x2, 61, 1.1);
    return wrap(sky('kcDw', '#29265A', '#6B4E8A') + stars([[10, 6], [22, 12], [35, 5], [48, 10, .45], [63, 4], [72, 12], [88, 7], [94, 15]]) +
      palace(50, 44, 1.3, true) +
      ground(44, '#5E4A6E', '#54425F') + rangoli(50, 54) + d);
  };

  P.kurukshetra = function () {
    // The field at dawn before the teaching. Distant flags only: the war is not shown.
    return wrap(sky('kcKk', '#FFE6BF', '#F6B97C') + sun(70, 22, 5) + clouds([[16, 9, 1]]) +
      farFlags(2, 30, 40, '#B8461F') + farFlags(76, 99, 40, '#1F7A8C') +
      hills('#E0C58C', 'M0 40 Q50 37 100 40 V46 H0 Z') +
      ground(43, '#D9C08A', '#CDB27A') + chariot(40, 52, 1.35) +
      '<path d="M0 50 Q30 48 60 51 T100 50" stroke="#C4A86C" stroke-width=".5" fill="none"/>');
  };

  P.garden = function () {
    // Bittu and Prabal's home garden: house wall, tulsi, flower beds.
    return wrap(sky('kcGd', '#E3F4FF', '#FFF4DA') + sun(14, 9, 4) + clouds([[70, 8, 1]]) +
      '<rect x="0" y="20" width="100" height="25" fill="#F3E2C2"/><rect x="0" y="18" width="100" height="2.6" fill="#D9692A"/>' +
      '<rect x="18" y="26" width="12" height="10" fill="#9CCFE0" stroke="#8A5A2B" stroke-width=".8"/><path d="M24 26 V36 M18 31 H30" stroke="#8A5A2B" stroke-width=".6"/>' +
      '<rect x="62" y="26" width="9" height="19" fill="#8A5A2B"/><circle cx="69" cy="36" r=".7" fill="#F2B705"/>' +
      '<path d="M60 25 Q66.5 21 73 25" fill="none" stroke="#2E8B57" stroke-width="1"/><g fill="#F28C1B"><circle cx="61.5" cy="25.5" r=".8"/><circle cx="66.5" cy="23.6" r=".8"/><circle cx="71.5" cy="25.5" r=".8"/></g>' +
      ground(44, '#86C25A', '#78B54E') +
      tulsi(88, 47, 1.1) + bush(8, 47, '#5DB352') + bush(42, 46.5, '#5DB352') +
      flowers([[6, 46, '#E0483A'], [9, 46.6], [41, 45.6, '#F48FB1'], [44, 46], [20, 58], [74, 58, '#F48FB1']]) +
      '<path d="M0 46 H100" stroke="#C99A45" stroke-width=".6" stroke-dasharray="1 1.4"/>');
  };

  P.yamaDoor = function () {
    // The abode of Yama, shown calm and dignified: a great door with lamps.
    return wrap(sky('kcYd', '#3B3570', '#7A5FA0') + stars([[8, 6], [20, 13], [33, 4], [45, 9], [90, 6], [96, 14]]) +
      '<rect x="56" y="10" width="36" height="35" fill="#8C7FA8"/><rect x="54" y="8" width="40" height="4" fill="#A396C0"/>' +
      '<rect x="58" y="12" width="5" height="33" fill="#A396C0"/><rect x="85" y="12" width="5" height="33" fill="#A396C0"/>' +
      '<path d="M65 45 V24 Q74 14 83 24 V45 Z" fill="#2A2440"/>' +
      '<path d="M65 24 Q74 14 83 24" fill="none" stroke="#E6B33A" stroke-width=".8"/>' +
      diya(60.5, 40, 1.3) + diya(87.5, 40, 1.3) +
      '<rect x="50" y="45" width="48" height="2" fill="#A396C0"/>' +
      ground(46, '#5E5880', '#544E74') +
      '<path d="M0 52 H100 M0 57 H100" stroke="#6C6690" stroke-width=".4"/>');
  };

  P.villageHome = function () {
    return wrap(sky('kcVh', '#E9F5FF', '#FFE6BD') + sun(84, 9, 4) + clouds([[30, 8, 1]]) +
      hills('#A9D08A', 'M0 42 Q25 36 50 41 T100 39 V46 H0 Z') +
      tree(16, 45, 1.3, '#3E8E3A', '#4FA048') + hut(74, 46, 1.25) + cow(92, 49, .55) +
      ground(45, '#94C35E', '#86B854') +
      '<path d="M48 62.5 Q56 52 64 47" fill="none" stroke="#D9C38A" stroke-width="2.6" opacity=".8"/>' +
      flowers([[30, 50], [36, 57, '#F48FB1'], [88, 56]]));
  };

  P.gautamaAshram = function () {
    return wrap(sky('kcGa', '#E6F4FF', '#FFE8C2') + sun(30, 9, 4) +
      tree(6, 44, 1.3, '#2F7D3A', '#3E8E3A') + tree(20, 43, 1, '#3E8E3A', '#4FA048') + tree(96, 44, 1.2, '#2F7D3A', '#3E8E3A') +
      hut(84, 45, 1.15) +
      ground(44, '#86C25A', '#78B54E') +
      fireAltar(48, 50) + cow(14, 52, .55) + cow(26, 55, .5) +
      flowers([[60, 50], [72, 56, '#F48FB1'], [36, 58]]));
  };

  function courtyard(night) {
    return wrap((night ? sky('kcCn', '#232B55', '#4B4A7A') + moon(82, 9) + stars([[12, 6], [28, 10], [44, 5], [60, 12], [93, 16]])
                       : sky('kcCm', '#E6F4FF', '#FFE6BD') + sun(82, 9, 4) + clouds([[24, 8, 1]])) +
      '<rect x="0" y="22" width="100" height="23" fill="' + (night ? '#8E7C64' : '#E8D3B0') + '"/>' +
      '<rect x="0" y="20" width="100" height="2.6" fill="' + (night ? '#6E5B44' : '#C2571A') + '"/>' +
      '<rect x="10" y="30" width="9" height="15" fill="' + (night ? '#3E3226' : '#8A5A2B') + '"/>' +
      (night ? diya(30, 32, 1.4) : '') +
      ground(44, night ? '#6E6450' : '#D9C38A', night ? '#665C49' : '#CDB57E') +
      kalash(64, 50, 1.25) + tulsi(88, 48, 1.1) +
      '<path d="M0 52 H100 M0 58 H100" stroke="' + (night ? '#5E5544' : '#C4AB72') + '" stroke-width=".35"/>');
  }
  P.courtyardNight = function () { return courtyard(true); };
  P.courtyardMorning = function () { return courtyard(false); };

  Object.keys(P).forEach(function (k) { A.backgrounds[k] = P[k]; });
})(window.KathaCode = window.KathaCode || {});
