/* Katha Code — Ramayan kits (5). Main source: Valmiki Ramayana.
   Anything from later or folk tradition is labelled in `source` and `facts`. */
(function (KC) {
  'use strict';
  var GROUND = { ground: { x0: 3, x1: 97, y0: 49, y1: 59 } };

  /* 1 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'vanvas', section: 'ramayan',
    title: 'राम का वनवास', titleEn: "Ram's Exile",
    value: 'वचन निभाना',
    lesson: 'शाबाश! हम भी अपना वचन निभाएँगे।',
    source: 'वाल्मीकि रामायण, अयोध्याकाण्ड (Valmiki Ramayana, Ayodhya Kanda)',
    narration: 'राजा दशरथ ने रानी कैकेयी को दो वर देने का वचन दिया था। कैकेयी ने माँगा कि श्री राम चौदह वर्ष वन में रहें। पिता का वचन निभाने के लिए श्री राम शांत मन से वन जाने को तैयार हो गए। सीता माता और लक्ष्मण भी उनके साथ चल पड़े, और चित्रकूट के वन में कुटिया बनाकर रहे।',
    phrases: {
      vachan:   { icon: 'scroll', text: 'पिताजी का वचन मैं ज़रूर निभाऊँगा' },
      chaudah:  { icon: 'tree',   text: 'मैं चौदह वर्ष वन में रहूँगा' },
      sundar:   { icon: 'sun',    text: 'देखो सीता, चित्रकूट कितना सुंदर है' },
      sitaSaath:{ icon: 'heart',  text: 'मैं भी आपके साथ वन चलूँगी' },
      lakSaath: { icon: 'heart',  text: 'भैया, मैं भी आपके साथ चलूँगा' },
      kutiya:   { icon: 'home',   text: 'मैं यहाँ कुटिया बनाता हूँ' }
    },
    characters: {
      ram:      { name: 'श्री राम', sprite: 'ram', phrases: ['vachan', 'chaudah', 'sundar'] },
      sita:     { name: 'सीता माता', sprite: 'sita', phrases: ['sitaSaath'] },
      lakshman: { name: 'लक्ष्मण', sprite: 'lakshman', phrases: ['lakSaath', 'kutiya'] }
    },
    scenes: [
      { id: 'mahal', title: 'अयोध्या का महल', background: 'ayodhyaPalace',
        facts: [
          'King Dasharatha had once promised Queen Kaikeyi two boons; she asked for Bharat to be crowned and for Ram to live 14 years in the forest.',
          'Ram accepted calmly, to keep his father\'s word.',
          'Sita insisted on going with Ram; Lakshman also chose to go and serve them.'
        ],
        places: GROUND,
        cast: [{ id: 'ram', x: 50, y: 54 }, { id: 'sita', x: 70, y: 55 }, { id: 'lakshman', x: 30, y: 54 }],
        starter: { ram: [['flag']] } },
      { id: 'chitrakoot', title: 'चित्रकूट का वन', background: 'forestHut',
        facts: [
          'In the forest Ram and Lakshman wore bark cloth (valkala) and matted hair (jata).',
          'At Chitrakoot, Lakshman built a hut of leaves and wood, and Ram showed Sita the beauty of the mountain.'
        ],
        places: GROUND,
        cast: [{ id: 'ram', sprite: 'ramVan', x: 35, y: 54 }, { id: 'sita', x: 55, y: 55 }, { id: 'lakshman', sprite: 'lakshmanVan', x: 18, y: 54 }],
        starter: { lakshman: [['flag']] } }
    ],
    example: [
      { ram: [['flag'], ['say', 'vachan'], ['say', 'chaudah'], ['send', 0]],
        sita: [['msg', 0], ['left', 2], ['say', 'sitaSaath'], ['send', 1]],
        lakshman: [['msg', 1], ['right', 2], ['say', 'lakSaath'], ['next']] },
      { lakshman: [['flag'], ['right', 5], ['say', 'kutiya'], ['jump', 2]],
        ram: [['flag'], ['wait', 4], ['say', 'sundar'], ['send', 0]],
        sita: [['msg', 0], ['mood', 0], ['jump'], ['finish']] }
    ],
    challenges: [
      { goal: 'श्री राम से कहलवाओ कि वे पिताजी का वचन निभाएँगे', scene: 0, steps: { ram: [['flag'], ['say', 'vachan']] } },
      { goal: 'सीता माता को श्री राम के पास ले चलो, और कहलवाओ कि वे भी साथ चलेंगी', scene: 0, steps: { sita: [['flag'], ['left', 2], ['say', 'sitaSaath']] } },
      { goal: 'चित्रकूट में लक्ष्मण से कुटिया बनवाओ', scene: 1, steps: { lakshman: [['flag'], ['right', 5], ['say', 'kutiya']] } }
    ]
  });

  /* 2 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'swarna-mrig', section: 'ramayan',
    title: 'सोने का हिरण', titleEn: 'The Golden Deer',
    value: 'सोच-समझकर चुनना',
    lesson: 'शाबाश! हम अच्छी सलाह ध्यान से सुनेंगे।',
    source: 'वाल्मीकि रामायण, अरण्यकाण्ड (Valmiki Ramayana, Aranya Kanda)',
    narration: 'पंचवटी में एक दिन सीता माता ने एक सोने का हिरण देखा, जिस पर चाँदी जैसे धब्बे थे। सीता माता ने श्री राम से वह हिरण लाने को कहा। लक्ष्मण बोले, भैया, यह मारीच की माया लगती है। श्री राम ने लक्ष्मण से सीता की रक्षा करने को कहा और हिरण के पीछे वन में चले गए। हिरण कभी दिखता, कभी छिप जाता।',
    phrases: {
      sundar:   { icon: 'star',     text: 'कितना सुंदर सोने का हिरण!' },
      lao:      { icon: 'heart',    text: 'वह हिरण मेरे लिए ले आइए' },
      maya:     { icon: 'question', text: 'भैया, यह मारीच की माया लगती है' },
      raksha:   { icon: 'home',     text: 'लक्ष्मण, सीता की रक्षा करना' },
      jaata:    { icon: 'tree',     text: 'मैं हिरण के पीछे जाता हूँ' },
      karunga:  { icon: 'home',     text: 'मैं सीता माता की रक्षा करूँगा' }
    },
    characters: {
      ram:      { name: 'श्री राम', sprite: 'ramVan', phrases: ['raksha', 'jaata'] },
      sita:     { name: 'सीता माता', sprite: 'sita', phrases: ['sundar', 'lao'] },
      lakshman: { name: 'लक्ष्मण', sprite: 'lakshmanVan', phrases: ['maya', 'karunga'] },
      // Maricha in disguise: he could vanish and appear again (his illusion). He does not speak here.
      deer:     { name: 'सोने का हिरण', sprite: 'deer', size: 0.85, canHide: true, phrases: [] }
    },
    scenes: [
      { id: 'panchavati', title: 'पंचवटी', background: 'forestHut',
        facts: [
          'At Panchavati, the demon Maricha took the form of a golden deer with silver spots, to lure Ram away.',
          'Sita saw it and asked Ram to bring it to her.',
          'Lakshman warned that it was Maricha\'s illusion.',
          'Ram went after it, asking Lakshman to guard Sita.'
        ],
        places: GROUND,
        cast: [{ id: 'ram', x: 30, y: 54 }, { id: 'sita', x: 47, y: 55 }, { id: 'lakshman', x: 14, y: 54 }, { id: 'deer', x: 88, y: 53 }],
        starter: { sita: [['flag']] } },
      { id: 'gehra-van', title: 'घना वन', background: 'deepForest',
        facts: [
          'The deer led Ram far into the forest, vanishing and appearing again.',
          'What happened next (the cry and the abduction of Sita) is not shown in this kit.'
        ],
        places: GROUND,
        cast: [{ id: 'ram', x: 15, y: 55 }, { id: 'deer', x: 55, y: 53 }],
        starter: { deer: [['flag']] } }
    ],
    example: [
      { deer: [['flag'], ['jump', 2], ['left', 1], ['jump']],
        sita: [['flag'], ['wait', 2], ['say', 'sundar'], ['say', 'lao'], ['send', 0]],
        lakshman: [['msg', 0], ['say', 'maya'], ['send', 1]],
        ram: [['msg', 1], ['say', 'raksha'], ['say', 'jaata'], ['right', 5], ['next']] },
      { deer: [['flag'], ['right', 3], ['hide'], ['wait', 2], ['show'], ['right', 3], ['hide']],
        ram: [['flag'], ['wait', 2], ['right', 5], ['right', 3], ['mood', 2]] }
    ],
    challenges: [
      { goal: 'सीता माता से सोने का हिरण दिखाओ', scene: 0, steps: { sita: [['flag'], ['say', 'sundar']] } },
      { goal: 'लक्ष्मण से श्री राम को सावधान करवाओ', scene: 0, steps: { lakshman: [['flag'], ['say', 'maya']] } },
      { goal: 'हिरण को घने वन में दौड़ाकर छिपा दो', scene: 1, steps: { deer: [['flag'], ['right', 3], ['hide']] } }
    ]
  });

  /* 3 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'hanuman-leap', section: 'ramayan',
    title: 'हनुमान की छलांग', titleEn: "Hanuman's Leap",
    value: 'साहस और भक्ति',
    lesson: 'शाबाश! साहस और भक्ति से हम बड़ा काम कर सकते हैं।',
    source: 'वाल्मीकि रामायण, सुन्दरकाण्ड (Valmiki Ramayana, Sundara Kanda)',
    narration: 'सीता माता को खोजने हनुमान जी महेंद्र पर्वत पर पहुँचे। सामने विशाल समुद्र था। हनुमान जी ने श्री राम का नाम लिया, अपना शरीर बहुत बड़ा किया, और आकाश में उड़कर लंका पहुँच गए। अशोक वाटिका में उन्होंने सीता माता को श्री राम की अंगूठी दी, और कहा कि श्री राम जल्दी आएँगे।',
    phrases: {
      doot:      { icon: 'heart',   text: 'मैं श्री राम का दूत हूँ' },
      sagar:     { icon: 'waves',   text: 'मैं समुद्र पार करूँगा' },
      jai:       { icon: 'namaste', text: 'जय श्री राम' },
      mudrika:   { icon: 'ring',    text: 'माता, यह श्री राम की अंगूठी है' },
      aayenge:   { icon: 'sun',     text: 'श्री राम जल्दी आएँगे' },
      shriRam:   { icon: 'sun',     text: 'श्री राम' },
      ashirvad:  { icon: 'flower',  text: 'पुत्र, तुम्हें मेरा आशीर्वाद' },
      chudamani: { icon: 'gem',     text: 'यह चूड़ामणि श्री राम को देना' }
    },
    characters: {
      // Crossed the ocean through the sky; grew huge to leap; became small to enter Lanka; hid in the Shimshapa tree.
      hanuman: { name: 'हनुमान', sprite: 'hanuman', canFly: true, canChangeSize: true, canHide: true,
                 phrases: ['doot', 'sagar', 'jai', 'mudrika', 'aayenge'] },
      sita:    { name: 'सीता माता', sprite: 'sita', phrases: ['shriRam', 'ashirvad', 'chudamani'] }
    },
    scenes: [
      { id: 'leap', title: 'समुद्र पार', background: 'lankaShore',
        facts: [
          'Hanuman leapt across the ocean to Lanka from Mount Mahendra, on the mainland shore.',
          'He crossed the ocean by flying through the sky, not by walking or swimming.',
          'Before leaping he grew to a huge size; to enter Lanka unseen he became small.',
          'Sita was held in Ashok Vatika in Lanka and did not leave Lanka until Ravan was defeated.'
        ],
        places: { mainland: { x0: 3, x1: 28, y0: 49, y1: 59 }, lanka: { x0: 70, x1: 97, y0: 49, y1: 59 } },
        cast: [{ id: 'hanuman', x: 15, y: 54, places: ['mainland', 'lanka'] }, { id: 'sita', x: 87, y: 54, places: ['lanka'] }],
        starter: { hanuman: [['flag']] } },
      { id: 'vatika', title: 'अशोक वाटिका', background: 'ashokVatika',
        facts: [
          'In Ashok Vatika, Hanuman first hid in the leaves of a Shimshapa tree, above where Sita sat.',
          'He came down, said he was Shri Ram\'s messenger, and gave Sita Ram\'s ring.',
          'He told her Shri Ram would come for her.',
          'Sita blessed him and gave him her chudamani (hair jewel) to take to Ram.'
        ],
        places: { garden: { x0: 5, x1: 95, y0: 49, y1: 59 } },
        cast: [{ id: 'hanuman', x: 27, y: 54, air: 24, face: 1 }, { id: 'sita', x: 46, y: 55, face: -1 }],
        starter: { hanuman: [['flag']] } }
    ],
    example: [
      { hanuman: [['flag'], ['say', 'sagar'], ['grow', 2], ['fly', 5], ['shrink', 2], ['next']] },
      { hanuman: [['flag'], ['down', 5], ['right', 2], ['say', 'doot'], ['say', 'mudrika'], ['say', 'aayenge'], ['send', 0]],
        sita: [['msg', 0], ['mood', 0], ['say', 'ashirvad'], ['say', 'chudamani'], ['finish']] }
    ],
    challenges: [
      { goal: 'हनुमान जी को उड़ाकर समुद्र पार लंका पहुँचाओ', scene: 0, steps: { hanuman: [['flag'], ['fly', 5]] } },
      { goal: 'उड़ने से पहले हनुमान जी को बड़ा करो', scene: 0, steps: { hanuman: [['flag'], ['grow', 1], ['fly', 5]] } },
      { goal: 'पेड़ से नीचे आकर सीता माता को श्री राम की अंगूठी दो', scene: 1, steps: { hanuman: [['flag'], ['down', 5], ['right', 2], ['say', 'mudrika']] } }
    ]
  });

  /* 4 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'ram-setu', section: 'ramayan',
    title: 'राम सेतु और गिलहरी', titleEn: 'Ram Setu and the Squirrel',
    value: 'हर छोटी मदद कीमती है',
    lesson: 'शाबाश! हर छोटी मदद भी बड़ी होती है।',
    source: 'वाल्मीकि रामायण, युद्धकाण्ड (सेतु) · गिलहरी की कथा लोक-परंपरा से (Valmiki, Yuddha Kanda for the bridge; the squirrel is from folk tradition)',
    narration: 'श्री राम की वानर सेना ने नल के साथ मिलकर समुद्र पर सेतु बनाया। सब बड़े-बड़े पत्थर ला रहे थे। लोक-कथा कहती है कि एक छोटी गिलहरी भी रेत में लोटकर सेतु पर रेत डालती रही। श्री राम ने प्यार से उसकी पीठ सहलाई। छोटी मदद भी बड़ी होती है। फिर पूरी सेना सेतु पर चलकर लंका पहुँची।',
    phrases: {
      sab:      { icon: 'home',    text: 'आओ, सब मिलकर सेतु बनाएँ' },
      chhoti:   { icon: 'heart',   text: 'तुम्हारी छोटी मदद भी बड़ी है' },
      patthar:  { icon: 'crystal', text: 'मैं बड़ा पत्थर लाता हूँ' },
      jai:      { icon: 'namaste', text: 'जय श्री राम' },
      seva:     { icon: 'heart',   text: 'मैं भी सेवा करूँगी' }
    },
    characters: {
      ram:      { name: 'श्री राम', sprite: 'ramVan', phrases: ['sab', 'chhoti'] },
      hanuman:  { name: 'हनुमान', sprite: 'hanuman', canFly: true, canChangeSize: true, canHide: true, phrases: ['patthar', 'jai'] },
      squirrel: { name: 'गिलहरी', sprite: 'squirrel', size: 0.42, phrases: ['seva'] }
    },
    scenes: [
      { id: 'banna', title: 'सेतु बन रहा है', background: 'setuBuild',
        facts: [
          'Nala, with the vanara army, built the bridge (setu) across the ocean to Lanka (Valmiki, Yuddha Kanda).',
          'The vanaras carried rocks and trees to build it. Here the bridge is half built, so one can walk only as far as it goes.',
          'The squirrel rolling in sand to help, and Ram stroking its back, come from folk tradition, not Valmiki.'
        ],
        places: { mainland: { x0: 3, x1: 28, y0: 49, y1: 59 }, setu: { x0: 28, x1: 51, y0: 49, y1: 59 } },
        cast: [{ id: 'ram', x: 8, y: 54 }, { id: 'hanuman', x: 21, y: 54 }, { id: 'squirrel', x: 36, y: 55 }],
        starter: { squirrel: [['flag']] } },
      { id: 'paar', title: 'सेतु पूरा हुआ', background: 'setuDone',
        facts: ['With the setu complete, Ram and the army walked across the ocean to Lanka.'],
        places: { all: { x0: 3, x1: 97, y0: 49, y1: 59 } },
        cast: [{ id: 'ram', x: 8, y: 54 }, { id: 'hanuman', x: 20, y: 55 }, { id: 'squirrel', x: 31, y: 56 }],
        starter: { ram: [['flag']] } }
    ],
    example: [
      { hanuman: [['flag'], ['say', 'patthar'], ['right', 4], ['left', 4], ['repeat', 2]],
        squirrel: [['flag'], ['jump', 3], ['say', 'seva'], ['left', 4]],
        ram: [['touch'], ['say', 'chhoti'], ['wait', 2], ['next']] },
      { ram: [['flag'], ['say', 'sab'], ['right', 5], ['right', 5], ['finish']],
        hanuman: [['flag'], ['say', 'jai'], ['right', 5], ['right', 5]],
        squirrel: [['flag'], ['jump', 2], ['right', 5], ['right', 5]] }
    ],
    challenges: [
      { goal: 'गिलहरी से सेतु पर रेत डलवाओ: तीन बार कूदो', scene: 0, steps: { squirrel: [['flag'], ['jump', 3]] } },
      { goal: 'गिलहरी को श्री राम के पास ले चलो', scene: 0, steps: { squirrel: [['flag'], ['left', 4]] } },
      { goal: 'पूरे सेतु पर चलकर श्री राम को लंका पहुँचाओ', scene: 1, steps: { ram: [['flag'], ['right', 5], ['right', 5]] } }
    ]
  });

  /* 5 ─────────────────────────────────────────────────────────── */
  KC._defineKit({
    id: 'deepawali', section: 'ramayan',
    title: 'अयोध्या वापसी और दीपावली', titleEn: 'Return to Ayodhya',
    value: 'खुशी बाँटना',
    lesson: 'शाबाश! आओ, सब मिलकर खुशियों के दीये जलाएँ।',
    source: 'वाल्मीकि रामायण, युद्धकाण्ड · दीये जलाने की परंपरा (Valmiki, Yuddha Kanda; the lamps are the later Diwali tradition)',
    narration: 'चौदह वर्ष पूरे हुए। श्री राम, सीता माता और लक्ष्मण, हनुमान जी के साथ पुष्पक विमान में अयोध्या लौटे। भरत ने बड़े प्यार से श्री राम की पादुकाएँ उन्हें लौटाईं। फिर श्री राम का राज्याभिषेक हुआ। उसी खुशी की याद में हम आज भी दीपावली पर दीये जलाते हैं।',
    phrases: {
      bhai:     { icon: 'heart',   text: 'भरत, मेरे प्यारे भाई!' },
      praja:    { icon: 'sun',     text: 'सारी प्रजा सुखी रहे' },
      ghar:     { icon: 'home',    text: 'हम अपने घर अयोध्या लौट आए' },
      pranam:   { icon: 'namaste', text: 'भैया भरत, प्रणाम' },
      paduka:   { icon: 'paduka',  text: 'भैया, आपकी पादुकाएँ आपको लौटाता हूँ' },
      jai:      { icon: 'namaste', text: 'जय श्री राम' }
    },
    characters: {
      // On arrival the travellers are inside the Pushpak: they can step out (appear), but do not vanish.
      pushpak:  { name: 'पुष्पक विमान', sprite: 'pushpak', size: 1.5, canFly: true, phrases: [] },
      ram:      { name: 'श्री राम', sprite: 'ramVan', phrases: ['bhai', 'praja'] },
      sita:     { name: 'सीता माता', sprite: 'sita', phrases: ['ghar'] },
      lakshman: { name: 'लक्ष्मण', sprite: 'lakshmanVan', phrases: ['pranam'] },
      bharat:   { name: 'भरत', sprite: 'bharatVan', phrases: ['paduka'] },
      hanuman:  { name: 'हनुमान', sprite: 'hanuman', canFly: true, canChangeSize: true, phrases: ['jai'] }
    },
    scenes: [
      { id: 'nandigram', title: 'नंदीग्राम', background: 'ayodhyaOutskirts',
        facts: [
          'After Ravan\'s defeat, Ram, Sita and Lakshman flew back in the Pushpak vimana with Hanuman and others.',
          'Bharat had ruled from Nandigram, living simply in bark cloth, with Ram\'s padukas on the throne.',
          'Bharat met Ram and placed the padukas back on his feet.'
        ],
        places: GROUND,
        cast: [
          { id: 'pushpak', x: 22, y: 54, air: 24 },
          { id: 'bharat', x: 16, y: 55 },
          { id: 'ram', x: 70, y: 54, hidden: true, canShow: true },
          { id: 'sita', x: 80, y: 55, hidden: true, canShow: true },
          { id: 'lakshman', x: 61, y: 54, hidden: true, canShow: true },
          { id: 'hanuman', x: 90, y: 55, hidden: true, canShow: true }
        ],
        starter: { pushpak: [['flag']] } },
      { id: 'abhishek', title: 'राज्याभिषेक की रात', background: 'ayodhyaDiwali',
        facts: [
          'Ram was crowned king of Ayodhya and the people rejoiced.',
          'Lighting rows of lamps for his return is the Diwali tradition, which came later than Valmiki\'s text.',
          'Diwali falls on a new-moon night, so the sky has no moon.'
        ],
        places: GROUND,
        cast: [
          { id: 'ram', sprite: 'ramRaja', x: 50, y: 53 }, { id: 'sita', x: 62, y: 54 },
          { id: 'lakshman', sprite: 'lakshman', x: 37, y: 54 }, { id: 'hanuman', x: 80, y: 56 }
        ],
        starter: { ram: [['flag']] } }
    ],
    example: [
      { pushpak: [['flag'], ['fly', 4], ['send', 0]],
        ram: [['msg', 0], ['show'], ['wait', 5], ['say', 'bhai'], ['next']],
        sita: [['msg', 0], ['show'], ['say', 'ghar']],
        lakshman: [['msg', 0], ['show'], ['wait', 3], ['say', 'pranam']],
        hanuman: [['msg', 0], ['show'], ['jump', 2]],
        bharat: [['flag'], ['wait', 4], ['right', 5], ['right', 2], ['say', 'paduka']] },
      { ram: [['flag'], ['say', 'praja'], ['finish']],
        sita: [['flag'], ['mood', 0], ['jump']],
        hanuman: [['flag'], ['jai'], ['jump', 2]],
        lakshman: [['flag'], ['bell']] }
    ],
    challenges: [
      { goal: 'पुष्पक विमान को अयोध्या के पास उतारो', scene: 0, steps: { pushpak: [['flag'], ['fly', 4]] } },
      { goal: 'भरत को चलाकर पादुकाएँ लौटवाओ', scene: 0, steps: { bharat: [['flag'], ['right', 5], ['say', 'paduka']] } },
      { goal: 'राज्याभिषेक पर श्री राम से आशीर्वचन बुलवाओ और दीये जलाओ', scene: 1, steps: { ram: [['flag'], ['say', 'praja'], ['finish']] } }
    ]
  });
})(window.KathaCode = window.KathaCode || {});
