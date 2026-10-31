"""Generate the technician app's spoken help clips with Piper (free, offline neural TTS).

    pip install piper-tts
    python scripts/make_voices.py            # downloads voices from huggingface.co on first run

Reads the scripts from src/tech/voice.ts and writes public/voice/<hi|en>/<key>.mp3.
Voices: Hindi  - hi_IN "priyamvada" (warm female) or "rohan"/"pratham" (male), whichever is available.
        English - en_GB "jenny_dioco" (clear, friendly), falling back to en_US "amy".
"""
import json, re, subprocess, sys, tempfile, urllib.request, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = (ROOT / 'src/tech/voice.ts').read_text(encoding='utf-8')
OUT = ROOT / 'public/voice'
CACHE = Path.home() / '.cache/align-voices'
BASE = 'https://huggingface.co/rhasspy/piper-voices/resolve/main'
CANDIDATES = {
    'hi': ['hi/hi_IN/priyamvada/medium/hi_IN-priyamvada-medium', 'hi/hi_IN/rohan/medium/hi_IN-rohan-medium', 'hi/hi_IN/pratham/medium/hi_IN-pratham-medium'],
    'en': ['en/en_GB/jenny_dioco/medium/en_GB-jenny_dioco-medium', 'en/en_US/amy/medium/en_US-amy-medium'],
}

def scripts():
    block = SRC[SRC.index('export const SCRIPTS'):SRC.index('/* ---------- player')]
    out = {}
    for m in re.finditer(r"\n  (\w+): \{\s*hi: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)',?\s*\}", block):
        out[m.group(1)] = {'hi': m.group(2).replace("\\'", "'"), 'en': m.group(3).replace("\\'", "'")}
    return out

def fetch(path):
    CACHE.mkdir(parents=True, exist_ok=True)
    onnx = CACHE / (Path(path).name + '.onnx')
    for suffix in ('.onnx', '.onnx.json'):
        f = CACHE / (Path(path).name + suffix)
        if not f.exists():
            print('downloading', path + suffix)
            urllib.request.urlretrieve(f'{BASE}/{path}{suffix}', f)
    return onnx

def voice_for(lang):
    from piper import PiperVoice
    for c in CANDIDATES[lang]:
        try:
            return PiperVoice.load(str(fetch(c))), Path(c).name
        except Exception as e:  # voice missing upstream: try the next one
            print('  skip', c, '-', e)
    sys.exit(f'No {lang} voice could be downloaded. Is huggingface.co reachable?')

def main():
    sc = scripts()
    print(len(sc), 'scripts found')
    for lang in ('hi', 'en'):
        v, name = voice_for(lang)
        print('using', name)
        (OUT / lang).mkdir(parents=True, exist_ok=True)
        for key, t in sc.items():
            with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
                with wave.open(tmp.name, 'wb') as w:
                    v.synthesize_wav(t[lang], w)
                mp3 = OUT / lang / f'{key}.mp3'
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp.name, '-af', 'loudnorm=I=-16:TP=-1.5,apad=pad_dur=0.15', '-ac', '1', '-b:a', '48k', str(mp3)], check=True)
                print('  ', lang, key, f'{mp3.stat().st_size // 1024} KB')
    (OUT / 'credits.json').write_text(json.dumps({'engine': 'Piper (rhasspy)', 'voices': [c for l in CANDIDATES.values() for c in l]}, indent=2))

if __name__ == '__main__':
    main()
