/* Katha Code — parents' area (opened by holding the lock for 3 seconds).
   Text is fine here: this screen is for adults. Labels are bilingual.
   Sections: voice & sounds · label language · record your own voice ·
             saved games · backup · story sources · reset. */
(function (KC) {
  'use strict';

  var MAX_REC_MS = 5000;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function label(hi, en) { return '<span class="kc-pa-hi">' + hi + '</span><span class="kc-pa-en">' + en + '</span>'; }

  function Parents(root, opts) {
    this.root = root;
    this.audio = opts.audio;
    this.store = opts.store;
    this.onChange = opts.onChange;     // (settings) after any settings change
    this.onClose = opts.onClose;
    this.el = el('div', 'kc-overlay kc-parents');
    this.el.hidden = true;
    root.appendChild(this.el);
  }

  Parents.prototype.show = function () { this.render(); this.el.hidden = false; this.el.scrollTop = 0; };
  Parents.prototype.hide = function () { this._stopRec(); this.el.hidden = true; };

  Parents.prototype._section = function (hi, en, id) {
    var s = el('section', 'kc-pa-sec');
    if (id) s.id = 'kc-pa-' + id;
    s.appendChild(el('h2', 'kc-pa-h', label(hi, en)));
    this.wrap.appendChild(s);
    return s;
  };

  Parents.prototype._toggle = function (parent, hi, en, on, fn) {
    var row = el('label', 'kc-pa-row');
    row.innerHTML = '<span class="kc-pa-text">' + label(hi, en) + '</span>';
    var sw = el('input');
    sw.type = 'checkbox'; sw.className = 'kc-pa-switch'; sw.checked = !!on;
    sw.addEventListener('change', function () { fn(sw.checked); });
    row.appendChild(sw);
    parent.appendChild(row);
    return sw;
  };

  Parents.prototype._set = function (key, value) {
    var s = this.store.settings();
    s[key] = value;
    this.store.saveSettings(s);
    this.onChange(s);
  };

  Parents.prototype.render = function () {
    var self = this, st = this.store.settings();
    this.el.innerHTML = '';
    var bar = el('div', 'kc-pa-bar');
    bar.appendChild(el('div', 'kc-pa-title', label('बड़ों के लिए', 'For parents')));
    var close = el('button', 'kc-pa-close', 'बंद करें · Close');
    close.addEventListener('click', function () { self.hide(); self.onClose(); });
    bar.appendChild(close);
    this.el.appendChild(bar);
    this.wrap = el('div', 'kc-pa-wrap');
    this.el.appendChild(this.wrap);

    /* 1. voice and sounds */
    var s1 = this._section('आवाज़', 'Voice and sounds');
    this._toggle(s1, 'हिन्दी में बोलकर बताना', 'Spoken Hindi (names, story lines, narration)', st.voice, function (v) { self._set('voice', v); });
    this._toggle(s1, 'खेल की आवाज़ें', 'Sound effects and music', st.sounds, function (v) { self._set('sounds', v); });

    /* 2. label language */
    var s2 = this._section('लिखे हुए नाम', 'Written labels');
    s2.appendChild(el('p', 'kc-pa-note', 'बच्चे हमेशा हिन्दी सुनेंगे। यह केवल लिखे नामों की भाषा बदलता है। · Children always hear Hindi. This only changes written titles and block names.'));
    var seg = el('div', 'kc-pa-seg');
    [['hi', 'हिन्दी'], ['en', 'English']].forEach(function (o) {
      var b = el('button', 'kc-pa-segbtn' + (st.lang === o[0] ? ' kc-on' : ''), o[1]);
      b.addEventListener('click', function () { self._set('lang', o[0]); self.render(); });
      seg.appendChild(b);
    });
    s2.appendChild(seg);

    /* 3. record your own voice */
    var s3 = this._section('अपनी आवाज़', 'Record your own voice', 'voice');
    s3.appendChild(el('p', 'kc-pa-note', 'तीन छोटी रिकॉर्डिंग (5 सेकंड तक) बनाइए, जैसे "शाबाश!" या अपनी आवाज़ में "जय श्री राम"। ये "आवाज़" वाले हरे डिब्बों में "मेरी आवाज़" बनकर आएँगी। इन्हें किसी पात्र के बोले शब्द नहीं दिखाया जाता। · Record up to three short clips. They appear as a "my voice" sound block; they are never shown as words spoken by a story character. Recordings stay on this device.'));
    this._toggle(s3, '"मेरी आवाज़" डिब्बा चालू करें', 'Turn on the "my voice" block', st.myVoice, function (v) { self._set('myVoice', v); self.render(); });
    if (st.myVoice) this._renderClips(s3);

    /* 4. saved games */
    var s4 = this._section('मेरे खेल', 'Saved games', 'games');
    var games = this.store.listGames();
    if (!games.length) s4.appendChild(el('p', 'kc-pa-note', 'अभी कोई खेल सहेजा नहीं गया है। · No saved games yet.'));
    games.forEach(function (g) {
      var p = self.store.loadGame(g.id);
      if (!p) return;
      var kit = KC._kits[g.kitId];
      var row = el('div', 'kc-pa-game');
      row.innerHTML = '<div class="kc-pa-thumb">' + KC._projectArt(p) + '</div>' +
        '<div class="kc-pa-text">' + label(kit.title, kit.titleEn + ' · ' + new Date(g.updatedAt).toLocaleString() + (g.finished ? ' · finished' : '')) + '</div>';
      var del = el('button', 'kc-pa-btn kc-pa-danger', 'मिटाएँ · Delete');
      var armed = null;
      del.addEventListener('click', function () {
        if (!armed) {
          del.textContent = 'पक्का? · Sure?';
          del.classList.add('kc-armed');
          armed = setTimeout(function () { armed = null; del.textContent = 'मिटाएँ · Delete'; del.classList.remove('kc-armed'); }, 3000);
          return;
        }
        clearTimeout(armed);
        self.store.deleteGame(g.id);
        self.render();
        var sec = self.el.querySelector('#kc-pa-games');
        if (sec) sec.scrollIntoView();
      });
      row.appendChild(del);
      s4.appendChild(row);
    });

    /* 5. backup */
    var s5 = this._section('बैकअप', 'Backup', 'backup');
    s5.appendChild(el('p', 'kc-pa-note', 'सारे खेल और सितारे एक फ़ाइल में सहेजें, और किसी दूसरे फ़ोन या टैबलेट पर लाएँ। · Save all games and stars to a file, and load them on another phone or tablet. Loading adds games; it never deletes any.'));
    var acts = el('div', 'kc-pa-acts');
    var save = el('button', 'kc-pa-btn kc-pa-primary', 'फ़ाइल सहेजें · Save file');
    var copy = el('button', 'kc-pa-btn', 'कॉपी करें · Copy text');
    var open = el('button', 'kc-pa-btn', 'फ़ाइल से लाएँ · Load file');
    var file = el('input'); file.type = 'file'; file.accept = '.json,application/json,text/plain'; file.hidden = true;
    acts.appendChild(save); acts.appendChild(copy); acts.appendChild(open); acts.appendChild(file);
    s5.appendChild(acts);
    var area = el('textarea', 'kc-pa-area');
    area.id = 'kc-pa-backup-text';
    area.setAttribute('aria-label', 'Backup text');
    area.placeholder = 'बैकअप का टेक्स्ट यहाँ चिपकाएँ · Paste backup text here';
    s5.appendChild(area);
    var load = el('button', 'kc-pa-btn', 'टेक्स्ट से लाएँ · Load pasted text');
    s5.appendChild(load);
    var msg = el('p', 'kc-pa-msg', '');
    s5.appendChild(msg);

    function backupText() { return JSON.stringify(self.store.exportAll()); }
    save.addEventListener('click', function () { self._saveFile(backupText(), msg, area); });
    copy.addEventListener('click', function () {
      var text = backupText();
      area.value = text;
      var ok = function () { msg.textContent = 'कॉपी हो गया · Copied. Paste it into a note or message to keep it.'; };
      var fallback = function () { area.focus(); area.select(); msg.textContent = 'टेक्स्ट चुन लिया गया है, कॉपी करें · The text is selected; copy it from the box.'; };
      try { navigator.clipboard.writeText(text).then(ok, fallback); } catch (e) { fallback(); }
    });
    open.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { self._import(String(r.result), msg); };
      r.onerror = function () { msg.textContent = 'फ़ाइल नहीं खुली · Could not read that file.'; };
      r.readAsText(f);
    });
    load.addEventListener('click', function () { self._import(area.value, msg); });

    /* 6. story sources */
    var s6 = this._section('कहानियों के स्रोत', 'Story sources and facts');
    s6.appendChild(el('p', 'kc-pa-note', 'हर कहानी किस ग्रंथ पर आधारित है, और खेल किन तथ्यों को नहीं बदल सकता। · What each story follows, and the facts the game logic keeps (who can fly, where land is, which lines each character may say).'));
    KC._kitOrder.forEach(function (id) {
      var kit = KC._kits[id];
      var d = el('details', 'kc-pa-src');
      var facts = '';
      kit.scenes.forEach(function (sc) {
        facts += '<h3>' + esc(sc.title) + '</h3><ul>' + sc.facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
      });
      var lines = '';
      Object.keys(kit.characters).forEach(function (cid) {
        var c = kit.characters[cid];
        if (!c.phrases || !c.phrases.length) return;
        lines += '<li><b>' + esc(c.name) + ':</b> ' + c.phrases.map(function (k) { return esc(kit.phrases[k].text); }).join(' · ') + '</li>';
      });
      d.innerHTML = '<summary>' + label(kit.title, kit.titleEn) + '</summary>' +
        '<p class="kc-pa-source">' + esc(kit.source) + '</p>' + facts +
        '<h3>पात्रों के शब्द · Lines characters can say</h3><ul>' + lines + '</ul>';
      s6.appendChild(d);
    });

    /* 7. reset */
    var s7 = this._section('सब मिटाएँ', 'Reset everything');
    s7.appendChild(el('p', 'kc-pa-note', 'सारे खेल, सितारे और रिकॉर्डिंग मिट जाएँगी। बटन को 3 सेकंड दबाकर रखें। · Deletes all games, stars and recordings. Press and hold for 3 seconds.'));
    var reset = el('button', 'kc-pa-btn kc-pa-danger kc-pa-reset', 'दबाकर रखें · Hold to reset');
    KC._holdButton(reset, 3000, function () {
      self.store.resetAll();
      self._set('myVoice', false);
      self.render();
      var m = el('p', 'kc-pa-msg', 'सब मिटा दिया गया · Everything was reset.');
      self.wrap.lastChild.appendChild(m);
      self.wrap.lastChild.scrollIntoView();
    });
    s7.appendChild(reset);
  };

  /* ---- recording ---- */
  Parents.prototype._renderClips = function (parent) {
    var self = this, clips = this.store.clips();
    var can = !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    if (!can) {
      parent.appendChild(el('p', 'kc-pa-msg', 'इस उपकरण पर रिकॉर्डिंग नहीं हो सकती। · Recording is not available in this browser or app.'));
      return;
    }
    var grid = el('div', 'kc-pa-clips');
    clips.forEach(function (c, i) {
      var box = el('div', 'kc-pa-clip');
      box.innerHTML = '<div class="kc-pa-clip-ic">' + KC._micIcon(i).replace('kc-icon', '') + '</div>';
      var rec = el('button', 'kc-pa-btn kc-pa-primary', c ? 'फिर रिकॉर्ड · Re-record' : 'रिकॉर्ड · Record');
      var play = el('button', 'kc-pa-btn', 'सुनें · Play');
      var del = el('button', 'kc-pa-btn kc-pa-danger', 'मिटाएँ · Delete');
      play.disabled = del.disabled = !c;
      rec.addEventListener('click', function () { self._record(i, rec, box); });
      play.addEventListener('click', function () { self.audio.unlock(); self.audio.playClip(self.store.clips()[i]); });
      del.addEventListener('click', function () { self.store.deleteClip(i); self.onChange(self.store.settings()); self.render(); });
      box.appendChild(rec); box.appendChild(play); box.appendChild(del);
      grid.appendChild(box);
    });
    parent.appendChild(grid);
    this.recMsg = el('p', 'kc-pa-msg', '');
    parent.appendChild(this.recMsg);
  };

  Parents.prototype._stopRec = function () {
    clearTimeout(this._recTimer);
    try { if (this._rec && this._rec.state === 'recording') this._rec.stop(); } catch (e) { /* ignore */ }
  };

  Parents.prototype._record = function (i, btn, box) {
    var self = this;
    if (this._rec && this._rec.state === 'recording') { this._stopRec(); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var types = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/aac', 'audio/webm'], type = '';
      for (var k = 0; k < types.length; k++) if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(types[k])) { type = types[k]; break; }
      var rec = type ? new window.MediaRecorder(stream, { mimeType: type }) : new window.MediaRecorder(stream);
      var chunks = [];
      self._rec = rec;
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        box.classList.remove('kc-recording');
        var blob = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' });
        var fr = new FileReader();
        fr.onload = function () {
          if (self.store.saveClip(i, fr.result)) { self.onChange(self.store.settings()); self.render(); var s = self.el.querySelector('#kc-pa-voice'); if (s) s.scrollIntoView(); }
          else if (self.recMsg) self.recMsg.textContent = 'जगह कम है, रिकॉर्डिंग सहेजी नहीं गई · Not enough storage to keep this recording.';
        };
        fr.readAsDataURL(blob);
      };
      rec.start();
      box.classList.add('kc-recording');
      btn.textContent = 'रोकें · Stop';
      if (self.recMsg) self.recMsg.textContent = 'बोलिए… (5 सेकंड तक) · Speak now (up to 5 seconds)';
      self._recTimer = setTimeout(function () { self._stopRec(); }, MAX_REC_MS);
    }, function () {
      if (self.recMsg) self.recMsg.textContent = 'माइक की अनुमति नहीं मिली · Microphone permission was not given, or this app cannot use the microphone.';
    });
  };

  /* ---- backup helpers ---- */
  Parents.prototype._saveFile = function (text, msg, area) {
    var name = 'katha-code-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    var fallbackToText = function () {
      area.value = text;
      msg.textContent = 'यहाँ फ़ाइल नहीं बन सकी। ऊपर "कॉपी करें" से टेक्स्ट सहेजें। · A file can\'t be saved here; use "Copy text" instead.';
    };
    try {
      // Inside the Khel Khel Mein Android app: hand the backup to Android's share sheet.
      if (window.AndroidApp && typeof window.AndroidApp.shareText === 'function') {
        window.AndroidApp.shareText(name, text);
        msg.textContent = 'बैकअप भेजने के लिए विकल्प खुल गए · Choose where to keep the backup (Drive, WhatsApp, Notes…).';
        return;
      }
      var file = window.File ? new File([text], name, { type: 'application/json' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: name }).then(function () {
          msg.textContent = 'बैकअप भेज दिया गया · Backup shared.';
        }, function () { /* cancelled */ });
        return;
      }
      var url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      msg.textContent = 'फ़ाइल सहेजी जा रही है: ' + name + ' · If no file appears, use "Copy text".';
    } catch (e) { fallbackToText(); }
  };

  Parents.prototype._import = function (text, msg) {
    var data = null;
    try { data = JSON.parse(text); } catch (e) { data = null; }
    var n = this.store.importAll(data);
    if (n < 0) { msg.textContent = 'यह कथा कोड का बैकअप नहीं लगता · That doesn\'t look like a Katha Code backup.'; return; }
    msg.textContent = n + ' खेल जोड़े गए · ' + n + ' game(s) added, stars merged.';
    this.onChange(this.store.settings());
  };

  KC._Parents = Parents;
})(window.KathaCode = window.KathaCode || {});
