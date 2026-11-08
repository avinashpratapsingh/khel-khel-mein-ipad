/* Katha Code — Upanishad kits (3): Katha and Chandogya Upanishads.
   Lines are simple Hindi renderings of what each person says in the text. */
(function (KC) {
  'use strict';
  var GROUND = { ground: { x0: 3, x1: 97, y0: 49, y1: 59 } };

  /* 9 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'nachiketa', section: 'upanishad',
    title: 'नचिकेता और यमराज', titleEn: 'Nachiketa and Yama',
    value: 'सच्चे सवाल पूछना',
    lesson: 'शाबाश! हम सच्चे सवाल पूछेंगे और अच्छाई चुनेंगे।',
    source: 'कठोपनिषद् 1.1.9–1.2.9 (Katha Upanishad)',
    narration: 'छोटा बालक नचिकेता यमराज के द्वार पर पहुँचा। यमराज घर पर नहीं थे, तो नचिकेता ने तीन रातें धीरज से प्रतीक्षा की। यमराज लौटे और बोले, तुमने तीन रातें प्रतीक्षा की, तीन वर माँगो। नचिकेता ने पहले वर में माँगा कि पिता उससे प्रसन्न हों। यमराज ने धन-दौलत का लालच दिया, पर नचिकेता ने सच्चा ज्ञान ही चुना।',
    phrases: {
      pratiksha: { icon: 'moon',   text: 'मैं यमराज की प्रतीक्षा करूँगा' },
      pita:      { icon: 'heart',  text: 'पहला वर: मेरे पिता मुझसे प्रसन्न हों' },        // 1.1.10
      gyan:      { icon: 'scroll', text: 'मुझे धन नहीं, सच्चा ज्ञान चाहिए' },             // 1.1.26–27
      teenVar:   { icon: 'star',   text: 'तुमने तीन रातें प्रतीक्षा की, तीन वर माँगो' },   // 1.1.9
      shreya:    { icon: 'flame',  text: 'केवल प्रिय नहीं, श्रेय चुनो' },                 // 1.2.1–2
      jigyasu:   { icon: 'sun',    text: 'नचिकेता, तुम सच्चे जिज्ञासु हो' }               // 1.2.9
    },
    characters: {
      nachiketa: { name: 'नचिकेता', sprite: 'nachiketa', size: 0.78, phrases: ['pratiksha', 'pita', 'gyan'] },
      yama:      { name: 'यमराज', sprite: 'yama', phrases: ['teenVar', 'shreya', 'jigyasu'] }
    },
    scenes: [
      { id: 'dwar', title: 'यमराज का द्वार', background: 'yamaDoor',
        facts: [
          'Nachiketa reached Yama\'s abode and waited three nights without food, because Yama was away (1.1.9).',
          'When Yama returned he honoured his guest and offered him three boons. Here Yama starts away and "appears" on his return.'
        ],
        places: GROUND,
        cast: [{ id: 'nachiketa', x: 26, y: 55 }, { id: 'yama', x: 76, y: 53, hidden: true, canShow: true, face: -1 }],
        starter: { nachiketa: [['flag']] } },
      { id: 'updesh', title: 'यमराज का उपदेश', background: 'yamaDoor',
        facts: [
          'First boon: that his father be calm and pleased with him. Second: knowledge of the sacred fire. Third: the truth of the Self (1.1.10–20).',
          'Yama offered wealth and long life instead; Nachiketa refused, choosing the good (shreya) over the pleasant (preya) (1.2.1–2).',
          'Yama praised him as a true seeker (1.2.9).'
        ],
        places: GROUND,
        cast: [{ id: 'nachiketa', x: 40, y: 55 }, { id: 'yama', x: 62, y: 53, face: -1 }],
        starter: { nachiketa: [['flag']] } }
    ],
    example: [
      { nachiketa: [['flag'], ['say', 'pratiksha'], ['mood', 2], ['wait', 5], ['wait', 5], ['wait', 5], ['send', 0]],
        yama: [['msg', 0], ['show'], ['left', 3], ['say', 'teenVar'], ['next']] },
      { nachiketa: [['flag'], ['say', 'pita'], ['wait', 2], ['say', 'gyan'], ['send', 0]],
        yama: [['msg', 0], ['say', 'shreya'], ['mood', 0], ['say', 'jigyasu'], ['finish']] }
    ],
    challenges: [
      { goal: 'नचिकेता को शांत मन से प्रतीक्षा करवाओ', scene: 0, steps: { nachiketa: [['flag'], ['mood', 2], ['wait', 5]] } },
      { goal: 'यमराज को लौटाओ और उनसे तीन वर दिलवाओ', scene: 0, steps: { yama: [['flag'], ['show'], ['say', 'teenVar']] } },
      { goal: 'नचिकेता से धन नहीं, सच्चा ज्ञान माँगो', scene: 1, steps: { nachiketa: [['flag'], ['say', 'gyan']] } }
    ]
  });

  /* 10 ────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'satyakam', section: 'upanishad',
    title: 'सत्यकाम जाबाल', titleEn: 'Satyakama Jabala',
    value: 'सच बोलना',
    lesson: 'शाबाश! हम हमेशा सच बोलेंगे।',
    source: 'छान्दोग्य उपनिषद् 4.4 (Chandogya Upanishad)',
    narration: 'सत्यकाम पढ़ना चाहता था। उसने माँ जबाला से पूछा, मेरा गोत्र क्या है? माँ ने सच कहा, मुझे नहीं पता। मेरा नाम जबाला है, तुम्हारा सत्यकाम, तो तुम सत्यकाम जाबाल हो। ऋषि गौतम के पास जाकर सत्यकाम ने बिल्कुल यही सच बताया। ऋषि प्रसन्न होकर बोले, तुमने सच बोला, मैं तुम्हें शिष्य बनाऊँगा। जाओ, समिधा ले आओ।',
    phrases: {
      gotra:    { icon: 'question', text: 'माँ, मेरा गोत्र क्या है?' },
      sach:     { icon: 'heart',    text: 'मैं नहीं जानता। मैं सत्यकाम जाबाल हूँ' },
      nahiPata: { icon: 'heart',    text: 'मुझे नहीं पता, बेटा' },
      naam:     { icon: 'home',     text: 'मेरा नाम जबाला है, तुम सत्यकाम जाबाल हो' },
      kaun:     { icon: 'question', text: 'बेटा, तुम्हारा गोत्र क्या है?' },
      tumne:    { icon: 'sun',      text: 'तुमने सच बोला, मैं तुम्हें शिष्य बनाऊँगा' },
      samidha:  { icon: 'tree',     text: 'जाओ, समिधा ले आओ' }
    },
    characters: {
      satyakam: { name: 'सत्यकाम', sprite: 'satyakam', size: 0.82, phrases: ['gotra', 'sach'] },
      jabala:   { name: 'माँ जबाला', sprite: 'jabala', phrases: ['nahiPata', 'naam'] },
      gautama:  { name: 'ऋषि गौतम', sprite: 'gautama', phrases: ['kaun', 'tumne', 'samidha'] }
    },
    scenes: [
      { id: 'ghar', title: 'घर पर', background: 'villageHome',
        facts: [
          'Young Satyakama wished to become a student and asked his mother Jabala about his lineage (gotra) (4.4.1).',
          'She told him honestly that she did not know, and that he should call himself Satyakama Jabala (4.4.2).'
        ],
        places: GROUND,
        cast: [{ id: 'satyakam', x: 34, y: 55 }, { id: 'jabala', x: 54, y: 54, face: -1 }],
        starter: { satyakam: [['flag']] } },
      { id: 'ashram', title: 'ऋषि गौतम का आश्रम', background: 'gautamaAshram',
        facts: [
          'He went to the sage Gautama (Haridrumata) and repeated exactly what his mother had said (4.4.3–4).',
          'Gautama accepted him because he spoke the truth, and asked him to bring fuel-sticks (samidha) (4.4.5).',
          'Later Gautama sent him to tend 400 cows, which he looked after until they became a thousand.'
        ],
        places: GROUND,
        cast: [{ id: 'satyakam', x: 18, y: 55 }, { id: 'gautama', x: 68, y: 54, face: -1 }],
        starter: { satyakam: [['flag']] } }
    ],
    example: [
      { satyakam: [['flag'], ['right', 1], ['say', 'gotra'], ['send', 0]],
        jabala: [['msg', 0], ['say', 'nahiPata'], ['say', 'naam'], ['wait', 2], ['next']] },
      { gautama: [['flag'], ['say', 'kaun'], ['send', 0], ['wait', 5], ['wait', 3], ['mood', 0], ['say', 'tumne'], ['say', 'samidha'], ['finish']],
        satyakam: [['msg', 0], ['right', 3], ['say', 'sach']] }
    ],
    challenges: [
      { goal: 'सत्यकाम से माँ से गोत्र पूछवाओ', scene: 0, steps: { satyakam: [['flag'], ['say', 'gotra']] } },
      { goal: 'माँ जबाला से सच-सच जवाब दिलवाओ', scene: 0, steps: { jabala: [['flag'], ['say', 'nahiPata']] } },
      { goal: 'ऋषि गौतम के पास जाकर सच बोलो', scene: 1, steps: { satyakam: [['flag'], ['right', 3], ['say', 'sach']] } }
    ]
  });

  /* 11 ────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'namak', section: 'upanishad',
    title: 'नमक और पानी', titleEn: 'Salt in Water',
    value: 'जो दिखता नहीं, वह भी होता है',
    lesson: 'शाबाश! जो दिखता नहीं, वह भी हर जगह हो सकता है।',
    source: 'छान्दोग्य उपनिषद् 6.13 (Chandogya Upanishad)',
    narration: 'ऋषि उद्दालक ने अपने बेटे श्वेतकेतु से कहा: इस नमक को रात में पानी में डाल दो। सुबह नमक दिख ही नहीं रहा था! पिता बोले: ऊपर से चखो, बीच से चखो, नीचे से चखो। हर जगह पानी खारा था। नमक दिखता नहीं, पर हर जगह है। वैसे ही सत्य हर जगह है, तुम में भी। तत् त्वम् असि।',
    phrases: {
      daalo:    { icon: 'crystal',  text: 'इस नमक को पानी में डाल दो' },             // 6.13.1
      chakho:   { icon: 'drop',     text: 'ऊपर से, बीच से, नीचे से चखो' },            // 6.13.2
      tattvam:  { icon: 'om',       text: 'तत् त्वम् असि — वह तुम ही हो' },          // 6.13.3
      ji:       { icon: 'namaste',  text: 'जी पिताजी' },
      dikh:     { icon: 'question', text: 'पिताजी, नमक दिख नहीं रहा' },
      khara:    { icon: 'drop',     text: 'पानी हर जगह खारा है!' }
    },
    characters: {
      uddalaka:   { name: 'ऋषि उद्दालक', sprite: 'uddalaka', phrases: ['daalo', 'chakho', 'tattvam'] },
      shvetaketu: { name: 'श्वेतकेतु', sprite: 'shvetaketu', size: 0.85, phrases: ['ji', 'dikh', 'khara'] },
      // The salt dissolves (hides) in the water. Once dissolved, it cannot be made to appear again.
      salt:       { name: 'नमक', sprite: 'salt', size: 0.5, canHide: true, phrases: [] }
    },
    scenes: [
      { id: 'shaam', title: 'रात', background: 'courtyardNight',
        facts: ['Uddalaka Aruni asked his son Shvetaketu to put salt in water in the evening and bring it in the morning (6.13.1).'],
        places: GROUND,
        cast: [{ id: 'uddalaka', x: 14, y: 54 }, { id: 'shvetaketu', x: 30, y: 55 }, { id: 'salt', x: 44, y: 55 }],
        starter: { uddalaka: [['flag']] } },
      { id: 'subah', title: 'सुबह', background: 'courtyardMorning',
        facts: [
          'In the morning the salt could not be seen, yet it had not gone away (6.13.1).',
          'Uddalaka had him sip from the top, the middle and the bottom; each time it was salty (6.13.2).',
          'He taught: as the salt is everywhere in the water though unseen, the subtle truth is in everything; tat tvam asi, you are that (6.13.3).'
        ],
        places: GROUND,
        cast: [{ id: 'uddalaka', x: 14, y: 54 }, { id: 'shvetaketu', x: 40, y: 55 },
               { id: 'salt', x: 64, y: 52, hidden: true, canHide: false, canShow: false }],
        starter: { shvetaketu: [['flag']] } }
    ],
    example: [
      { uddalaka: [['flag'], ['say', 'daalo'], ['send', 0]],
        shvetaketu: [['msg', 0], ['say', 'ji'], ['send', 1]],
        salt: [['msg', 1], ['right', 3], ['hide'], ['wait', 2], ['next']] },
      { uddalaka: [['flag'], ['say', 'chakho'], ['wait', 5], ['wait', 5], ['wait', 3], ['say', 'tattvam'], ['finish']],
        shvetaketu: [['flag'], ['wait', 3], ['right', 3], ['say', 'dikh'], ['up', 1], ['down', 2], ['say', 'khara']] }
    ],
    challenges: [
      { goal: 'नमक को पानी के घड़े तक ले चलो और घोल दो', scene: 0, steps: { salt: [['flag'], ['right', 3], ['hide']] } },
      { goal: 'सुबह श्वेतकेतु को घड़े तक ले जाकर कहलवाओ कि नमक दिख नहीं रहा', scene: 1, steps: { shvetaketu: [['flag'], ['right', 3], ['say', 'dikh']] } },
      { goal: 'ऋषि उद्दालक से "तत् त्वम् असि" बुलवाओ', scene: 1, steps: { uddalaka: [['flag'], ['say', 'tattvam']] } }
    ]
  });
})(window.KathaCode = window.KathaCode || {});
