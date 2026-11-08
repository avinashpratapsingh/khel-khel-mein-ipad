/* Katha Code — original SVG art.
   Characters are drawn in a 100 x 150 box, feet at the bottom centre.
   Faces use separate groups (.kc-eyes, .kc-mouth) so later phases can change mood. */
(function (KC) {
  'use strict';

  var SKIN_H = '#D9602F';   // Hanuman: traditional sindoor-orange
  var SKIN_S = '#EBB88E';   // Sita

  function hanuman() {
    return '' +
      '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="34" ry="6" fill="#FFD36B"/>' +
      '<g class="kc-flip">' +
      // tail
      '<path d="M34 112 C 8 110, 4 76, 16 64 C 23 57, 31 63, 25 69" fill="none" stroke="#B8461F" stroke-width="7" stroke-linecap="round"/>' +
      // legs + feet
      '<rect x="38" y="112" width="9" height="26" rx="4" fill="' + SKIN_H + '"/>' +
      '<rect x="53" y="112" width="9" height="26" rx="4" fill="' + SKIN_H + '"/>' +
      '<ellipse cx="42" cy="140" rx="8" ry="4.5" fill="#B8461F"/>' +
      '<ellipse cx="58" cy="140" rx="8" ry="4.5" fill="#B8461F"/>' +
      // dhoti
      '<path d="M33 92 L67 92 L70 120 L53 122 L50 108 L47 122 L30 120 Z" fill="#F4A20B" stroke="#C96A06" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M32 117 L47 119 M53 119 L69 117" stroke="#1F7A8C" stroke-width="3" stroke-linecap="round"/>' +
      // torso
      '<rect x="34" y="60" width="32" height="36" rx="13" fill="' + SKIN_H + '"/>' +
      '<path d="M37 64 L63 92" stroke="#1F7A8C" stroke-width="5" stroke-linecap="round"/>' +
      // arms (one raised: the flying pose, palm open — no weapon)
      '<path d="M36 68 C 26 74, 24 84, 28 94" fill="none" stroke="' + SKIN_H + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M64 68 C 74 60, 78 50, 76 40" fill="none" stroke="' + SKIN_H + '" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="76" cy="37" r="6" fill="#F6C89A"/>' +
      '<circle cx="28" cy="96" r="5.5" fill="#F6C89A"/>' +
      // necklace
      '<path d="M40 63 Q50 72 60 63" fill="none" stroke="#F2B705" stroke-width="3" stroke-dasharray="1 3" stroke-linecap="round"/>' +
      // head
      '<circle cx="29" cy="41" r="7" fill="' + SKIN_H + '"/><circle cx="29" cy="41" r="3.5" fill="#F2B48A"/>' +
      '<circle cx="71" cy="41" r="7" fill="' + SKIN_H + '"/><circle cx="71" cy="41" r="3.5" fill="#F2B48A"/>' +
      '<circle cx="50" cy="40" r="20" fill="' + SKIN_H + '"/>' +
      '<ellipse cx="50" cy="45" rx="15" ry="13.5" fill="#F6C89A"/>' +
      '<ellipse cx="50" cy="52" rx="10" ry="7" fill="#FADFC4"/>' +
      '<g class="kc-eyes">' +
        '<ellipse cx="44" cy="41" rx="2.7" ry="3.3" fill="#2B1B12"/><circle cx="45" cy="40" r=".9" fill="#fff"/>' +
        '<ellipse cx="56" cy="41" rx="2.7" ry="3.3" fill="#2B1B12"/><circle cx="57" cy="40" r=".9" fill="#fff"/>' +
      '</g>' +
      '<g class="kc-mouth"><path d="M45 54 Q50 59 55 54" fill="none" stroke="#7A2E1A" stroke-width="2" stroke-linecap="round"/></g>' +
      // tilak + crown
      '<rect x="48.6" y="27" width="2.8" height="8" rx="1.4" fill="#E8321B"/>' +
      '<path d="M35 25 L39 14 L44.5 21 L50 9 L55.5 21 L61 14 L65 25 Z" fill="#F2B705" stroke="#C88A04" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<circle cx="50" cy="20" r="2.2" fill="#1F7A8C"/>' +
      '</g></svg>';
  }

  function sita() {
    return '' +
      '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="34" ry="6" fill="#FFD36B"/>' +
      '<g class="kc-flip">' +
      // hair at back (long braid)
      '<path d="M36 36 C 30 60, 34 84, 40 96" fill="none" stroke="#2B1B12" stroke-width="8" stroke-linecap="round"/>' +
      // saree skirt
      '<path d="M36 88 L64 88 L74 141 L26 141 Z" fill="#2E8B57"/>' +
      '<path d="M27 135 L73 135 L74 141 L26 141 Z" fill="#F2B705"/>' +
      '<path d="M47 90 L44 135 M53 90 L56 135" stroke="#27794B" stroke-width="1.5"/>' +
      // blouse
      '<rect x="37" y="60" width="26" height="31" rx="11" fill="#E8791E"/>' +
      // pallu over left shoulder
      '<path d="M58 60 C 66 66, 66 82, 60 96 L48 96 C 54 84, 54 70, 50 62 Z" fill="#3BA36A"/>' +
      '<path d="M60 96 L48 96" stroke="#F2B705" stroke-width="3"/>' +
      // arms, hands joined gently (namaste)
      '<path d="M38 68 C 32 76, 36 84, 46 84" fill="none" stroke="' + SKIN_S + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M62 68 C 68 76, 64 84, 54 84" fill="none" stroke="' + SKIN_S + '" stroke-width="7" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="83" rx="4" ry="5.5" fill="' + SKIN_S + '"/>' +
      // neck + head
      '<rect x="45" y="52" width="10" height="10" rx="4" fill="' + SKIN_S + '"/>' +
      '<circle cx="50" cy="40" r="17" fill="' + SKIN_S + '"/>' +
      // hair top with centre parting + sindoor
      '<path d="M33 40 C 33 22, 67 22, 67 40 C 63 31, 56 27, 50 27 C 44 27, 37 31, 33 40 Z" fill="#2B1B12"/>' +
      '<path d="M50 24.5 L50 29" stroke="#D92B2B" stroke-width="2" stroke-linecap="round"/>' +
      // small tiara
      '<path d="M40 25 L45 19 L50 23 L55 19 L60 25" fill="none" stroke="#F2B705" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<circle cx="34" cy="46" r="2.6" fill="#F2B705"/><circle cx="66" cy="46" r="2.6" fill="#F2B705"/>' +
      '<circle cx="50" cy="34" r="1.8" fill="#D92B2B"/>' +
      '<g class="kc-eyes">' +
        '<ellipse cx="44" cy="41" rx="2.4" ry="3" fill="#2B1B12"/><circle cx="44.8" cy="40" r=".8" fill="#fff"/>' +
        '<ellipse cx="56" cy="41" rx="2.4" ry="3" fill="#2B1B12"/><circle cx="56.8" cy="40" r=".8" fill="#fff"/>' +
      '</g>' +
      '<g class="kc-mouth"><path d="M46 49 Q50 52.5 54 49" fill="none" stroke="#A5422C" stroke-width="1.8" stroke-linecap="round"/></g>' +
      '</g></svg>';
  }

  /* Background: Hanuman's leap. Left: the mainland shore with Mount Mahendra
     (where Hanuman leapt from). Middle: the ocean. Right: Lanka, with the
     Ashok tree of Ashok Vatika where Sita waited. viewBox matches the 16:10 stage. */
  function lankaShore(bridge) {
    return '' +
      '<svg class="kc-bg" viewBox="0 0 100 62.5" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<linearGradient id="kcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0"/><stop offset="1" stop-color="#FFD5A1"/></linearGradient>' +
        '<linearGradient id="kcSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A93A6"/><stop offset="1" stop-color="#1A6575"/></linearGradient>' +
      '</defs>' +
      '<rect width="100" height="62.5" fill="url(#kcSky)"/>' +
      '<circle cx="50" cy="11" r="9" fill="#FFE2A8" opacity=".6"/><circle cx="50" cy="11" r="5.5" fill="#FFB547"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="22" cy="10" rx="6" ry="2"/><ellipse cx="26" cy="9" rx="4" ry="2.2"/><ellipse cx="74" cy="15" rx="5" ry="1.8"/><ellipse cx="77" cy="14" rx="3.5" ry="2"/></g>' +
      // Lanka city on the far right horizon: golden domes
      '<g fill="#E8B33A" stroke="#C4891A" stroke-width=".3">' +
        '<rect x="82" y="33" width="4" height="10"/><path d="M82 33 Q84 28 86 33 Z"/>' +
        '<rect x="87" y="29" width="5" height="14"/><path d="M87 29 Q89.5 22 92 29 Z"/>' +
        '<rect x="93" y="32" width="4" height="11"/><path d="M93 32 Q95 27 97 32 Z"/>' +
      '</g>' +
      // sea
      '<rect y="39" width="100" height="23.5" fill="url(#kcSea)"/>' +
      '<g fill="none" stroke="#7CC9D6" stroke-width=".5" stroke-linecap="round" opacity=".8">' +
        '<path d="M34 46 q2 -1 4 0 t4 0"/><path d="M48 50 q2 -1 4 0 t4 0"/><path d="M40 56 q2 -1 4 0 t4 0"/><path d="M56 44 q2 -1 4 0 t4 0"/><path d="M58 57 q2 -1 4 0 t4 0"/>' +
      '</g>' +
      bridgeSvg(bridge || 0) +
      // Mount Mahendra on the mainland
      '<path d="M-2 44 L10 22 L16 30 L24 44 Z" fill="#9C7A55"/><path d="M10 22 L13 26 L11 27 L8.5 25 Z" fill="#E9DCC6"/>' +
      // mainland shore
      '<path d="M0 42 Q16 39 30 43 L35 62.5 L0 62.5 Z" fill="#6BAA3A"/>' +
      '<path d="M30 43 Q32 50 35 62.5 L32 62.5 Q29 52 27.5 43 Z" fill="#EAD29A"/>' +
      // a palm on the mainland
      '<path d="M5 46 Q6 38 4.5 32" fill="none" stroke="#8A5A2B" stroke-width="1.2"/>' +
      '<g fill="#3E8E3A"><path d="M4.5 32 q-5 0 -7 3 q4 -1 7 -3z"/><path d="M4.5 32 q5 -1 7 2 q-4 -1 -7 -2z"/><path d="M4.5 32 q-1 -4 -4 -5 q2 3 4 5z"/><path d="M4.5 32 q2 -4 6 -4 q-3 2 -6 4z"/></g>' +
      // Lanka island shore
      '<path d="M66 44 Q84 40 102 42 L102 62.5 L62 62.5 Z" fill="#6BAA3A"/>' +
      '<path d="M66 44 Q64 52 62 62.5 L65 62.5 Q67 52 69 44 Z" fill="#EAD29A"/>' +
      // Ashok tree (red-orange blossoms) — Ashok Vatika
      '<path d="M93 47 L93.6 34" stroke="#7A4A22" stroke-width="1.6"/>' +
      '<g><ellipse cx="93" cy="31" rx="6.5" ry="5" fill="#3E8E3A"/><ellipse cx="89.5" cy="34" rx="4" ry="3" fill="#4FA048"/><ellipse cx="97" cy="33.5" rx="4" ry="3" fill="#4FA048"/></g>' +
      '<g fill="#F05A28"><circle cx="91" cy="29" r=".9"/><circle cx="95" cy="30" r=".9"/><circle cx="92.5" cy="33" r=".9"/><circle cx="96.5" cy="34" r=".8"/><circle cx="89" cy="33" r=".8"/></g>' +
      // flowers in the grass
      '<g fill="#F7D046"><circle cx="20" cy="56" r=".7"/><circle cx="12" cy="59" r=".7"/><circle cx="80" cy="58" r=".7"/><circle cx="74" cy="55" r=".7"/></g>' +
      '</svg>';
  }

  /* The setu (bridge) across the ocean, built by Nala and the vanara army.
     amount: 0 none · 0..1 partly built from the mainland · 1 complete. */
  function bridgeSvg(amount) {
    if (!amount) return '';
    var x0 = 26, x1 = x0 + (72 - x0) * amount, s = '';
    s += '<path d="M' + x0 + ' 44 L' + x1 + ' 44 L' + (x1 + 2) + ' 62.5 L' + (x0 - 4) + ' 62.5 Z" fill="#A8977E"/>';
    for (var x = x0; x < x1 - 1; x += 3.2) {
      for (var y = 45, row = 0; y < 62; y += 3.4, row++) {
        s += '<rect x="' + (x + (row % 2) * 1.6).toFixed(1) + '" y="' + y + '" width="2.9" height="3" rx=".8" fill="' + ((x * 7 + y) % 3 < 1 ? '#C4B396' : '#B7A588') + '"/>';
      }
    }
    if (amount < 1) s += '<g fill="#8F7E65"><circle cx="' + (x1 + 1) + '" cy="47" r="1.6"/><circle cx="' + (x1 + 2.4) + '" cy="52" r="1.3"/></g>';
    return s;
  }

  /* Background: Ashok Vatika at dusk. The big Shimshapa tree on the left is
     where Hanuman hid; Sita sat beneath it. Golden wall of Lanka behind. */
  function ashokVatika() {
    var blossoms = '';
    [[86, 25], [89, 22], [92, 26], [84, 28], [90, 29], [12, 34], [9, 37], [15, 37]].forEach(function (p) {
      blossoms += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".9" fill="#F05A28"/>';
    });
    var arches = '';
    for (var x = 2; x < 100; x += 8) arches += '<path d="M' + x + ' 42 V38.5 Q' + (x + 2.5) + ' 35.5 ' + (x + 5) + ' 38.5 V42 Z" fill="#C99A45"/>';
    return '' +
      '<svg class="kc-bg" viewBox="0 0 100 62.5" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="kcSkyV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BBA6DD"/><stop offset=".75" stop-color="#F6CFA6"/></linearGradient></defs>' +
      '<rect width="100" height="62.5" fill="url(#kcSkyV)"/>' +
      '<circle cx="80" cy="10" r="7" fill="#FFF6D8" opacity=".35"/><circle cx="80" cy="10" r="4" fill="#FFF6D8"/>' +
      '<g fill="#fff"><circle cx="60" cy="6" r=".35"/><circle cx="68" cy="13" r=".3"/><circle cx="92" cy="5" r=".35"/><circle cx="52" cy="12" r=".3"/></g>' +
      // golden wall of Lanka
      '<rect x="0" y="34" width="100" height="9" fill="#E7C27A"/><rect x="0" y="33" width="100" height="1.6" fill="#D4A955"/>' + arches +
      // garden ground
      '<rect x="0" y="42" width="100" height="20.5" fill="#7DBB4A"/>' +
      '<path d="M0 48 Q30 45 60 48 T100 47 V62.5 H0 Z" fill="#6BAA3A"/>' +
      '<path d="M40 62.5 Q46 52 58 46" fill="none" stroke="#D9C38A" stroke-width="3" opacity=".7"/>' +
      // Ashok trees (red-orange blossoms) at the sides
      '<path d="M88 44 L88.5 30" stroke="#7A4A22" stroke-width="1.6"/><ellipse cx="88" cy="26" rx="6.5" ry="5" fill="#3E8E3A"/><ellipse cx="85" cy="29" rx="4" ry="3" fill="#4FA048"/><ellipse cx="91.5" cy="28.5" rx="4" ry="3" fill="#4FA048"/>' +
      '<path d="M12 44 L12 37" stroke="#7A4A22" stroke-width="1.4"/><ellipse cx="12" cy="35" rx="5" ry="4" fill="#3E8E3A"/>' + blossoms +
      // flower bushes
      '<g><ellipse cx="70" cy="48" rx="5" ry="2.6" fill="#4FA048"/><ellipse cx="96" cy="50" rx="5" ry="2.6" fill="#4FA048"/><ellipse cx="4" cy="51" rx="5" ry="2.6" fill="#4FA048"/></g>' +
      '<g fill="#F7D046"><circle cx="68" cy="47" r=".7"/><circle cx="72" cy="47.5" r=".7"/><circle cx="95" cy="49" r=".7"/><circle cx="3" cy="50" r=".7"/></g>' +
      '<g fill="#F48FB1"><circle cx="70" cy="46.6" r=".6"/><circle cx="97.5" cy="49.5" r=".6"/><circle cx="6" cy="50" r=".6"/></g>' +
      // the Shimshapa tree
      '<path d="M33 54 C 34 44, 33 36, 31 28 M32 38 C 27 34, 24 30, 22 27 M32.5 34 C 37 30, 40 27, 42 24" fill="none" stroke="#7A4A22" stroke-width="3.2" stroke-linecap="round"/>' +
      '<ellipse cx="33" cy="54.5" rx="5" ry="1.4" fill="#5E9A35"/>' +
      '<g><ellipse cx="30" cy="18" rx="17" ry="12" fill="#2F7D3A"/><ellipse cx="20" cy="21" rx="8" ry="6" fill="#3E8E3A"/><ellipse cx="40" cy="20" rx="8" ry="6" fill="#3E8E3A"/><ellipse cx="30" cy="11" rx="9" ry="5.5" fill="#4FA048"/></g>' +
      '</svg>';
  }

  /* Mood faces. mood: 0 happy · 1 sad · 2 calm. Returns markup for .kc-eyes and .kc-mouth. */
  var FACE = {
    hanuman: { l: 44, r: 56, y: 41, rx: 2.7, ry: 3.3, mx: 50, my: 54, w: 5, c: '#7A2E1A' },
    sita:    { l: 44, r: 56, y: 41, rx: 2.4, ry: 3.0, mx: 50, my: 49, w: 4, c: '#A5422C' },
    person:  { l: 44, r: 56, y: 41, rx: 2.4, ry: 3.0, mx: 50, my: 51, w: 4, c: '#9A3B24' }
  };
  function face(sprite, mood) {
    var f = FACE[sprite] || (KC._art.personSprites && KC._art.personSprites[sprite] ? FACE.person : null);
    if (!f) return null;
    var dark = '#2B1B12', eyes, mouth;
    function eye(cx) {
      return '<ellipse cx="' + cx + '" cy="' + f.y + '" rx="' + f.rx + '" ry="' + f.ry + '" fill="' + dark + '"/><circle cx="' + (cx + 0.8) + '" cy="' + (f.y - 1) + '" r=".85" fill="#fff"/>';
    }
    if (mood === 2) {   // calm: eyes gently closed
      eyes = '<path d="M' + (f.l - 3) + ' ' + f.y + ' Q' + f.l + ' ' + (f.y + 2.6) + ' ' + (f.l + 3) + ' ' + f.y + ' M' + (f.r - 3) + ' ' + f.y + ' Q' + f.r + ' ' + (f.y + 2.6) + ' ' + (f.r + 3) + ' ' + f.y + '" fill="none" stroke="' + dark + '" stroke-width="1.6" stroke-linecap="round"/>';
      mouth = '<path d="M' + (f.mx - f.w * 0.6) + ' ' + f.my + ' Q' + f.mx + ' ' + (f.my + 2.5) + ' ' + (f.mx + f.w * 0.6) + ' ' + f.my + '" fill="none" stroke="' + f.c + '" stroke-width="1.8" stroke-linecap="round"/>';
    } else if (mood === 1) {   // sad: worried brows, small frown
      eyes = eye(f.l) + eye(f.r) +
        '<path d="M' + (f.l - 3.5) + ' ' + (f.y - 5) + ' L' + (f.l + 2.5) + ' ' + (f.y - 7) + ' M' + (f.r - 2.5) + ' ' + (f.y - 7) + ' L' + (f.r + 3.5) + ' ' + (f.y - 5) + '" stroke="' + dark + '" stroke-width="1.4" stroke-linecap="round"/>';
      mouth = '<path d="M' + (f.mx - f.w * 0.7) + ' ' + (f.my + 2) + ' Q' + f.mx + ' ' + (f.my - 1.5) + ' ' + (f.mx + f.w * 0.7) + ' ' + (f.my + 2) + '" fill="none" stroke="' + f.c + '" stroke-width="1.8" stroke-linecap="round"/>';
    } else {   // happy: big open smile
      eyes = eye(f.l) + eye(f.r);
      mouth = '<path d="M' + (f.mx - f.w) + ' ' + f.my + ' Q' + f.mx + ' ' + (f.my + f.w * 1.5) + ' ' + (f.mx + f.w) + ' ' + f.my + ' Z" fill="' + f.c + '"/>' +
        '<path d="M' + (f.mx - f.w * 0.5) + ' ' + (f.my + f.w * 0.55) + ' Q' + f.mx + ' ' + (f.my + f.w * 0.9) + ' ' + (f.mx + f.w * 0.5) + ' ' + (f.my + f.w * 0.55) + '" fill="#F28B82"/>';
    }
    return { eyes: eyes, mouth: mouth };
  }

  /* Small pictures (40×40) used on blocks and in speech bubbles. currentColor = white on blocks. */
  var S = 'stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var PICS = {
    heart:   '<path d="M20 33 C 6 24 6 12 13 11 C 17 10 19 13 20 15 C 21 13 23 10 27 11 C 34 12 34 24 20 33 Z" fill="currentColor"/>',
    waves:   '<path d="M5 15 q4 -4 7.5 0 t7.5 0 t7.5 0 t7.5 0 M5 23 q4 -4 7.5 0 t7.5 0 t7.5 0 t7.5 0 M5 31 q4 -4 7.5 0 t7.5 0 t7.5 0 t7.5 0" ' + S + '/>',
    namaste: '<path d="M20 5 C 15 10 13.5 20 14 29 L 20 35 L 26 29 C 26.5 20 25 10 20 5 Z M20 9 V31" ' + S + '/>',
    ring:    '<circle cx="20" cy="25" r="9" ' + S + '/><path d="M15 12 L20 7 L25 12 L20 16 Z" fill="currentColor"/>',
    sun:     '<circle cx="20" cy="20" r="6.5" fill="currentColor"/><path d="M20 4 V9 M20 31 V36 M4 20 H9 M31 20 H36 M8.7 8.7 L12.2 12.2 M27.8 27.8 L31.3 31.3 M8.7 31.3 L12.2 27.8 M27.8 12.2 L31.3 8.7" ' + S.replace('3.6', '3') + '/>',
    flower:  '<g fill="currentColor"><circle cx="20" cy="11" r="5.5"/><circle cx="28.5" cy="17.5" r="5.5"/><circle cx="25.5" cy="27.5" r="5.5"/><circle cx="14.5" cy="27.5" r="5.5"/><circle cx="11.5" cy="17.5" r="5.5"/></g><circle cx="20" cy="20" r="4" fill="#F7D046"/>',
    gem:     '<path d="M10 16 L16 9 H24 L30 16 L20 32 Z M10 16 H30 M16 9 L20 16 L24 9 M20 16 V32" ' + S.replace('3.6', '2.8') + '/>',
    scroll:  '<path d="M11 8 H27 Q31 8 31 12 V32 H15 Q11 32 11 28 Z M11 12 H31 M16 18 H26 M16 23 H26 M16 28 H23" ' + S.replace('3.6', '2.6') + '/>',
    tree:    '<path d="M20 36 V22" ' + S + '/><circle cx="20" cy="15" r="10" fill="currentColor"/>',
    home:    '<path d="M6 20 L20 7 L34 20 M10 17 V33 H30 V17" ' + S + '/><rect x="17" y="23" width="6" height="10" fill="currentColor"/>',
    question:'<path d="M13 14 Q13 6 20 6 Q28 6 28 13 Q28 19 20 21 V26" ' + S + '/><circle cx="20" cy="33" r="2.6" fill="currentColor"/>',
    star:    '<path d="M20 4 L24.5 14.5 L36 15.5 L27 23 L30 34 L20 28 L10 34 L13 23 L4 15.5 L15.5 14.5 Z" fill="currentColor"/>',
    sprout:  '<path d="M20 36 V18" ' + S + '/><path d="M20 22 C 10 22 6 14 7 8 C 15 8 20 14 20 22 Z M20 18 C 26 18 33 13 33 6 C 25 6 20 11 20 18 Z" fill="currentColor"/>',
    drop:    '<path d="M20 5 C 26 14 31 20 31 26 A 11 11 0 0 1 9 26 C 9 20 14 14 20 5 Z" fill="currentColor"/>',
    crystal: '<path d="M14 12 L20 6 L26 12 L20 18 Z M8 24 L13 19 L18 24 L13 29 Z M22 26 L28 20 L34 26 L28 32 Z M15 31 L20 26 L25 31 L20 36 Z" fill="currentColor"/>',
    om:      '<text x="20" y="31" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor" font-family="Noto Sans Devanagari, Kohinoor Devanagari, sans-serif">ॐ</text>',
    moon:    '<path d="M27 6 A 15 15 0 1 0 34 26 A 12 12 0 1 1 27 6 Z" fill="currentColor"/>',
    paduka:  '<rect x="8" y="6" width="10" height="28" rx="5" fill="currentColor"/><rect x="22" y="6" width="10" height="28" rx="5" fill="currentColor"/>',
    wheel:   '<circle cx="20" cy="20" r="14" ' + S.replace('3.6', '3') + '/><circle cx="20" cy="20" r="3.4" fill="currentColor"/><path d="M20 6 V34 M6 20 H34 M10 10 L30 30 M30 10 L10 30" ' + S.replace('3.6', '2') + '/>',
    flame:   '<path d="M20 4 C 27 13 27 20 20 24 C 13 20 13 13 20 4 Z" fill="currentColor"/><path d="M6 26 H34 C 32 33 27 36 20 36 C 13 36 8 33 6 26 Z" fill="currentColor"/>'
  };
  function pic(name) {
    return '<svg class="kc-icon" viewBox="0 0 40 40">' + (PICS[name] || PICS.heart) + '</svg>';
  }

  function diya() {
    return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="kc-flame" d="M20 4 C 25 12 25 18 20 21 C 15 18 15 12 20 4 Z" fill="#FFC531"/>' +
      '<path d="M20 10 C 22.5 14 22.5 17 20 19 C 17.5 17 17.5 14 20 10 Z" fill="#FF7A1A"/>' +
      '<path d="M4 22 H36 C 34 32 28 36 20 36 C 12 36 6 32 4 22 Z" fill="#C2571A"/>' +
      '<path d="M8 26 H32" stroke="#F2B705" stroke-width="2" stroke-dasharray="2 2.5"/>' +
      '</svg>';
  }

  KC._art = {
    characters: { hanuman: hanuman, sita: sita },
    backgrounds: {
      lankaShore: function () { return lankaShore(0); },
      setuBuild: function () { return lankaShore(0.55); },
      setuDone: function () { return lankaShore(1); },
      ashokVatika: ashokVatika
    },
    face: face, pic: pic, diya: diya,
    aspect: 16 / 10,          // stage width / height
    stageW: 100,              // logical units
    stageH: 62.5,
    charH: 25                 // character height in logical units
  };
})(window.KathaCode = window.KathaCode || {});
