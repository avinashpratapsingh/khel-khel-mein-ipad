/* Katha Code — character builder.
   Every person is drawn from one template (100 × 150 box, feet at the bottom
   centre) so the whole cast shares one warm style and one face layout, which
   lets mood blocks work for everyone.
   Story notes on costume:
   - Ram and Lakshman wear royal dress in Ayodhya, and bark cloth (valkala)
     with matted hair (jata) in the forest, as in Valmiki.
   - Krishna on the battlefield is Arjun's charioteer: crown and peacock
     feather, no flute (the flute belongs to Vrindavan, not Kurukshetra).
   - Jabala wears no sindoor: the Upanishad does not say she was married. */
(function (KC) {
  'use strict';

  var A = KC._art;
  var GOLD = '#F2B705', GOLD_D = '#C88A04';

  function shade(x) { return '<ellipse cx="' + x + '" cy="140" rx="7.5" ry="4.2" fill="rgba(0,0,0,.18)"/>'; }

  function person(o) {
    var sk = o.skin, hair = o.hair || '#2B1B12', p = [];
    p.push('<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">');
    p.push('<ellipse class="kc-glow" cx="50" cy="145" rx="34" ry="6" fill="#FFD36B"/>');

    /* ---- back layer ---- */
    if (o.bow) p.push('<path d="M31 50 Q 13 82 31 114" fill="none" stroke="#8A5A2B" stroke-width="3.4" stroke-linecap="round"/><path d="M31 50 L31 114" stroke="#F2E6CF" stroke-width=".9"/>');
    if (o.style === 'jata' || o.style === 'longhair') {
      p.push('<path d="M35 38 C 29 56, 31 70, 36 80 M65 38 C 71 56, 69 70, 64 80" fill="none" stroke="' + hair + '" stroke-width="7" stroke-linecap="round"/>');
    }
    if (o.style === 'braids') {
      p.push('<path d="M34 40 C 29 54, 30 64, 32 74 M66 40 C 71 54, 70 64, 68 74" fill="none" stroke="' + hair + '" stroke-width="5.5" stroke-linecap="round"/>' +
        '<circle cx="32" cy="76" r="3" fill="' + (o.ribbon || '#E0483A') + '"/><circle cx="68" cy="76" r="3" fill="' + (o.ribbon || '#E0483A') + '"/>');
    }
    if (o.style === 'bun') p.push('<path d="M36 36 C 30 52, 33 66, 38 74" fill="none" stroke="' + hair + '" stroke-width="7" stroke-linecap="round"/>');

    /* ---- legs, lower garment ---- */
    var lower = o.lower || '#F4EFE6', border = o.border || '#C96A06';
    if (o.saree) {
      p.push('<path d="M36 88 L64 88 L74 141 L26 141 Z" fill="' + lower + '"/><path d="M27 135 L73 135 L74 141 L26 141 Z" fill="' + border + '"/>');
    } else if (o.lehenga) {
      p.push('<rect x="40" y="126" width="7" height="12" rx="3" fill="' + sk + '"/><rect x="53" y="126" width="7" height="12" rx="3" fill="' + sk + '"/>' + shade(43) + shade(57));
      p.push('<path d="M36 88 L64 88 L73 130 L27 130 Z" fill="' + lower + '"/><path d="M28 125 L72 125 L73 130 L27 130 Z" fill="' + border + '"/>');
    } else if (o.robe) {
      p.push(shade(42) + shade(58));
      p.push('<path d="M34 90 L66 90 L70 138 L30 138 Z" fill="' + lower + '"/><path d="M31 133 L69 133 L70 138 L30 138 Z" fill="' + border + '"/>');
    } else {
      p.push('<rect x="38" y="112" width="9" height="26" rx="4" fill="' + sk + '"/><rect x="53" y="112" width="9" height="26" rx="4" fill="' + sk + '"/>' + shade(42) + shade(58));
      p.push('<path d="M33 92 L67 92 L70 120 L53 122 L50 108 L47 122 L30 120 Z" fill="' + lower + '" stroke="' + border + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M32 117 L47 119 M53 119 L69 117" stroke="' + border + '" stroke-width="2.6" stroke-linecap="round"/>');
    }

    /* ---- torso ---- */
    var long = o.kurta ? 46 : 36;
    p.push('<rect x="35" y="60" width="30" height="' + long + '" rx="12" fill="' + (o.top || sk) + '"/>');
    if (!o.top && o.sash !== false) p.push('<path d="M38 62 C 46 72, 55 82, 62 95" stroke="' + (o.sash || '#1F7A8C') + '" stroke-width="5.5" stroke-linecap="round" fill="none"/>');
    if (o.kurta) p.push('<path d="M50 62 V80" stroke="rgba(0,0,0,.18)" stroke-width="1.4"/><circle cx="50" cy="68" r="1.1" fill="' + GOLD + '"/><circle cx="50" cy="74" r="1.1" fill="' + GOLD + '"/>');
    if (o.saree || o.pallu) p.push('<path d="M58 60 C 66 66, 66 82, 60 96 L48 96 C 54 84, 54 70, 50 62 Z" fill="' + (o.pallu || lower) + '"/><path d="M60 96 L48 96" stroke="' + border + '" stroke-width="3"/>');
    if (o.thread) p.push('<path d="M40 61 L60 94" stroke="#F4EFE6" stroke-width="1.2"/>');   // sacred thread
    if (o.jewel) p.push('<path d="M40 63 Q50 72 60 63" fill="none" stroke="' + GOLD + '" stroke-width="3" stroke-dasharray="1 3" stroke-linecap="round"/>');
    if (o.mala) p.push('<path d="M40 62 Q50 80 60 62" fill="none" stroke="#8A3B1E" stroke-width="2.6" stroke-dasharray="1 2.6" stroke-linecap="round"/>');

    /* ---- arms ---- */
    var arm = 'fill="none" stroke="' + sk + '" stroke-width="7" stroke-linecap="round"';
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="' + sk + '"/>'; };
    switch (o.arms) {
      case 'namaste':
      case 'paduka':
        p.push('<path d="M38 68 C 32 76, 36 84, 46 84" ' + arm + '/><path d="M62 68 C 68 76, 64 84, 54 84" ' + arm + '/><ellipse cx="50" cy="83" rx="4" ry="5.5" fill="' + sk + '"/>');
        if (o.arms === 'paduka') p.push('<g fill="#8A5A2B"><rect x="41" y="70" width="8" height="15" rx="4"/><rect x="51" y="70" width="8" height="15" rx="4"/></g><g fill="' + GOLD + '"><circle cx="45" cy="73" r="1.4"/><circle cx="55" cy="73" r="1.4"/></g>');
        break;
      case 'bless':
        p.push('<path d="M37 67 C 30 77, 29 87, 31 96" ' + arm + '/>' + hand(31, 97));
        p.push('<path d="M63 67 C 72 63, 75 55, 73 47" ' + arm + '/><ellipse cx="73" cy="43" rx="4.6" ry="5.6" fill="' + sk + '"/>');
        break;
      case 'staff':
        p.push('<path d="M71 30 V140" stroke="#7A4A22" stroke-width="3.2" stroke-linecap="round"/>');
        if (o.staffTop) p.push('<circle cx="71" cy="29" r="3.4" fill="' + o.staffTop + '"/>');
        p.push('<path d="M37 67 C 30 77, 29 87, 31 96" ' + arm + '/>' + hand(31, 97));
        p.push('<path d="M63 67 C 69 72, 71 78, 70 84" ' + arm + '/>' + hand(70, 86));
        break;
      default:
        p.push('<path d="M37 67 C 30 77, 29 87, 31 96" ' + arm + '/><path d="M63 67 C 70 77, 71 87, 69 96" ' + arm + '/>' + hand(31, 97) + hand(69, 97));
    }

    /* ---- head ---- */
    p.push('<rect x="45" y="51" width="10" height="11" rx="4" fill="' + sk + '"/>');
    p.push('<circle cx="33" cy="42" r="4" fill="' + sk + '"/><circle cx="67" cy="42" r="4" fill="' + sk + '"/>');
    p.push('<circle cx="50" cy="40" r="17" fill="' + sk + '"/>');
    if (o.earrings) p.push('<circle cx="33" cy="47" r="2.4" fill="' + GOLD + '"/><circle cx="67" cy="47" r="2.4" fill="' + GOLD + '"/>');

    // hair (top) for everyone except bald styles
    p.push('<path d="M33 40 C 33 23, 67 23, 67 40 C 62 32, 56 29, 50 29 C 44 29, 38 32, 33 40 Z" fill="' + hair + '"/>');
    if (o.style === 'crown') p.push('<path d="M34 38 C 31 47, 32 54, 35 58 M66 38 C 69 47, 68 54, 65 58" fill="none" stroke="' + hair + '" stroke-width="5" stroke-linecap="round"/>');
    if (o.style === 'kid') p.push('<path d="M53 24 q 4 -6 9 -4" fill="none" stroke="' + hair + '" stroke-width="3" stroke-linecap="round"/>');
    if (o.style === 'topknot') p.push('<circle cx="50" cy="22" r="5.8" fill="' + hair + '"/>');
    if (o.style === 'jata') p.push('<ellipse cx="50" cy="19" rx="9" ry="7" fill="' + hair + '"/><path d="M42 21 Q50 16 58 21" stroke="rgba(0,0,0,.2)" stroke-width="1.2" fill="none"/>');
    if (o.style === 'bun') p.push('<ellipse cx="50" cy="22" rx="7" ry="5" fill="' + hair + '"/>');
    if (o.parting) p.push('<path d="M50 24.5 L50 29" stroke="#D92B2B" stroke-width="2" stroke-linecap="round"/>');

    if (o.crown) {
      var c = o.crown, cd = o.crownDark || GOLD_D;
      p.push('<path d="M36 29 L38.5 17 L44.5 24 L50 12 L55.5 24 L61.5 17 L64 29 Z" fill="' + c + '" stroke="' + cd + '" stroke-width="1.1" stroke-linejoin="round"/>' +
        '<rect x="35.5" y="26.5" width="29" height="4" rx="1.5" fill="' + c + '" stroke="' + cd + '" stroke-width=".8"/><circle cx="50" cy="21" r="2.2" fill="' + (o.gem || '#E0483A') + '"/>');
    }
    if (o.peacock) {
      p.push('<g transform="rotate(22 58 14)"><ellipse cx="58" cy="10" rx="3.6" ry="9" fill="#2E8B57"/><ellipse cx="58" cy="6" rx="2.6" ry="3.4" fill="#1F5FA8"/><ellipse cx="58" cy="6" rx="1.2" ry="1.6" fill="#1FB0A0"/></g>');
    }

    /* ---- face ---- */
    if (o.beard) {
      p.push('<path d="M35 44 C 36 66, 64 66, 65 44 C 61 55, 39 55, 35 44 Z" fill="' + o.beard + '"/>');
      p.push('<path d="M43.5 49 Q50 46.4 56.5 49" fill="none" stroke="' + o.beard + '" stroke-width="2.4" stroke-linecap="round"/>');
    }
    p.push('<g class="kc-eyes"><ellipse cx="44" cy="41" rx="2.4" ry="3" fill="#2B1B12"/><circle cx="44.8" cy="40" r=".8" fill="#fff"/>' +
      '<ellipse cx="56" cy="41" rx="2.4" ry="3" fill="#2B1B12"/><circle cx="56.8" cy="40" r=".8" fill="#fff"/></g>');
    p.push('<g class="kc-mouth"><path d="M46 51 Q50 54.5 54 51" fill="none" stroke="#9A3B24" stroke-width="1.8" stroke-linecap="round"/></g>');
    if (o.cheeks) p.push('<circle cx="40" cy="47" r="2.6" fill="#F28B82" opacity=".45"/><circle cx="60" cy="47" r="2.6" fill="#F28B82" opacity=".45"/>');

    // tilak
    if (o.tilak === 'u') p.push('<path d="M47 30 Q50 37 53 30" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M50 30.5 V35" stroke="#E8321B" stroke-width="1.6" stroke-linecap="round"/>');
    else if (o.tilak === 'line') p.push('<rect x="48.8" y="30" width="2.4" height="6" rx="1.2" fill="#E8321B"/>');
    else if (o.tilak === 'ash') p.push('<path d="M45 31 H55 M45 33.4 H55 M45 35.8 H55" stroke="#F3EDE3" stroke-width="1.1" stroke-linecap="round"/><circle cx="50" cy="33.4" r="1" fill="#E8321B"/>');
    else if (o.tilak === 'dot') p.push('<circle cx="50" cy="34" r="1.7" fill="#D92B2B"/>');

    p.push('</svg>');
    return p.join('');
  }

  /* ---- animals and objects (drawn in the same 100 × 150 box) ---- */
  function deer() {
    // Valmiki: a golden deer with silver spots and jewel-like horns (Maricha's illusion).
    var legs = '';
    [31, 39, 61, 69].forEach(function (x) { legs += '<rect x="' + x + '" y="116" width="3.6" height="24" rx="1.6" fill="#C98F2A"/><rect x="' + x + '" y="136" width="3.6" height="4" fill="#5A3A1A"/>'; });
    var spots = '';
    [[40, 108], [48, 104], [56, 108], [45, 115], [60, 114], [36, 114], [52, 112]].forEach(function (s) { spots += '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="1.9" fill="#F4F4FA"/>'; });
    return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="34" ry="6" fill="#FFD36B"/>' + legs +
      '<ellipse cx="25" cy="104" rx="4" ry="3" fill="#F4E3B8"/>' +
      '<ellipse cx="50" cy="111" rx="26" ry="12" fill="#E8B33A"/><ellipse cx="50" cy="117" rx="20" ry="5" fill="#F6D47E"/>' + spots +
      '<path d="M67 106 C 71 96, 73 89, 75 83" stroke="#E8B33A" stroke-width="9" stroke-linecap="round" fill="none"/>' +
      '<g transform="rotate(18 79 79)"><ellipse cx="79" cy="79" rx="9" ry="6.4" fill="#E8B33A"/><ellipse cx="87" cy="81" rx="3.6" ry="3" fill="#C98F2A"/></g>' +
      '<ellipse cx="73" cy="72" rx="2.2" ry="4.4" fill="#C98F2A" transform="rotate(-25 73 72)"/>' +
      '<path d="M77 72 L74 60 M75 64 L70 59 M77 72 L82 61 M80.5 65 L86 62" stroke="#7FC8E0" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<g fill="#3FB6D9"><circle cx="74" cy="59.5" r="1.8"/><circle cx="70" cy="58.6" r="1.5"/><circle cx="82" cy="60.5" r="1.8"/><circle cx="86" cy="61.5" r="1.5"/></g>' +
      '<circle cx="80" cy="77" r="1.4" fill="#2B1B12"/><circle cx="80.5" cy="76.5" r=".45" fill="#fff"/>' +
      '</svg>';
  }

  function squirrel() {
    return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="34" ry="6" fill="#FFD36B"/>' +
      '<path d="M34 132 C 12 128, 8 96, 26 86 C 38 80, 44 96, 34 102" fill="none" stroke="#8C6644" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M34 132 C 14 128, 11 98, 26 89" fill="none" stroke="#B48A63" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="126" rx="16" ry="13" fill="#A47A55"/><ellipse cx="54" cy="130" rx="8" ry="8" fill="#EAD7B9"/>' +
      '<path d="M38 117 Q50 112 60 118 M38 122 Q50 117 61 123" stroke="#F4E6CF" stroke-width="2" fill="none"/><path d="M38 119.5 Q50 114.5 60.5 120.5" stroke="#5E4128" stroke-width="1.6" fill="none"/>' +
      '<circle cx="63" cy="110" r="9.5" fill="#A47A55"/><ellipse cx="71" cy="113" rx="3.4" ry="2.8" fill="#C79D76"/>' +
      '<ellipse cx="59" cy="101" rx="2.4" ry="3.6" fill="#8C6644"/>' +
      '<circle cx="66" cy="108" r="1.7" fill="#2B1B12"/><circle cx="66.6" cy="107.4" r=".55" fill="#fff"/><circle cx="74" cy="112" r="1" fill="#5E4128"/>' +
      '<ellipse cx="44" cy="139" rx="5" ry="2.6" fill="#8C6644"/><ellipse cx="58" cy="139" rx="5" ry="2.6" fill="#8C6644"/><ellipse cx="62" cy="124" rx="3" ry="4" fill="#8C6644"/>' +
      '</svg>';
  }

  function pushpak() {
    return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="40" ry="6" fill="#FFD36B"/>' +
      '<g fill="#fff" opacity=".85"><ellipse cx="22" cy="138" rx="12" ry="5"/><ellipse cx="50" cy="140" rx="16" ry="6"/><ellipse cx="78" cy="138" rx="12" ry="5"/></g>' +
      '<path d="M6 116 H94 L84 132 H16 Z" fill="#E8B33A" stroke="#C4891A" stroke-width="1.2"/>' +
      '<path d="M10 122 H90" stroke="#C4891A" stroke-width="1" stroke-dasharray="2 3"/>' +
      '<rect x="18" y="96" width="64" height="20" fill="#F7D57A" stroke="#C4891A" stroke-width="1"/>' +
      '<g fill="#C4891A"><rect x="24" y="96" width="3" height="20"/><rect x="40" y="96" width="3" height="20"/><rect x="57" y="96" width="3" height="20"/><rect x="73" y="96" width="3" height="20"/></g>' +
      '<path d="M22 96 Q50 52 78 96 Z" fill="#E8B33A" stroke="#C4891A" stroke-width="1.2"/>' +
      '<path d="M34 96 Q50 70 66 96" fill="none" stroke="#F7D57A" stroke-width="2"/>' +
      '<path d="M50 58 L47 64 H53 Z" fill="' + GOLD + '"/><circle cx="50" cy="56" r="2.4" fill="' + GOLD + '"/>' +
      '<g><path d="M14 116 V100" stroke="#8A5A2B" stroke-width="1.4"/><path d="M14 100 L22 103 L14 106 Z" fill="#F28C1B"/>' +
      '<path d="M86 116 V100" stroke="#8A5A2B" stroke-width="1.4"/><path d="M86 100 L94 103 L86 106 Z" fill="#F28C1B"/></g>' +
      '<g fill="#E0483A"><circle cx="30" cy="126" r="1.6"/><circle cx="50" cy="127" r="1.6"/><circle cx="70" cy="126" r="1.6"/></g>' +
      '</svg>';
  }

  function plant() {
    return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="30" ry="6" fill="#FFD36B"/>' +
      '<path d="M50 122 C 50 110, 49 100, 50 84" stroke="#3E8E3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 104 C 40 100, 34 92, 34 86 C 42 86, 48 94, 50 104 Z" fill="#4FA048"/>' +
      '<path d="M50 96 C 60 92, 66 84, 66 78 C 58 78, 52 86, 50 96 Z" fill="#5DB352"/>' +
      '<path d="M50 86 C 45 80, 45 72, 50 68 C 55 72, 55 80, 50 86 Z" fill="#6BC25E"/>' +
      '<path d="M37 122 H63 L59 142 H41 Z" fill="#C2571A"/><rect x="35" y="119" width="30" height="5" rx="2" fill="#D9692A"/>' +
      '<path d="M41 131 H59" stroke="#F2B705" stroke-width="1.5" stroke-dasharray="2 2"/>' +
      '</svg>';
  }

  function salt() {
    var cr = '';
    [[42, 132, 0], [50, 128, 15], [58, 132, -10], [46, 136, 30], [55, 136, 5], [50, 134, -20], [38, 136, 10], [62, 136, 20]].forEach(function (c) {
      cr += '<path d="M' + c[0] + ' ' + (c[1] - 4) + ' L' + (c[0] + 3.5) + ' ' + c[1] + ' L' + c[0] + ' ' + (c[1] + 4) + ' L' + (c[0] - 3.5) + ' ' + c[1] + ' Z" fill="#FFFFFF" stroke="#9FC9DB" stroke-width=".8" transform="rotate(' + c[2] + ' ' + c[0] + ' ' + c[1] + ')"/>';
    });
    return '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="kc-glow" cx="50" cy="145" rx="30" ry="6" fill="#FFD36B"/>' +
      '<ellipse cx="50" cy="140" rx="24" ry="5" fill="#4FA048"/><path d="M26 140 Q50 136 74 140" stroke="#3E8E3A" stroke-width="1" fill="none"/>' + cr +
      '</svg>';
  }

  /* ---- the cast ---- */
  var RAM_SKIN = '#6E9DDB';        // Shri Ram and Shri Krishna are traditionally painted blue (shyam)
  var VALKALA = '#9C6B3A', VALKALA_D = '#6E4824';
  var PEOPLE = {
    ram:        { skin: RAM_SKIN, lower: '#F2B705', border: '#C96A06', sash: '#E0483A', style: 'crown', crown: GOLD, jewel: true, tilak: 'u', bow: true, earrings: true },
    ramVan:     { skin: RAM_SKIN, lower: VALKALA, border: VALKALA_D, sash: '#7A4F25', style: 'jata', tilak: 'u', bow: true, mala: true },
    ramRaja:    { skin: RAM_SKIN, lower: '#F2B705', border: '#C96A06', sash: '#E0483A', style: 'crown', crown: GOLD, jewel: true, tilak: 'u', earrings: true, arms: 'bless' },
    lakshman:   { skin: '#EDC39C', lower: '#E85A1B', border: '#F2B705', sash: '#1F7A8C', style: 'crown', crown: GOLD, jewel: true, tilak: 'u', bow: true, earrings: true },
    lakshmanVan:{ skin: '#EDC39C', lower: VALKALA, border: VALKALA_D, sash: '#7A4F25', style: 'jata', tilak: 'u', bow: true, mala: true },
    bharatVan:  { skin: '#E5B48C', lower: VALKALA, border: VALKALA_D, sash: '#7A4F25', style: 'jata', tilak: 'u', arms: 'paduka', mala: true },
    krishna:    { skin: RAM_SKIN, lower: '#F2B705', border: '#C96A06', sash: '#2E8B57', style: 'crown', crown: GOLD, gem: '#1F7A8C', peacock: true, jewel: true, tilak: 'u', earrings: true, arms: 'bless' },
    arjun:      { skin: '#D9A27A', lower: '#F4EFE6', border: '#B8321F', sash: '#B8321F', style: 'crown', crown: '#E6C25A', jewel: true, tilak: 'line', bow: true, earrings: true },
    bittu:      { skin: '#EBB88E', lehenga: true, lower: '#E85A8C', border: GOLD, top: '#F28C1B', style: 'braids', ribbon: '#2E8B57', tilak: 'dot', cheeks: true, earrings: true },
    prabal:     { skin: '#E2A97F', lower: '#F4EFE6', border: '#F28C1B', top: '#F2B705', kurta: true, style: 'kid', tilak: 'line', cheeks: true },
    nachiketa:  { skin: '#E7B48B', lower: '#F4EFE6', border: '#F28C1B', sash: '#F28C1B', style: 'topknot', tilak: 'line', thread: true, cheeks: true },
    yama:       { skin: '#4E7F96', lower: '#B8321F', border: GOLD, sash: '#F2B705', style: 'crown', crown: '#E6B33A', gem: '#2E8B57', jewel: true, tilak: 'line', earrings: true, arms: 'staff', staffTop: '#E6B33A' },
    satyakam:   { skin: '#D9A27A', lower: '#F4EFE6', border: '#8A5A2B', sash: '#C2571A', style: 'topknot', tilak: 'line', cheeks: true },
    jabala:     { skin: '#D9A27A', saree: true, lower: '#C2571A', border: '#F2B705', pallu: '#D9692A', top: '#8A3B1E', style: 'bun', tilak: 'dot', arms: 'namaste' },
    gautama:    { skin: '#E9C2A0', hair: '#F1EEE8', beard: '#F1EEE8', robe: true, lower: '#F28C1B', border: '#C96A06', sash: '#F28C1B', style: 'jata', tilak: 'ash', thread: true, mala: true, arms: 'staff' },
    uddalaka:   { skin: '#E5B994', hair: '#C9C3BA', beard: '#C9C3BA', robe: true, lower: '#F4EFE6', border: '#F28C1B', sash: '#F28C1B', style: 'jata', tilak: 'ash', thread: true, mala: true, arms: 'bless' },
    shvetaketu: { skin: '#E7B48B', lower: '#F4EFE6', border: '#1F7A8C', sash: '#1F7A8C', style: 'topknot', tilak: 'line', thread: true, cheeks: true }
  };

  A.personSprites = {};
  Object.keys(PEOPLE).forEach(function (id) {
    var o = PEOPLE[id];
    A.characters[id] = function () { return person(o); };
    A.personSprites[id] = true;
  });
  // Portrait crops for non-human sprites (the shelf shows the head area by default).
  A.portraitBox = { deer: '30 50 64 64', squirrel: '14 84 70 60', pushpak: '0 44 100 100', plant: '22 62 56 80', salt: '22 112 56 36' };
  A.characters.deer = deer;
  A.characters.squirrel = squirrel;
  A.characters.pushpak = pushpak;
  A.characters.plant = plant;
  A.characters.salt = salt;
})(window.KathaCode = window.KathaCode || {});
