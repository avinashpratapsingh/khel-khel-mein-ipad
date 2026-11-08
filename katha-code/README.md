# कथा कोड (Katha Code)

A ScratchJr-style coding playground for children aged 4–8. Children snap picture blocks together to make small animated games from the Ramayan, the Bhagavad Gita and the Upanishads. Everything is spoken in Hindi, so no reading is needed.

It is plain HTML, CSS and JavaScript: no build step, no internet, no accounts, no tracking. Games and stars are saved on the device.

## What's inside

| File | What it does |
|---|---|
| `index.html` | Opens Katha Code on its own |
| `css/katha.css` | All styles, scoped under `.katha-code` so they never clash with a host app |
| `js/art.js`, `js/art-people.js`, `js/art-places.js` | Every character and place, drawn as SVG in code |
| `js/kits.js` | The story kit engine and the story rules |
| `js/kits-ramayan.js`, `js/kits-gita.js`, `js/kits-upanishad.js` | The 11 stories: sources, facts, lines, example games, challenges |
| `js/blocks.js` | The coding blocks (icons, colours, Hindi names) |
| `js/runtime.js` | Runs the children's games and enforces the story rules |
| `js/editor.js` | The stage, block strip, scenes, drag and drop, undo, challenge hints |
| `js/audio.js` | Hindi speech and synthesized sounds |
| `js/store.js` | Saved games, stars, settings, voice clips, backup |
| `js/home.js`, `js/picker.js`, `js/games.js`, `js/parents.js` | Home screen, story picker, My Games and finish card, parents' area |
| `js/main.js` | `KathaCode.mount()`, which ties it all together |

## Run it on its own

Open `index.html` in Chrome, Edge or Safari. It works offline.

## Put it inside another app

Load `css/katha.css` and the scripts in the order `index.html` uses, then:

```js
var app = window.KathaCode.mount(document.getElementById('somewhere'), {
  lang: 'hi',                    // page language
  storageKey: 'katha-code',      // prefix for everything saved on the device
  onExit: function () { … },     // shows a back button on Katha Code's home screen
  startKit: 'hanuman-leap',      // optional: open one story straight away
  audioFiles: ['story-namak']    // optional: recorded .mp3 files in assets/audio/
});
// later: app.destroy();
```

`window.KathaCode` is the only global. The container should fill the screen, and the app is designed for landscape.

## How it is wired into खेल खेल में

Both Khel Khel Mein apps carry a copy of this folder as `katha-code/`, with an `index.html` that adds the Baloo 2 font and sends the back button to the Khel Khel Mein game list. The Khel Khel Mein home page has a "कथा कोड" banner and game card that open it.

- **Android app:** the folder lives in `app/src/main/assets/katha-code/`. Android's WebView has no browser speech, so Katha Code speaks through the app's existing `window.AndroidTTS` bridge. The app also allows the microphone (only after Android asks the parent), a file picker for loading backups, and `window.AndroidApp.shareText()` for sending backups to Drive or WhatsApp.
- **iPad web app:** the folder sits next to `index.html`, and `sw.js` lists every Katha Code file so it works offline. When you change any file, raise the version in `sw.js` (`kkm-v2` → `kkm-v3`) so iPads pick up the change.

## Story rules

The game logic may change what a child builds, but it never contradicts the source text. Each story kit records:

- **source**: the text and section it follows; anything from folk or later tradition is labelled (the squirrel at Ram Setu, the Diwali lamps)
- **facts**: what each scene rests on, in plain English, for reviewers
- **characters**: what each one can do in the story (only Hanuman flies, grows and hides; dissolved salt cannot reappear) and the only lines they may say
- **places**: where land is, so nobody walks on water and each character stays where the story puts them

The parents' area shows all of this under "कहानियों के स्रोत · Story sources and facts".

## Adding or correcting a story

Edit the kit in `js/kits-*.js`. Each kit has `phrases` (lines with a picture), `characters`, `scenes` (with `facts`, `places` and `cast`), `example` and three `challenges`. Example and challenge blocks are written as `['say', 'phraseKey']`, `['fly', 5]` and so on. If a character is given a line that isn't in their list, the page stops with a clear error naming the kit, so mistakes are caught straight away.

## Recorded Hindi audio (optional)

On a device with no Hindi voice, Katha Code can play your own recordings. Put `.mp3` files in `assets/audio/` named by key (for example `story-hanuman-leap.mp3`, `block-fly.mp3`) and list the keys in `audioFiles`.

## Devices

- iPad: iPadOS 15 or later (the iPad 6 runs up to iPadOS 17). In Settings → Accessibility → Spoken Content → Voices → Hindi, download "Lekha" for the best voice.
- Android: any phone with an up-to-date Android System WebView. For Hindi speech, install the Hindi voice in Settings → Text-to-speech.

Tested with a 4× slowed CPU at iPad 6 resolution: example games run at 60 frames per second. All screens pass an automated accessibility scan (axe-core).
