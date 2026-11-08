/* Katha Code — Bhagavad Gita kits (3).
   Each kit has a Kurukshetra scene where Krishna teaches Arjun (lines follow
   the named verses, in simple Hindi), and a garden scene where Bittu and
   Prabal use the same lesson today. The garden scenes are an application
   for children, clearly not part of the Gita's story. */
(function (KC) {
  'use strict';
  var GROUND = { ground: { x0: 3, x1: 97, y0: 49, y1: 59 } };
  var KURU_FACTS = [
    'The Gita is Krishna\'s teaching to Arjun on his chariot at Kurukshetra, just before the war, with Krishna as his charioteer.',
    'Arjun\'s chariot flag carried Hanuman (kapidhvaja). The armies are only distant flags here; the war is not shown.'
  ];
  var GARDEN_FACTS = ['Bittu (7) and Prabal (6) are today\'s children using the same lesson at home. This scene is not part of the Gita.'];
  var KIDS = {
    bittu:  { name: 'बिट्टू', sprite: 'bittu', size: 0.8 },
    prabal: { name: 'प्रबल', sprite: 'prabal', size: 0.76 }
  };
  function kids(bittuPhrases, prabalPhrases) {
    return {
      bittu: { name: KIDS.bittu.name, sprite: 'bittu', size: KIDS.bittu.size, phrases: bittuPhrases },
      prabal: { name: KIDS.prabal.name, sprite: 'prabal', size: KIDS.prabal.size, phrases: prabalPhrases }
    };
  }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  /* 6 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'karm-karo', section: 'gita',
    title: 'कर्म करो', titleEn: 'Do Your Work',
    value: 'काम पर ध्यान, फल की चिंता नहीं',
    lesson: 'शाबाश! हम अपना काम मन लगाकर करेंगे।',
    source: 'श्रीमद्भगवद्गीता 2.7, 2.47, 18.73',
    narration: 'कुरुक्षेत्र में अर्जुन बहुत परेशान थे। उन्होंने श्री कृष्ण से पूछा, मैं क्या करूँ? श्री कृष्ण ने समझाया: तुम्हारा काम है अपना कर्म अच्छे से करना। फल तुम्हारे हाथ में नहीं, इसलिए उसकी चिंता मत करो। बिट्टू और प्रबल भी रोज़ पौधे को पानी देते हैं, और बड़ा होना पौधे पर छोड़ देते हैं।',
    phrases: {
      kyaKaroon: { icon: 'question', text: 'केशव, बताइए, मैं क्या करूँ?' },                 // 2.7
      manunga:   { icon: 'heart',    text: 'मैं आपकी बात मानूँगा' },                         // 18.73
      karm:      { icon: 'star',     text: 'अपना काम मन लगाकर करो' },                        // 2.47
      phal:      { icon: 'sprout',   text: 'फल की चिंता मत करो' },                            // 2.47
      paani:     { icon: 'drop',     text: 'आओ, रोज़ पौधे को पानी दें' },
      kab:       { icon: 'question', text: 'पौधा कब बड़ा होगा?' },
      chhodo:    { icon: 'sprout',   text: 'हम पानी देंगे, बड़ा होना पौधे का काम है' }
    },
    characters: merge({
      krishna: { name: 'श्री कृष्ण', sprite: 'krishna', phrases: ['karm', 'phal'] },
      arjun:   { name: 'अर्जुन', sprite: 'arjun', phrases: ['kyaKaroon', 'manunga'] },
      plant:   { name: 'पौधा', sprite: 'plant', size: 0.75, canChangeSize: true, phrases: [] }
    }, kids(['paani', 'chhodo'], ['kab'])),
    scenes: [
      { id: 'kurukshetra', title: 'कुरुक्षेत्र', background: 'kurukshetra', facts: KURU_FACTS, places: GROUND,
        cast: [{ id: 'krishna', x: 60, y: 54 }, { id: 'arjun', x: 76, y: 55, face: -1 }],
        starter: { krishna: [['flag']] } },
      { id: 'bagicha', title: 'बिट्टू-प्रबल का बगीचा', background: 'garden', facts: GARDEN_FACTS, places: GROUND,
        cast: [{ id: 'prabal', x: 14, y: 55 }, { id: 'bittu', x: 26, y: 54 }, { id: 'plant', x: 52, y: 55 }],
        starter: { bittu: [['flag']] } }
    ],
    example: [
      { arjun: [['flag'], ['mood', 1], ['say', 'kyaKaroon'], ['send', 0], ['wait', 5], ['wait', 2], ['mood', 0], ['say', 'manunga']],
        krishna: [['msg', 0], ['say', 'karm'], ['say', 'phal'], ['wait', 4], ['next']] },
      { bittu: [['flag'], ['right', 3], ['say', 'paani'], ['jump'], ['send', 0], ['wait', 3], ['say', 'chhodo']],
        plant: [['msg', 0], ['grow', 1], ['wait', 2], ['grow', 2], ['finish']],
        prabal: [['flag'], ['wait', 5], ['say', 'kab']] }
    ],
    challenges: [
      { goal: 'श्री कृष्ण से गीता की सीख बुलवाओ', scene: 0, steps: { krishna: [['flag'], ['say', 'karm']] } },
      { goal: 'बिट्टू को पौधे के पास ले जाकर पानी दिलवाओ', scene: 1, steps: { bittu: [['flag'], ['right', 3], ['say', 'paani']] } },
      { goal: 'पौधे को धीरे-धीरे बड़ा करो', scene: 1, steps: { plant: [['flag'], ['grow', 3]] } }
    ]
  });

  /* 7 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'man-santulit', section: 'gita',
    title: 'मन को संतुलित रखो', titleEn: 'Keep the Mind Balanced',
    value: 'शांत मन',
    lesson: 'शाबाश! हम हर हाल में मन शांत रखेंगे।',
    source: 'श्रीमद्भगवद्गीता 2.14, 2.48, 6.34, 6.35',
    narration: 'श्री कृष्ण ने अर्जुन से कहा: सुख और दुख, सर्दी और गर्मी की तरह आते-जाते हैं, इन्हें धीरज से सहो। जीत हो या हार, मन को एक जैसा रखना ही योग है। अर्जुन बोले, मन तो बहुत चंचल है। श्री कृष्ण ने कहा, अभ्यास से मन शांत होता है। बिट्टू और प्रबल ने भी सीखा: हमें अपने मन को संतुलित रखना है, इसमें हमारा आत्मविकास समाया है।',
    phrases: {
      aate:     { icon: 'sun',      text: 'सुख-दुख आते-जाते हैं, धीरज रखो' },          // 2.14
      samatva:  { icon: 'flower',   text: 'जीत हो या हार, मन को एक जैसा रखो' },        // 2.48
      abhyas:   { icon: 'star',     text: 'अभ्यास से मन शांत होता है' },                  // 6.35
      chanchal: { icon: 'waves',    text: 'हे कृष्ण, मन बहुत चंचल है' },                 // 6.34
      toot:     { icon: 'question', text: 'मेरा खिलौना टूट गया!' },
      haan:     { icon: 'sun',      text: 'हाँ, अब मैं शांत हूँ' },
      shant:    { icon: 'flower',   text: 'शांत रहो, हम फिर से बनाएँगे' },
      mantra:   { icon: 'heart',    text: 'हमें अपने मन को संतुलित रखना है' }
    },
    characters: merge({
      krishna: { name: 'श्री कृष्ण', sprite: 'krishna', phrases: ['aate', 'samatva', 'abhyas'] },
      arjun:   { name: 'अर्जुन', sprite: 'arjun', phrases: ['chanchal'] }
    }, kids(['shant', 'mantra'], ['toot', 'haan'])),
    scenes: [
      { id: 'kurukshetra', title: 'कुरुक्षेत्र', background: 'kurukshetra', facts: KURU_FACTS, places: GROUND,
        cast: [{ id: 'krishna', x: 58, y: 54 }, { id: 'arjun', x: 75, y: 55, face: -1 }],
        starter: { arjun: [['flag']] } },
      { id: 'bagicha', title: 'बिट्टू-प्रबल का बगीचा', background: 'garden', facts: GARDEN_FACTS, places: GROUND,
        cast: [{ id: 'bittu', x: 38, y: 54 }, { id: 'prabal', x: 56, y: 55, face: -1 }],
        starter: { prabal: [['flag']] } }
    ],
    example: [
      { arjun: [['flag'], ['mood', 1], ['say', 'chanchal'], ['send', 0]],
        krishna: [['msg', 0], ['mood', 2], ['say', 'aate'], ['say', 'samatva'], ['say', 'abhyas'], ['next']] },
      { prabal: [['flag'], ['mood', 1], ['say', 'toot'], ['send', 0], ['wait', 5], ['wait', 3], ['mood', 2], ['say', 'haan']],
        bittu: [['msg', 0], ['right', 2], ['say', 'shant'], ['mood', 2], ['say', 'mantra'], ['wait', 4], ['finish']] }
    ],
    challenges: [
      { goal: 'अर्जुन से कहलवाओ कि मन चंचल है', scene: 0, steps: { arjun: [['flag'], ['say', 'chanchal']] } },
      { goal: 'प्रबल का उदास चेहरा थोड़ी देर बाद शांत करो', scene: 1, steps: { prabal: [['flag'], ['mood', 1], ['wait', 2], ['mood', 2]] } },
      { goal: 'बिट्टू से मन का मंत्र बुलवाओ', scene: 1, steps: { bittu: [['flag'], ['say', 'mantra']] } }
    ]
  });

  /* 8 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'utho', section: 'gita',
    title: 'उठो, साहस करो', titleEn: 'Stand Up, Be Brave',
    value: 'साहस',
    lesson: 'शाबाश! डर लगे तब भी हम उठेंगे और कोशिश करेंगे।',
    source: 'श्रीमद्भगवद्गीता 1.29–30, 1.47, 2.3, 18.66, 18.73',
    narration: 'कुरुक्षेत्र में अर्जुन बहुत दुखी हो गए। बोले, मेरा मन घबरा रहा है, और रथ में बैठ गए। श्री कृष्ण ने कहा: मन की कमज़ोरी छोड़ो, उठो! अर्जुन ने पूरी गीता सुनी। अंत में बोले: मेरा मोह दूर हो गया, मैं आपकी बात मानूँगा। बिट्टू ने भी डरे हुए प्रबल से कहा: उठो, तुम कर सकते हो!',
    phrases: {
      ghabra:   { icon: 'waves',    text: 'मेरा मन घबरा रहा है' },                           // 1.29–30
      moh:      { icon: 'sun',      text: 'मेरा मोह दूर हुआ, मैं आपकी बात मानूँगा' },       // 18.73
      utho:     { icon: 'star',     text: 'मन की कमज़ोरी छोड़ो, उठो!' },                     // 2.3
      chinta:   { icon: 'heart',    text: 'चिंता मत करो' },                                   // 18.66
      dar:      { icon: 'question', text: 'मुझे डर लग रहा है' },
      kar:      { icon: 'star',     text: 'मैं कर सकता हूँ!' },
      uthoP:    { icon: 'sun',      text: 'उठो प्रबल, तुम कर सकते हो!' }
    },
    characters: merge({
      krishna: { name: 'श्री कृष्ण', sprite: 'krishna', phrases: ['utho', 'chinta'] },
      arjun:   { name: 'अर्जुन', sprite: 'arjun', phrases: ['ghabra', 'moh'] }
    }, kids(['uthoP'], ['dar', 'kar'])),
    scenes: [
      { id: 'kurukshetra', title: 'कुरुक्षेत्र', background: 'kurukshetra',
        facts: KURU_FACTS.concat(['Overcome with sorrow, Arjun set down his bow and sat in the chariot (1.47). Here he starts sad.']),
        places: GROUND,
        cast: [{ id: 'arjun', x: 46, y: 53, mood: 1 }, { id: 'krishna', x: 64, y: 55, face: -1 }],
        starter: { krishna: [['flag']] } },
      { id: 'bagicha', title: 'बिट्टू-प्रबल का बगीचा', background: 'garden', facts: GARDEN_FACTS, places: GROUND,
        cast: [{ id: 'prabal', x: 30, y: 55, mood: 1 }, { id: 'bittu', x: 56, y: 54, face: -1 }],
        starter: { prabal: [['flag']] } }
    ],
    example: [
      { arjun: [['flag'], ['say', 'ghabra'], ['send', 0], ['wait', 5], ['wait', 3], ['mood', 0], ['jump', 2], ['say', 'moh'], ['next']],
        krishna: [['msg', 0], ['say', 'utho'], ['say', 'chinta']] },
      { prabal: [['flag'], ['say', 'dar'], ['send', 0], ['wait', 5], ['wait', 3], ['mood', 0], ['jump', 3], ['say', 'kar'], ['finish']],
        bittu: [['msg', 0], ['left', 3], ['say', 'uthoP']] }
    ],
    challenges: [
      { goal: 'श्री कृष्ण से अर्जुन को "उठो" कहलवाओ', scene: 0, steps: { krishna: [['flag'], ['say', 'utho']] } },
      { goal: 'अर्जुन को खुश करके उठाओ: चेहरा खुश, फिर कूदो', scene: 0, steps: { arjun: [['flag'], ['mood', 0], ['jump', 1]] } },
      { goal: 'प्रबल से कहलवाओ "मैं कर सकता हूँ!"', scene: 1, steps: { prabal: [['flag'], ['say', 'kar']] } }
    ]
  });
})(window.KathaCode = window.KathaCode || {});
