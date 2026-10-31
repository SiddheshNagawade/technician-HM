# ALIGN · Technician app

For IWD electricians, plumbers and carpenters on their evening hostel round. Hindi first with English underneath, big glove-friendly buttons, one job at a time, and a speaker on every screen that explains what to do.

Part of ALIGN, a hostel maintenance system for IIT Roorkee (DEC 301 User Interaction Project).

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/ (relative paths, host anywhere)
```

## What is inside

- `src/ds/` shared ALIGN design system (same files in all three apps):
  - `ui.tsx` structured components: Button, IconButton (with hover names), Choice tiles with a corner check, Chip, Segmented, Toggle,
    TextField, OTP boxes, Keypad, Card, ListRow, Tag, Steps, Timeline, Stars, Sheet, Dialog, sticky-note / phone-notification / snackbar toasts.
  - `motion.tsx` app-specific motion: word-by-word headline rise, paper drop, rubber stamp, flip digits, count-up, ink lines.
  - `nav.tsx` screen stack with custom transitions: page push, sheet rise, paper-plane wipe (student), blue wave wash (technician).
  - `fx.ts` sound + haptics. Every sound is synthesised live with Web Audio (tap, select, keypad notes, swoosh, sticky-note slap,
    stamp, success chime, error, bell) and paired with a vibration pattern on phones. Mute from the side panel or profile.
  - `stage.tsx` on a laptop the phone apps sit in a phone frame with a side panel listing every screen and the "simulate" actions.
- `src/data/iitr.ts` mock world modelled on IIT Roorkee: Bhawans (Himalaya, Sarojini, Kasturba, Rajendra, Govind, Ganga...),
  IWD Electrical / Civil sections, technicians, items that break, evening visit slots, `name@dept.iitr.ac.in` emails.
- Everything you type is kept in this browser (localStorage). "Restart" in the side panel clears it.

## Try this path

1. Choose a language, type staff number **4721** (Ravi Kumar), then tap **Fill code** on the SMS banner.
2. Tick what is in your bag, open the next job, start the trip, arrive, tick the steps, finish.
3. Ask for the student's code: B-104's code is **4729** (or use Simulate → "Student reads the code").

## Voice help

`src/tech/voice.ts` holds a spoken explanation for every screen in Hindi and English (not a read-out of the screen).
Recorded clips go in `public/voice/<hi|en>/<key>.mp3`. Generate them with the free Piper neural voices:

```bash
pip install piper-tts
python scripts/make_voices.py
```

This downloads the voices from huggingface.co. Until the clips exist, the speaker uses the phone's built-in voice for the same script.
