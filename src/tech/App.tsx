import { ReactElement, useEffect, useState } from 'react'
import { Phone, Transition, useStack } from '../components/nav'
import { BigButton, Beaver, Key, Paper, Speaker } from '../components/ui'
import { CLOSING_CODE } from '../lib'
import { Dots, Lang, LangCtx, Shell, T } from './kit'

type S = 'lang' | 'staff' | 'pin' | 'bag' | 'jobs' | 'job' | 'msg' | 'trip' | 'cant' | 'nobody' | 'work' | 'part' | 'stock' | 'reserved' | 'code' | 'photo' | 'done' | 'last'
  | 'reopen' | 'slot' | 'history' | 'profile' | 'eOffline' | 'eServer'

// TODO(hindi-review): all Hindi strings in this app need native review before launch
const BAG = [['औज़ार', 'Toolkit', '🧰︎'], ['फ़्यूज़', 'Fuses', '▭'], ['पंखे के पंख', 'Fan blades', '◖'], ['बल्ब', 'Bulbs', '💡︎'], ['टेप', 'Tape', '◎'], ['दस्ताने', 'Gloves', '✋︎']]

const Keypad = ({ onKey }: { onKey: (k: string) => void }) => (
  <div className="grid grid-cols-3 gap-3 px-2 pt-3">
    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => <Key key={k} onClick={() => onKey(k)}>{k}</Key>)}
    <span /><Key onClick={() => onKey('0')}>0</Key><Key onClick={() => onKey('⌫')}>⌫</Key>
  </div>
)

export default function App() {
  const nav = useStack<S>('lang')
  const [lang, setLang] = useState<Lang>('hi')
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const u = () => setOnline(true), d = () => setOnline(false); addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  const [staff, setStaff] = useState(''); const [pin, setPin] = useState(''); const [missing, setMissing] = useState<number[]>([])
  const [done, setDone] = useState(1); const [digits, setDigits] = useState(''); const [wrong, setWrong] = useState(false)
  const [part, setPart] = useState(1)
  const { go, back, reset } = nav
  const sh = { lang, setLang }
  const type = (cur: string, set: (s: string) => void, k: string, max: number) => set(k === '⌫' ? cur.slice(0, -1) : (cur + k).slice(0, max))

  const view: Record<S, ReactElement> = {
    lang: (
      <div className="h-full bg-signal flex flex-col items-center px-6 pt-[70px]">
        <Beaver pose="wave" size={120} />
        <div className="mt-4 text-center"><T hi="अपनी भाषा चुनें" en="Choose your language" className="items-center text-[31px]" /></div>
        <div className="mt-4"><Speaker text="अपनी भाषा चुनें" /></div>
        <div className="w-full mt-8 space-y-4">
          {([['hi', 'हिन्दी', 'Hindi', 'font-hi'], ['en', 'English', 'अंग्रेज़ी', 'font-head']] as const).map(([l, a, b, f]) => (
            <button key={l} onClick={() => { setLang(l); go('staff') }} className="w-full h-[84px] rounded-[20px] bg-cream border-[2.5px] border-navy shadow-[0_3px_0_#00224E] active:translate-y-[3px] active:shadow-none flex items-center gap-3 px-4 text-left">
              <span className="w-9 h-9 rounded-full bg-sky border-2 border-navy flex items-center justify-center">🔊︎</span><span><span className={`block text-[34px] font-extrabold leading-none ${f}`}>{a}</span><span className="text-[11px]">{b}</span></span></button>))}
        </div>
        <div className="mt-auto pb-8 text-center"><T hi="बाद में बदल सकते हैं" en="You can change this later" className="items-center text-[12px]" sub="text-[11px]" /></div>
      </div>),
    staff: (
      <Shell {...sh} speak="अपना नंबर डालें" onBack={back} hiTitle="अपना नंबर डालें" enTitle="Enter your staff number" bottom="#FFFBF3" top={<div className="pb-3"><Paper className="p-3" tone="cream" tape><div className="flex items-center gap-2"><span className="w-10 h-10 rounded-full bg-sun border-2 border-navy flex items-center justify-center font-head font-extrabold text-[13px]">EL</span><Dots n={staff.length} of={4} />{null}</div></Paper></div>}>
        <div className="-mt-1"><Keypad onKey={k => { const n = k === '⌫' ? staff.slice(0, -1) : (staff + k).slice(0, 4); setStaff(n); if (n.length === 4 && k !== '⌫') setTimeout(() => go('pin'), 250) }} /></div>
        <div className="text-center mt-4"><T hi="ग़लत हो जाए तो घबराएँ नहीं" en="Wrong? Just try again" className="items-center text-[12px] text-navy" sub="text-[11px] text-mid" /></div>
      </Shell>),
    pin: (
      <Shell {...sh} speak="अपना पिन डालें" onBack={back} hiTitle="अपना पिन डालें" enTitle="Enter your PIN" top={<div className="pb-3"><Paper className="p-3 flex items-center gap-2" tone="cream" tape><span className="text-[28px]">🔒︎</span><Dots n={pin.length} mask /></Paper></div>}>
        <Keypad onKey={k => { const n = k === '⌫' ? pin.slice(0, -1) : (pin + k).slice(0, 4); setPin(n); if (n.length === 4 && k !== '⌫') setTimeout(() => go('bag'), 250) }} />
        <div className="text-center mt-4"><T hi="ग़लत हो जाए तो घबराएँ नहीं" en="Wrong? Just try again" className="items-center text-[12px] text-navy" sub="text-[11px] text-mid" /></div>
      </Shell>),
    bag: (
      <Shell {...sh} speak="बैग देखें" onBack={back} hiTitle="बैग देखें" enTitle="Check your bag"
        top={<div className="flex justify-center pb-2"><svg width="200" height="90" viewBox="0 0 200 90" fill="none" stroke="#00224E" strokeWidth="3" strokeLinejoin="round"><path d="M60 40C60 10 140 10 140 40" /><path d="M20 40H180L170 88H30Z" fill="#FFD265" /><rect x="60" y="52" width="80" height="22" rx="6" fill="#FFFBF3" /></svg></div>}
        foot={missing.length ? <BigButton hi="स्टोर को बताएं" en="Tell the store" onClick={() => { setMissing([]); go('jobs') }} /> : <BigButton hi="सब तैयार" en="Bag is ready" onClick={() => go('jobs')} />}>
        <div className="grid grid-cols-3 gap-4 pt-2">{BAG.map(([hi, en, ic], i) => {
          const miss = missing.includes(i)
          return <button key={en} onClick={() => setMissing(m => (m.includes(i) ? m.filter(x => x !== i) : [...m, i]))} className="relative flex flex-col items-center gap-1">
            <span className={`w-14 h-14 rounded-full flex items-center justify-center text-[26px] ${miss ? 'border-[2.5px] border-dashed border-ember' : ''}`}>{ic}</span>
            <span className={`absolute top-0 right-3 w-5 h-5 rounded-full text-[11px] text-cream flex items-center justify-center ${miss ? 'bg-ember' : 'bg-green'}`}>{miss ? '✕' : '✓'}</span>
            <T hi={hi} en={en} className="items-center text-[13px]" sub="text-[10px] text-mid" /></button>
        })}</div>
        {missing.length > 0 && <Paper tone="sun2" tape className="mt-5 p-3 text-center"><T hi="स्टोर को खबर जाएगी" en="Pick up at the gate by 8:15 AM" className="items-center text-[16px]" sub="text-[11px] text-mid" /></Paper>}
      </Shell>),
    jobs: (
      <Shell {...sh} speak="आज के काम" hiTitle="आज के काम" enTitle="Today's jobs" banner={!online && <div className="bg-sand2 text-center text-[11px] py-1 pt-8 font-hi">ऑफ़लाइन - काम फ़ोन में सुरक्षित है</div>}
        top={<div className="flex gap-3 pb-1"><Paper className="flex-1 p-3 pt-4" tone="cream" tape><div className="text-[26px]">✣︎</div><div className="font-mono text-[34px] leading-none">BG04</div><div className="font-hi text-[13px] mt-1">पंखा नहीं चल रहा</div><span className="inline-block mt-2 px-2 h-6 rounded-full bg-sun border-2 border-navy font-hi text-[11px]">रात 8:30 बजे</span></Paper>
          <div className="w-[88px] flex flex-col gap-2">{[['F2', ''], ['118', ''], ['305', '✓']].map(([n, d]) => <div key={n} className={`rounded-[12px] border-[2.5px] border-navy h-[54px] flex items-center justify-center gap-1 font-mono text-[14px] ${d ? 'bg-sand2' : 'bg-cream'}`}>{d && <span className="text-green">✓</span>}{n}</div>)}</div></div>}
        foot={<BigButton hi="शुरू करें" en="Start next job" onClick={() => go('job')} />}>
        <div className="text-center mt-2"><T hi="3 काम बाकी, 1 हो गया" en="3 jobs left, 1 done" className="items-center text-[16px]" sub="text-[11px] text-mid" /></div>
        <div className="flex justify-center"><Beaver pose="wave" size={80} /></div>
        <div className="flex flex-wrap justify-center gap-x-3 font-mono text-[10px] text-mid pb-2">{([['profile', 'profile'], ['reopened', 'reopen'], ['slot changed', 'slot'], ['history', 'history'], ['no net', 'eOffline'], ['error', 'eServer']] as const).map(([l, s]) => <button key={s} className="underline" onClick={() => go(s)}>{l}</button>)}</div>
      </Shell>),
    job: (
      <div className="h-full bg-cream flex flex-col">
        <div className="bg-signal px-5 pt-[52px] pb-2 relative" style={{ minHeight: 330 }}>
          <div className="flex items-center gap-2"><button onClick={back} aria-label="Back" className="w-11 h-11 rounded-full bg-cream border-[2.5px] border-navy">←</button><span className="flex-1" /><button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} className="h-9 px-3 rounded-full bg-cream border-[2.5px] border-navy font-hi font-extrabold">{lang === 'hi' ? 'हिं · EN' : 'EN · हिं'}</button></div>
          <div className="flex justify-center mt-2"><svg width="90" height="110" viewBox="0 0 90 110" fill="none" stroke="#00224E" strokeWidth="3"><path d="M45 0V50" />{[0, 120, 240].map(r => <path key={r} transform={`rotate(${r} 45 62)`} d="M45 62C32 46 34 24 46 22 58 24 58 46 45 62Z" fill="#FFFBF3" />)}<circle cx="45" cy="62" r="7" fill="#00224E" /></svg></div>
          <div className="font-mono text-[92px] leading-none text-navy absolute bottom-0 left-5">BG04</div>
        </div>
        <div className="px-5 pt-3 flex-1"><div className="flex justify-between items-start"><div><T hi="पंखा नहीं चल रहा" en="Ceiling fan not working" className="text-[28px]" sub="text-[12px] text-mid" /><div className="font-hi text-[14px] mt-1">रात 8:30-9:00 बजे</div></div><Speaker text="पंखा नहीं चल रहा" /></div>
          <div className="flex gap-3 mt-4">{['⌂︎', '🚶︎', '▯︎', '🔧︎', '▬'].map((i, k) => <span key={k} className={`w-9 h-9 rounded-full border-2 border-navy flex items-center justify-center text-[15px] ${k === 1 ? 'bg-signal' : 'bg-cream'}`}>{i}</span>)}</div></div>
        <div className="px-5 pb-6"><BigButton hi="शुरू करें" en="Start next job" onClick={() => go('msg')} /></div>
      </div>),
    msg: (
      <Shell {...sh} speak="विद्यार्थी का संदेश. पंखा थोड़ी देर चलकर रुक जाता है" onBack={back} hiTitle="BG04" enTitle="पंखा नहीं चल रहा" topClass="font-mono" foot={<><BigButton hi="सफ़र शुरू करें" en="Start trip" onClick={() => go('trip')} /><button onClick={() => go('cant')} className="text-center underline"><T hi="मैं नहीं आ पाऊंगा" en="I can't make this visit" className="items-center text-[12px]" sub="text-[10px] text-mid" /></button></>}>
        <Paper tape tone="cream" className="p-4 mt-4"><div className="flex gap-3 items-center"><Speaker text="पंखा थोड़ी देर चलकर रुक जाता है" /><T hi="विद्यार्थी का संदेश" en="Fan stops after a few minutes" className="text-[16px]" sub="text-[11px] text-mid" /></div></Paper>
        <div className="mt-3 rounded-[12px] bg-sky border-[2.5px] border-navy p-3"><T hi="कमरे में विद्यार्थी होंगे" en="Student will be in the room" className="text-[13px]" sub="text-[10px] text-mid" /></div>
      </Shell>),
    trip: (
      <Shell {...sh} speak="निकल रहे हैं" onBack={back} hiTitle="निकल रहे हैं" enTitle="Heading out" foot={<BigButton hi="चलें" en="Go - tell the student" onClick={() => go('work')} />}>
        <div className="relative h-[290px] mt-2"><span className="absolute left-0 top-2 px-3 h-7 rounded-full border-2 border-navy bg-cream font-hi text-[12px] flex items-center">लगभग 5 मिनट</span>
          <svg viewBox="0 0 330 290" className="absolute inset-0" fill="none" stroke="#00224E" strokeWidth="2.5" strokeDasharray="4 7"><path d="M60 250C20 190 150 190 150 140S60 90 240 40" /></svg>
          <span className="absolute left-[30px] bottom-2 w-14 h-14 rounded-full bg-sun border-[2.5px] border-navy font-hi font-extrabold flex items-center justify-center">आप</span>
          <div className="absolute right-3 top-8 text-right"><div className="w-10 h-14 border-[2.5px] border-navy bg-cream rounded-t ml-auto" /><div className="font-mono text-[18px]">BG04</div></div></div>
      </Shell>),
    cant: (
      <Shell {...sh} speak="अंदर नहीं जा पा रहे?" onBack={back} hiTitle="अंदर नहीं जा पा रहे?" enTitle="Can't get in?">
        <div className="space-y-3 pt-3">{[['दरवाज़ा बंद है', 'Door is locked', '▯︎', () => go('nobody')], ['कोई नहीं है', 'Nobody here - student is told', '👤︎', () => go('nobody')], ['सुपरवाइज़र को फ़ोन', 'Call supervisor', '☎︎', () => { location.href = 'tel:' }]].map(([hi, en, ic, f]) => (
          <button key={en as string} onClick={f as () => void} className="w-full rounded-[16px] border-[2.5px] border-navy bg-cream p-3 flex items-center gap-3 text-left shadow-[0_3px_0_#00224E]"><span className="text-[26px]">{ic as string}</span><T hi={hi as string} en={en as string} className="text-[19px]" sub="text-[11px] text-mid" /></button>))}</div>
        <div className="flex items-center justify-between mt-4"><T hi="हम मदद करेंगे" en="We'll sort it out" className="text-[13px]" sub="text-[10px] text-mid" /><Beaver pose="think" size={64} /></div>
      </Shell>),
    nobody: (
      <Shell {...sh} speak="विद्यार्थी नहीं मिले" onBack={back} hiTitle="विद्यार्थी नहीं मिले" enTitle="Student wasn't in" foot={<BigButton hi="अगला काम" en="Next job" onClick={() => reset('jobs')} />}>
        <div className="flex items-center gap-4 mt-3"><div className="w-[100px] h-[130px] border-[2.5px] border-navy bg-sky rounded-[6px]" /><div><Beaver pose="think" size={70} /><span className="px-3 h-7 rounded-full border-2 border-navy bg-cream font-hi text-[12px] inline-flex items-center">दौरा 1 / 2</span></div></div>
        <div className="mt-4"><T hi="आगे क्या होगा" en="What happens now" className="text-[17px]" sub="text-[10px] text-mid" /></div>
        <div className="flex justify-between mt-3 text-center">{[['नोटिस छोड़ा', 'Notice left'], ['नया समय चुनेंगे', 'Student picks a time'], ['दूसरा दौरा', 'Second visit']].map(([a, b], i) => <div key={b} className="flex-1"><span className={`block mx-auto w-5 h-5 rounded-full border-2 border-navy ${i === 0 ? 'bg-green' : i === 1 ? 'bg-sun' : 'bg-cream'}`} /><T hi={a} en={b} className="items-center text-[10px] mt-1" sub="text-[9px] text-mid" /></div>)}</div>
        <Paper tape tone="sun2" className="mt-5 p-3"><T hi="विद्यार्थी को संदेश चला गया" en="The student has been messaged" className="text-[14px]" sub="text-[10px] text-mid" /></Paper>
      </Shell>),
    work: (
      <Shell {...sh} speak="काम चल रहा है" onBack={back} topClass="pb-1" top={<div className="text-center pb-2"><div className="font-mono text-[44px] leading-none">12:40</div><T hi="काम चल रहा है" en="BG04 - Fan on this job" className="items-center text-[18px]" sub="text-[10px]" /></div>}
        foot={<BigButton hi="काम पूरा" en="Finish" onClick={() => { setDigits(''); setWrong(false); go('code') }} />}>
        <div className="space-y-2 pt-1">{[['पंखा बंद करें', 'Switch off', true], ['कैपेसिटर जाँचें', 'Check the capacitor', true], ['चलाकर देखें', 'Test run', false]].map(([a, b, d]) => <div key={b as string} className="flex items-center gap-3"><span className={`w-7 h-7 rounded-full border-2 border-navy flex items-center justify-center text-cream ${d ? 'bg-green' : 'bg-cream'}`}>{d ? '✓' : ''}</span><T hi={a as string} en={b as string} className="text-[15px]" sub="text-[9.5px] text-mid" /></div>)}</div>
        <div className="flex gap-3 mt-3"><Paper className="flex-1 h-[80px] flex items-center justify-center font-hi text-[12px]" tone="cream">पहले</Paper><Paper className="flex-1 h-[80px] flex items-center justify-center font-hi text-[12px]" tone="cream">बाद में</Paper></div>
        <button onClick={() => go('part')} className="w-full text-center mt-3"><T hi="सामान चाहिए" en="Needs a part" className="items-center text-[14px] underline" sub="text-[9.5px] text-mid" /></button>
      </Shell>),
    part: (
      <Shell {...sh} speak="कौन सा सामान चाहिए?" onBack={back} hiTitle="कौन सा सामान चाहिए?" enTitle="Which part is needed?" foot={<BigButton hi="आगे" en="Next" onClick={() => go('stock')} />}>
        <div className="grid grid-cols-2 gap-4 pt-2">{[['पंखे की मोटर', 'Fan motor', '⚙︎'], ['कैपेसिटर', 'Capacitor', '▮'], ['स्विच', 'Switch', '▣'], ['बल्ब', 'Bulb', '💡︎'], ['नल की वॉशर', 'Tap washer', '◎'], ['कुछ और', 'Something else', '?']].map(([a, b, i], k) => (
          <button key={b} onClick={() => setPart(k)} className={`rounded-[20px] h-[96px] flex flex-col items-center justify-center ${part === k ? 'bg-sun border-[2.5px] border-navy shadow-[0_3px_0_#00224E]' : ''}`}><span className="text-[30px]">{i}</span><T hi={a} en={b} className="items-center text-[12px]" sub="text-[9px] text-mid" /></button>))}</div>
      </Shell>),
    stock: (
      <Shell {...sh} speak="स्टॉक देखें" onBack={back} hiTitle="स्टॉक देखें" enTitle="Stock status" foot={<BigButton hi="रिज़र्व करें" en="Reserve" onClick={() => go('reserved')} />}>
        {[['स्टोर', 3], ['पास का ब्लॉक', 1]].map(([n, c]) => <div key={n as string} className="mt-2"><div className="font-hi font-extrabold text-[13px]">{n}</div><div className="flex gap-2 border-b-[3px] border-navy pb-1">{[0, 1, 2].map(i => <span key={i} className={`w-12 h-14 rounded ${i < (c === 3 ? 2 : 1) ? 'border-[2.5px] border-navy bg-cream' : 'border-2 border-dashed border-navy'}`} />)}</div></div>)}
        <div className="flex gap-3 mt-4"><Paper className="flex-1 text-center py-2" tone="cream"><div className="font-head font-extrabold text-[26px] text-green">2</div><T hi="स्टोर में" en="in store" className="items-center text-[10px]" sub="text-[9px]" /></Paper><Paper className="flex-1 text-center py-2" tone="sun2"><div className="font-head font-extrabold text-[26px] text-ember">1</div><T hi="पास के ब्लॉक में" en="next block" className="items-center text-[10px]" sub="text-[9px]" /></Paper></div>
      </Shell>),
    reserved: (
      <Shell {...sh} speak="सामान रिज़र्व हो गया" onBack={back} hiTitle="सामान रिज़र्व हो गया" enTitle="Part reserved" topClass="pb-2" top={<div className="flex justify-center"><Beaver pose="cele" size={100} /></div>} foot={<BigButton hi="अगला काम" en="Next job" onClick={() => reset('jobs')} />}>
        <Paper tape tone="cream" className="mt-6 p-4"><T hi="कैपेसिटर कल सुबह 8:15 तक" en="Collect at the gate by 8:15 AM" className="text-[17px]" sub="text-[11px] text-mid" /></Paper>
      </Shell>),
    code: (
      <Shell {...sh} speak="विद्यार्थी से कोड पूछें" onBack={back} hiTitle="विद्यार्थी से कोड पूछें" enTitle="Ask the student for the code" top={<div className="pb-3"><Paper className={`p-3 ${wrong ? 'ring-4 ring-ember' : ''}`} tone="cream"><div className="flex gap-2 justify-center">{[0, 1, 2, 3].map(i => <span key={i} className="w-11 h-14 rounded-[10px] border-[2.5px] border-navy bg-cream flex items-center justify-center font-mono text-[30px]">{digits[i] || ''}</span>)}</div></Paper></div>}>
        <Keypad onKey={k => { const n = k === '⌫' ? digits.slice(0, -1) : (digits + k).slice(0, 4); setDigits(n); setWrong(false); if (n.length === 4 && k !== '⌫') { if (n === CLOSING_CODE) setTimeout(() => { setDone(d => d + 1); go('done') }, 250); else setWrong(true) } }} />
        <div className="text-center mt-3">{wrong ? <T hi="ग़लत? फिर से डालें" en="Wrong? Try again" className="items-center text-[12px] text-ember" sub="text-[10px]" /> : <T hi="कोड मिला? " en={`Student's code is on their phone`} className="items-center text-[12px]" sub="text-[10px] text-mid" />}
          <button onClick={() => go('photo')} className="mt-2 underline"><T hi="कोड नहीं मिला? फ़ोटो से बंद करें" en="No code? Close with a photo" className="items-center text-[11px]" sub="text-[9px] text-mid" /></button></div>
      </Shell>),
    photo: (
      <Shell {...sh} speak="फ़ोटो से बंद करें" onBack={back} hiTitle="फ़ोटो से बंद करें" enTitle="Close with a photo" top={<div className="flex justify-center pb-3"><svg width="170" height="120" viewBox="0 0 170 120" fill="#FFFBF3" stroke="#00224E" strokeWidth="3"><rect x="10" y="26" width="150" height="88" rx="14" /><circle cx="85" cy="70" r="28" fill="#BDDDFF" /><circle cx="85" cy="70" r="14" /><rect x="60" y="10" width="40" height="18" rx="5" /></svg></div>}
        foot={<BigButton hi="फ़ोटो खींचें" en="Take photo" icon="📷︎" onClick={() => { setDone(d => d + 1); go('done') }} />}>
        <div className="mt-2 text-center"><T hi="ठीक किए हुए पंखे की फ़ोटो" en="A photo of the fixed fan" className="items-center text-[15px]" sub="text-[10px] text-mid" /></div>
        <Paper tape tone="sun2" className="mt-4 p-3"><T hi="सुपरवाइज़र फ़ोटो देखेंगे" en="The supervisor checks it before it closes" className="text-[13px]" sub="text-[10px] text-mid" /></Paper>
      </Shell>),
    done: (
      <Shell {...sh} speak="काम पूरा!" hiTitle="काम पूरा!" enTitle="Job closed - BG04" topClass="pb-3" top={<div className="flex justify-center"><Beaver pose="cele" size={100} /></div>}
        foot={<BigButton hi="अगला काम" en="Next job" onClick={() => (done >= 3 ? reset('last') : reset('jobs'))} />}>
        <div className="flex justify-center gap-2 mt-4">{[0, 1, 2, 3].map(i => <span key={i} className={`w-5 h-5 rounded-full border-2 border-navy ${i < done + 1 ? 'bg-green' : 'bg-cream'}`} />)}</div>
        <div className="text-center mt-3"><T hi={`आज 4 में से ${done + 1} हो गए`} en={`${done + 1} of 4 jobs done today`} className="items-center text-[16px]" sub="text-[10px] text-mid" /></div>
      </Shell>),
    last: (
      <Shell {...sh} speak="आज का काम पूरा!" hiTitle="आज का काम पूरा!" enTitle="All done today" topClass="pb-3" top={<div className="flex justify-center"><Beaver pose="cele" size={110} /></div>} foot={<BigButton hi="घर" en="Home" onClick={() => reset('lang')} />}>
        <div className="mt-8 text-center"><T hi="कोई नया काम नहीं" en="New jobs show up here." className="items-center text-[16px]" sub="text-[10px] text-mid" /></div>
      </Shell>),
    reopen: (
      <Shell {...sh} speak="काम फिर खुला" onBack={back} hiTitle="काम फिर खुला" enTitle="Job reopened" top={<div className="flex items-center justify-between pb-3"><div><div className="font-mono text-[56px] leading-none">BG04</div><span className="px-3 h-6 rounded-full border-2 border-navy bg-cream font-hi text-[11px] inline-flex items-center">फिर से</span></div><span className="w-[84px] h-[84px] rounded-[16px] bg-sun border-[2.5px] border-navy text-[40px] flex items-center justify-center">⟳</span></div>}
        foot={<BigButton hi="काम देखें" en="View job" onClick={() => go('job')} />}>
        <Paper tape tone="cream" className="mt-3 p-3 flex items-center gap-3"><Speaker text="विद्यार्थी ने बताया पंखा फिर रुक गया" /><T hi="विद्यार्थी ने बताया" en="Fan stopped again" className="text-[14px]" sub="text-[10px] text-mid" /></Paper>
        <div className="mt-3 rounded-[12px] bg-sky border-[2.5px] border-navy p-3"><T hi="पिछली बार: कैपेसिटर बदला" en="Last time: capacitor replaced" className="text-[12px]" sub="text-[10px] text-mid" /></div>
      </Shell>),
    slot: (
      <Shell {...sh} speak="समय बदल गया" onBack={back} hiTitle="समय बदल गया" enTitle="Slot changed" foot={<BigButton hi="ठीक है" en="OK" onClick={() => reset('jobs')} />}>
        <div className="mt-3 rounded-[12px] bg-sand2 border-[2.5px] border-navy p-3"><div className="font-hi text-[11px]">पहले</div><div className="font-hi font-extrabold text-[24px] line-through decoration-ember">रात 8:30</div></div>
        <div className="font-hi text-[12px] text-center my-2">↓ विद्यार्थी ने बदला</div>
        <div className="rounded-[16px] bg-sun border-[2.5px] border-navy p-4"><div className="font-hi text-[11px]">अब</div><div className="font-hi font-extrabold text-[30px]">रात 9:00</div></div>
      </Shell>),
    history: (
      <Shell {...sh} speak="इस पंखे का इतिहास" onBack={back} hiTitle="इस पंखे का इतिहास" enTitle="History of this fan" top={<div className="font-mono text-[28px] text-center -mt-2">BG04</div>}>
        <div className="space-y-3 pt-2 border-l-2 border-dotted border-navy ml-1 pl-4">{[['कैपेसिटर बदला', 'Capacitor replaced', '3 हफ़्ते पहले'], ['पंखा साफ़ किया', 'Cleaned', '2 महीने पहले'], ['बेयरिंग की आवाज़', 'Bearing noise', '5 महीने पहले']].map(([a, b, w]) => <Paper key={b} className="p-3" tone="cream"><T hi={a} en={b} className="text-[15px]" sub="text-[10px] text-mid" /><span className="font-hi text-[10px] text-ember">{w}</span></Paper>)}</div>
        <div className="font-hi text-[14px] mt-4">3 बार, 5 महीने में</div>
      </Shell>),
    profile: (
      <Shell {...sh} speak="मेरा प्रोफ़ाइल" onBack={back} hiTitle="मेरा प्रोफ़ाइल" enTitle="My profile" top={<div className="pb-3"><Paper tape className="p-3 flex items-center gap-3" tone="cream"><span className="w-12 h-12 rounded-full bg-sun border-2 border-navy flex items-center justify-center font-head font-extrabold">R</span><div><div className="font-hi font-extrabold text-[22px] leading-none">रवि</div><div className="font-mono text-[11px]">Ravi - 014</div></div></Paper></div>}>
        <div className="flex gap-3 mt-3"><div className="flex-1"><T hi="आज की शिफ़्ट" en="Today's shift" className="text-[11px]" sub="text-[9px]" /><div className="rounded-[8px] bg-sun2 border-2 border-navy p-2 font-hi text-[11px] mt-1">शाम 5 से रात 10</div></div><div><T hi="मेरे ब्लॉक" en="My blocks" className="text-[11px]" sub="text-[9px]" /><div className="flex gap-1 mt-1">{['BG', 'F', 'C'].map(b => <span key={b} className="px-2 py-2 bg-sky border-2 border-navy rounded-[6px] font-mono text-[10px]">{b}</span>)}</div></div></div>
        <div className="mt-4"><T hi="भाषा" en="Language" className="items-center text-[11px]" sub="text-[9px]" /><div className="flex mt-1 rounded-full border-[2.5px] border-navy overflow-hidden">{([['hi', 'हिंदी'], ['en', 'English']] as const).map(([l, t]) => <button key={l} onClick={() => setLang(l)} className={`flex-1 py-1.5 font-hi font-extrabold text-[13px] ${lang === l ? 'bg-sun' : 'bg-cream'}`}>{t}</button>)}</div></div>
        <div className="flex items-end justify-between mt-6"><Beaver pose="wave" size={80} /><button onClick={() => reset('lang')} className="underline"><T hi="बाहर निकलें" en="Log out" className="items-center text-[13px]" sub="text-[9px]" /></button></div>
      </Shell>),
    eOffline: <div className="h-full bg-cream"><Shell {...sh} speak="इंटरनेट नहीं है" topClass="pb-2" top={<div className="flex justify-center"><Beaver pose="sit" size={110} /></div>} foot={<BigButton hi="फिर कोशिश करें" en="Try again" onClick={back} />}>
      <div className="text-center mt-8"><T hi="इंटरनेट नहीं है" en="No internet" className="items-center text-[22px]" sub="text-[11px] text-mid" /><p className="font-hi text-[12px] mt-8">आपका काम फ़ोन में सुरक्षित है। नेट आते ही अपने आप चला जाएगा।</p><p className="text-[10px] text-mid mt-1">Your work is saved on the phone. It sends itself when the net is back.</p></div></Shell></div>,
    eServer: <Shell {...sh} speak="कुछ गड़बड़ हो गई" topClass="pb-2" top={<div className="flex justify-center"><Beaver pose="think" size={110} /></div>} foot={<BigButton hi="फिर कोशिश करें" en="Try again" onClick={back} />}>
      <div className="text-center mt-8"><T hi="कुछ गड़बड़ हो गई" en="Something went wrong" className="items-center text-[22px]" sub="text-[11px] text-mid" /><p className="font-hi text-[12px] mt-8">ग़लती हमारी तरफ़ से है। आपका काम सुरक्षित है।</p><p className="text-[10px] text-mid mt-1">The fault is on our side. Your work is safe.</p></div></Shell>,
  }
  return <LangCtx.Provider value={lang}><Phone bg="#FFFBF3"><Transition id={nav.screen} dir={nav.dir} mode="slide">{view[nav.screen]}</Transition></Phone></LangCtx.Provider>
}
