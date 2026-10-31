import { ReactElement, useEffect, useState } from 'react'
import { Phone, Transition, useStack } from '../components/nav'
import { Art, ArtBox, BigButton, Beaver, Key, Speaker } from '../components/ui'
import { CLOSING_CODE } from '../lib'
import { Dots, Lang, LangCtx, Shell, T } from './kit'

type S = 'lang' | 'staff' | 'pin' | 'bag' | 'jobs' | 'job' | 'msg' | 'trip' | 'cant' | 'nobody' | 'work' | 'part' | 'stock' | 'reserved' | 'code' | 'photo' | 'done' | 'last'
  | 'reopen' | 'slot' | 'history' | 'profile' | 'eOffline' | 'eServer'

// TODO(hindi-review): all Hindi strings in this app need native review before launch
const BAG: [string, string, string][] = [['औज़ार', 'Toolkit', 'item-toolkit'], ['फ़्यूज़', 'Fuses', 'item-fuse'], ['पंखे के पंख', 'Fan blades', 'item-blades'], ['बल्ब', 'Bulbs', 'item-bulb'], ['टेप', 'Tape', 'item-tape'], ['दस्ताने', 'Gloves', 'item-gloves']]
const PARTS: [string, string, string][] = [['पंखे की मोटर', 'Fan motor', 'part-motor'], ['कैपेसिटर', 'Capacitor', 'part-cap'], ['स्विच', 'Switch', 'part-switch'], ['बल्ब', 'Bulb', 'part-bulb'], ['नल की वॉशर', 'Tap washer', 'part-washer'], ['कुछ और', 'Something else', 'part-other']]

const Keypad = ({ onKey }: { onKey: (k: string) => void }) => (
  <div className="grid grid-cols-3 gap-[10px] px-1 pt-3">
    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => <Key key={k} onClick={() => onKey(k)}>{k}</Key>)}
    <span /><Key onClick={() => onKey('0')}>0</Key><Key onClick={() => onKey('⌫')}>⌫</Key>
  </div>
)
const Tip = () => <div className="text-center mt-4"><T hi="ग़लत हो जाए तो घबराएँ नहीं" en="Wrong? Just try again" className="items-center text-[13px]" sub="text-[11px] text-mid" /></div>
const Foot = ({ hi, en, go, icon }: { hi: string; en: string; go: () => void; icon?: string }) => <BigButton hi={hi} en={en} onClick={go} icon={icon} />

export default function App() {
  const nav = useStack<S>((new URLSearchParams(location.search).get('s') as S) || 'lang')
  const [lang, setLang] = useState<Lang>('hi')
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const u = () => setOnline(true), d = () => setOnline(false); addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  const [staff, setStaff] = useState(''); const [pin, setPin] = useState(''); const [missing, setMissing] = useState<number[]>([])
  const [done, setDone] = useState(1); const [digits, setDigits] = useState(''); const [wrong, setWrong] = useState(false)
  const [part, setPart] = useState(1)
  const { go, back, reset } = nav
  const sh = { lang, setLang }
  const step = (cur: string, set: (s: string) => void, k: string, next: () => void) => { const n = k === '⌫' ? cur.slice(0, -1) : (cur + k).slice(0, 4); set(n); if (n.length === 4 && k !== '⌫') setTimeout(next, 250) }

  const view: Record<S, ReactElement> = {
    lang: (
      <div className="h-full bg-signal flex flex-col items-center px-6 pt-[78px]">
        <Beaver pose="wave" />
        <div className="mt-6 text-center"><T hi="अपनी भाषा चुनें" en="Choose your language" className="items-center [&>span:first-child]:text-[31px]" sub="text-[12.5px]" /></div>
        <div className="mt-4"><Speaker text="अपनी भाषा चुनें" className="!w-[52px] !h-[52px]" /></div>
        <div className="w-full mt-8 space-y-4">
          {([['hi', 'हिन्दी', 'Hindi', 'font-hi'], ['en', 'English', 'अंग्रेज़ी', 'font-head']] as const).map(([l, a, b, f]) => (
            <button key={l} onClick={() => { setLang(l); go('staff') }} className="w-full h-[84px] rounded-[20px] bg-cream border-[2.5px] border-navy shadow-[0_3px_0_#00224E] active:translate-y-[3px] active:shadow-none flex items-center gap-3 px-3 text-left">
              <Art n="play" w={44} /><span><span className={`block text-[36px] font-extrabold leading-none ${f}`}>{a}</span><span className="text-[11px]">{b}</span></span></button>))}
        </div>
        <div className="mt-auto pb-8 text-center"><T hi="बाद में बदल सकते हैं" en="You can change this later" className="items-center text-[14px]" sub="text-[11.5px]" /></div>
      </div>),
    staff: (
      <Shell {...sh} speak="अपना नंबर डालें" onBack={back} hiTitle="अपना नंबर डालें" enTitle="Enter your staff number" fieldH={300}
        top={<ArtBox n="badge" className="mx-auto mt-2" style={{ width: '100%', height: 120 }}><div className="flex items-center justify-center gap-3 pt-[30px]"><span className="w-10 h-10 shrink-0 rounded-full bg-sun border-2 border-navy flex items-center justify-center font-head font-extrabold text-[13px]">EL</span><Dots value={staff} /></div></ArtBox>}>
        <Keypad onKey={k => step(staff, setStaff, k, () => go('pin'))} /><Tip />
      </Shell>),
    pin: (
      <Shell {...sh} speak="अपना पिन डालें" onBack={back} hiTitle="अपना पिन डालें" enTitle="Enter your PIN" fieldH={300}
        top={<ArtBox n="badge" className="mx-auto mt-2" style={{ width: '100%', height: 120 }}><div className="flex items-center justify-center gap-3 pt-[30px]"><Art n="lock" w={34} /><Dots value={pin} mask /></div></ArtBox>}>
        <Keypad onKey={k => step(pin, setPin, k, () => go('bag'))} /><Tip />
      </Shell>),
    bag: (
      <Shell {...sh} speak="बैग देखें" onBack={back} hiTitle="बैग देखें" enTitle="Check your bag" fieldH={320}
        top={<div className="flex justify-center -mt-2"><Art n="bag" /></div>}
        foot={missing.length ? <Foot hi="स्टोर को बताएं" en="Tell the store" go={() => { setMissing([]); go('jobs') }} /> : <Foot hi="सब तैयार" en="Bag is ready" go={() => go('jobs')} />}>
        <div className="grid grid-cols-3 gap-x-2 gap-y-3 pt-2">{BAG.map(([hi, en, art], i) => {
          const miss = missing.includes(i)
          return <button key={en} onClick={() => setMissing(m => (m.includes(i) ? m.filter(x => x !== i) : [...m, i]))} className="relative flex flex-col items-center h-[130px]">
            {miss && <Art n="ring" className="absolute -top-1 left-1/2 -translate-x-1/2" w={88} />}
            <span className="h-[56px] flex items-end justify-center mt-2"><Art n={art} /></span><Art n={miss ? 'tally' : 'tick'} w={28} className="absolute top-1 right-3" />
            <T hi={hi} en={en} className="items-center text-[17px] mt-1" sub="text-[11px] text-mid" /></button>
        })}</div>
        {missing.length > 0 && <ArtBox n="note" className="mt-2 mx-auto" style={{ width: '100%', height: 70 }}><div className="px-5 pt-5"><T hi="स्टोर को खबर जाएगी" en="Pick up at the gate by 8:15 AM" className="text-[16px]" sub="text-[11px] text-mid" /></div></ArtBox>}
      </Shell>),
    jobs: (
      <Shell {...sh} speak="आज के काम" hiTitle="आज के काम" enTitle="Today's jobs" fieldH={370}
        banner={!online && <div className="relative bg-sand2 text-center text-[11px] py-1 pt-7 font-hi">ऑफ़लाइन - काम फ़ोन में सुरक्षित है</div>}
        top={<div className="flex gap-3 mt-3 relative">
          <Art n="string" className="absolute -top-2 left-[-20px] w-[calc(100%+40px)]" />
          <ArtBox n="tag1" className="flex-1" style={{ height: 224 }}><div className="px-4 pt-10"><Art n="drawing" w={44} /><div className="font-mono text-[40px] leading-none mt-2">BG04</div><div className="font-hi font-extrabold text-[14px] mt-1">पंखा नहीं चल रहा</div><span className="inline-block mt-2 px-3 h-7 rounded-full bg-sun border-2 border-navy font-hi text-[12px] leading-[24px]">रात 8:30 बजे</span></div></ArtBox>
          <div className="w-[96px] flex flex-col gap-3 pt-1">{[['F2', ''], ['118', ''], ['305', '✓']].map(([n, d]) => <div key={n} className={`rounded-[14px] border-[2.5px] border-navy h-[62px] flex items-center justify-center gap-1 font-mono text-[16px] ${d ? 'bg-sand2' : 'bg-cream'}`}>{d && <Art n="tick" w={22} />}{n}</div>)}</div></div>}
        foot={<Foot hi="शुरू करें" en="Start next job" go={() => go('job')} />}>
        <div className="text-center mt-3"><T hi="3 काम बाकी, 1 हो गया" en="3 jobs left, 1 done" className="items-center text-[19px]" sub="text-[11.5px] text-mid" /></div>
        <div className="flex justify-center mt-1"><Beaver pose="wave" size={90} /></div>
        <div className="flex flex-wrap justify-center gap-x-3 font-mono text-[10px] text-mid pb-1">{([['profile', 'profile'], ['reopened', 'reopen'], ['slot changed', 'slot'], ['history', 'history'], ['no net', 'eOffline'], ['error', 'eServer']] as const).map(([l, s]) => <button key={s} className="underline" onClick={() => go(s)}>{l}</button>)}</div>
      </Shell>),
    job: (
      <Shell {...sh} speak="पंखा नहीं चल रहा" onBack={back} hiTitle="" fieldH={400}
        top={<div className="relative" style={{ height: 250 }}><Art n="fan" className="absolute left-1/2 -translate-x-1/2 -top-[100px]" w={300} style={{ clipPath: 'inset(0 0 0 0)' }} /><div className="absolute left-0 bottom-[6px] font-mono text-[92px] leading-none">BG04</div></div>}
        foot={<Foot hi="शुरू करें" en="Start next job" go={() => go('msg')} />}>
        <div className="flex justify-between items-start mt-1"><div><T hi="पंखा नहीं चल रहा" en="Ceiling fan not working" className="[&>span:first-child]:text-[28px]" sub="text-[12px] text-mid" /><div className="font-hi text-[14px] mt-1">रात 8:30-9:00 बजे</div></div><Speaker text="पंखा नहीं चल रहा" /></div>
        <Art n="road" className="w-[calc(100%+40px)] -mx-5 mt-3" />
      </Shell>),
    msg: (
      <Shell {...sh} speak="विद्यार्थी का संदेश. पंखा थोड़ी देर चलकर रुक जाता है" onBack={back} hiTitle="BG04" enTitle="पंखा नहीं चल रहा" fieldH={200}
        foot={<><Foot hi="सफ़र शुरू करें" en="Start trip" go={() => go('trip')} /><button onClick={() => go('cant')} className="text-center underline"><T hi="मैं नहीं आ पाऊंगा" en="I can't make this visit" className="items-center text-[13px]" sub="text-[10.5px] text-mid" /></button></>}>
        <ArtBox n="note" className="mt-1" style={{ width: '100%', height: 96 }}><div className="flex gap-3 items-center px-5 pt-5"><Speaker text="पंखा थोड़ी देर चलकर रुक जाता है" /><T hi="विद्यार्थी का संदेश" en="Fan stops after a few minutes" className="text-[17px]" sub="text-[11px] text-mid" /></div></ArtBox>
        <div className="mt-3 rounded-[14px] bg-sky border-[2.5px] border-navy p-3 flex items-center gap-3"><Art n="ico" w={34} /><T hi="कमरे में विद्यार्थी होंगे" en="Student will be in the room" className="text-[15px]" sub="text-[11px] text-mid" /></div>
      </Shell>),
    trip: (
      <Shell {...sh} speak="निकल रहे हैं" onBack={back} hiTitle="निकल रहे हैं" enTitle="Heading out" fieldH={200}
        foot={<Foot hi="चलें" en="Go - tell the student" go={() => go('work')} />}>
        <div className="relative" style={{ height: 380 }}>
          <span className="absolute left-0 top-2 px-3 h-8 rounded-full border-2 border-navy bg-cream font-hi text-[13px] flex items-center z-10">लगभग 5 मिनट</span>
          <Art n="path" className="absolute left-[-20px] top-[-10px] w-[calc(100%+40px)]" />
          <div className="absolute left-[10px] bottom-[10px] flex items-center justify-center"><Art n="start" w={64} className="absolute" /><span className="relative font-hi font-extrabold text-[14px]">आप</span></div>
          <div className="absolute right-[18px] top-[10px] text-right"><Art n="ico" w={44} className="ml-auto" /><div className="font-mono text-[19px]">BG04</div></div>
        </div>
      </Shell>),
    cant: (
      <Shell {...sh} speak="अंदर नहीं जा पा रहे?" onBack={back} hiTitle="अंदर नहीं जा पा रहे?" enTitle="Can't get in?" fieldH={200}>
        <div className="space-y-3 pt-1">{([['दरवाज़ा बंद है', 'Door is locked', 'ico', () => go('nobody')], ['कोई नहीं है', 'Nobody here - student is told', 'ic-test', () => go('nobody')], ['सुपरवाइज़र को फ़ोन', 'Call supervisor', 'ic-cap', () => { location.href = 'tel:' }]] as const).map(([hi, en, ic, f]) => (
          <button key={en} onClick={f} className="w-full rounded-[18px] border-[2.5px] border-navy bg-cream p-3 flex items-center gap-4 text-left shadow-[0_3px_0_#00224E]"><Art n={ic} w={48} /><T hi={hi} en={en} className="text-[21px]" sub="text-[11.5px] text-mid" /></button>))}</div>
        <div className="flex items-center justify-between mt-4"><T hi="हम मदद करेंगे" en="We'll sort it out" className="text-[16px]" sub="text-[11px] text-mid" /><Beaver pose="think" size={70} /></div>
      </Shell>),
    nobody: (
      <Shell {...sh} speak="विद्यार्थी नहीं मिले" onBack={back} hiTitle="विद्यार्थी नहीं मिले" enTitle="Student wasn't in" fieldH={200} foot={<Foot hi="अगला काम" en="Next job" go={() => reset('jobs')} />}>
        <div className="relative mt-1" style={{ height: 150 }}><Art n="door" w={100} className="absolute left-0 top-0" /><ArtBox n="sticky" className="absolute left-[24px] top-[24px]" style={{ width: 60, height: 50 }} /><Beaver pose="think" size={80} className="absolute right-[40px] top-0" /><span className="absolute right-0 bottom-0 px-3 h-7 rounded-full border-2 border-navy bg-cream font-hi text-[12px] leading-[24px]">दौरा 1 / 2</span></div>
        <div className="mt-2"><T hi="आगे क्या होगा" en="What happens now" className="text-[19px]" sub="text-[11px] text-mid" /></div>
        <div className="flex justify-between mt-3 text-center">{[['नोटिस छोड़ा', 'Notice left'], ['नया समय चुनेंगे', 'Student picks a time'], ['दूसरा दौरा', 'Second visit']].map(([a, b], i) => <div key={b} className="flex-1 flex flex-col items-center"><span className={`w-6 h-6 rounded-full border-2 border-navy ${i === 0 ? 'bg-green' : i === 1 ? 'bg-sun' : 'bg-cream'}`} /><T hi={a} en={b} className="items-center text-[11.5px] mt-1" sub="text-[9.5px] text-mid" /></div>)}</div>
        <ArtBox n="note" className="mt-4" style={{ width: '100%', height: 76 }}><div className="px-5 pt-5"><T hi="विद्यार्थी को संदेश चला गया" en="The student has been messaged" className="text-[15px]" sub="text-[10.5px] text-mid" /></div></ArtBox>
      </Shell>),
    work: (
      <Shell {...sh} speak="काम चल रहा है" onBack={back} fieldH={280}
        top={<div className="text-center -mt-2"><div className="font-mono text-[56px] leading-none">12:40</div><T hi="काम चल रहा है" en="BG04 · Time on this job" className="items-center [&>span:first-child]:text-[24px]" sub="text-[12px] opacity-80 font-body" /></div>}
        foot={<Foot hi="काम पूरा" en="Finish" go={() => { setDigits(''); setWrong(false); go('code') }} />}>
        <div className="space-y-1 pt-1">{([['पंखा बंद करें', 'Switch off', 'ic-off', true], ['कैपेसिटर जाँचें', 'Check the capacitor', 'ic-cap', true], ['चलाकर देखें', 'Test run', 'ic-test', false]] as const).map(([a, b, ic, d]) => <div key={b} className="flex items-center gap-3 h-[56px]">{d ? <Art n="tick" w={40} /> : <span className="w-[40px] h-[40px] rounded-full border-2 border-dashed border-navy" />}<Art n={ic} w={40} /><T hi={a} en={b} className="text-[18px]" sub="text-[11px] text-mid" /></div>)}</div>
        <div className="flex gap-4 mt-2 justify-center">{['पहले', 'बाद में'].map(l => <div key={l} className="relative"><Art n="polaroid" /><span className="absolute inset-x-0 bottom-[14px] text-center font-hi font-extrabold text-[16px]">{l}</span></div>)}</div>
        <button onClick={() => go('part')} className="w-full text-center mt-2"><T hi="सामान चाहिए" en="Needs a part" className="items-center text-[18px] underline" sub="text-[11px] text-mid" /></button>
      </Shell>),
    part: (
      <Shell {...sh} speak="कौन सा सामान चाहिए?" onBack={back} hiTitle="कौन सा सामान चाहिए?" enTitle="Which part is needed?" fieldH={200} foot={<Foot hi="आगे" en="Next" go={() => go('stock')} />}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2">{PARTS.map(([a, b, art], k) => (
          <button key={b} onClick={() => setPart(k)} className="relative h-[150px] flex flex-col items-center justify-center">
            {part === k && <Art n="sel" className="absolute inset-0 m-auto" w={140} />}
            <Art n={art} w={64} className="relative" /><T hi={a} en={b} className="items-center text-[17px] relative mt-1" sub="text-[10.5px] text-mid" />
            {part === k && <Art n="tick" w={30} className="absolute right-6 top-2" />}</button>))}</div>
      </Shell>),
    stock: (
      <Shell {...sh} speak="स्टॉक देखें" onBack={back} hiTitle="स्टॉक देखें" enTitle="Stock status" fieldH={200} foot={<Foot hi="रिज़र्व करें" en="Reserve" go={() => go('reserved')} />}>
        {([['स्टोर', 2], ['पास का ब्लॉक', 1]] as const).map(([n, c]) => <div key={n} className="mt-2"><div className="font-hi font-extrabold text-[15px]">{n}</div>
          <div className="relative"><div className="flex gap-3 items-end h-[88px]">{[0, 1, 2].map(i => <Art key={i} n={i < c ? 'shelf-2' : 'shelf-4'} w={86} />)}</div><Art n="shelf-3" className="w-full" /></div></div>)}
        <div className="flex gap-3 mt-4">{([['2', 'स्टोर में', 'in store', 'text-green'], ['1', 'पास के ब्लॉक में', 'next block', 'text-ember']] as const).map(([n, a, b, c]) => <div key={b} className="flex-1 rounded-[14px] border-[2.5px] border-navy bg-cream text-center py-2"><div className={`font-head font-extrabold text-[30px] leading-none ${c}`}>{n}</div><T hi={a} en={b} className="items-center text-[12px]" sub="text-[10px]" /></div>)}</div>
      </Shell>),
    reserved: (
      <Shell {...sh} speak="सामान रिज़र्व हो गया" onBack={back} hiTitle="सामान रिज़र्व हो गया" enTitle="Part reserved" fieldH={400}
        top={<div className="flex justify-center mt-2"><Beaver pose="cele" /></div>} foot={<Foot hi="अगला काम" en="Next job" go={() => reset('jobs')} />}>
        <ArtBox n="note" className="mt-3" style={{ width: '100%', height: 110 }}><div className="flex items-center gap-3 px-5 pt-6"><Art n="part-cap" w={40} /><T hi="कैपेसिटर कल सुबह 8:15 तक" en="Collect at the gate by 8:15 AM" className="text-[17px]" sub="text-[11px] text-mid" /></div></ArtBox>
      </Shell>),
    code: (
      <Shell {...sh} speak="विद्यार्थी से कोड पूछें" onBack={back} hiTitle="विद्यार्थी से कोड पूछें" enTitle="Ask the student for the code" fieldH={300}
        top={<ArtBox n="bubble" className="mx-auto mt-2" style={{ width: 'min(312px, 100%)', height: 130 }}><div className="pt-[26px]"><Dots value={digits} /></div></ArtBox>}>
        <Keypad onKey={k => { const n = k === '⌫' ? digits.slice(0, -1) : (digits + k).slice(0, 4); setDigits(n); setWrong(false); if (n.length === 4 && k !== '⌫') { if (n === CLOSING_CODE) setTimeout(() => { setDone(d => d + 1); go('done') }, 250); else setWrong(true) } }} />
        <div className="text-center mt-3">{wrong ? <T hi="ग़लत? फिर से डालें" en="Wrong? Try again" className="items-center text-[14px] text-ember" sub="text-[11px]" /> : <T hi="कोड विद्यार्थी के फ़ोन में है" en="The code is on the student's phone" className="items-center text-[13px]" sub="text-[10.5px] text-mid" />}
          <button onClick={() => go('photo')} className="mt-2 underline"><T hi="कोड नहीं मिला? फ़ोटो से बंद करें" en="No code? Close with a photo" className="items-center text-[13px]" sub="text-[10.5px] text-mid" /></button></div>
      </Shell>),
    photo: (
      <Shell {...sh} speak="फ़ोटो से बंद करें" onBack={back} hiTitle="फ़ोटो से बंद करें" enTitle="Close with a photo" fieldH={330}
        top={<div className="flex justify-center mt-2"><Art n="camera" /></div>}
        foot={<Foot hi="फ़ोटो खींचें" en="Take photo" icon="📷︎" go={() => { setDone(d => d + 1); go('done') }} />}>
        <div className="mt-2 text-center"><T hi="ठीक किए हुए पंखे की फ़ोटो" en="A photo of the fixed fan" className="items-center text-[18px]" sub="text-[11px] text-mid" /></div>
        <ArtBox n="note" className="mt-4" style={{ width: '100%', height: 84 }}><div className="px-5 pt-5"><T hi="सुपरवाइज़र फ़ोटो देखेंगे" en="The supervisor checks it before it closes" className="text-[16px]" sub="text-[11px] text-mid" /></div></ArtBox>
      </Shell>),
    done: (
      <Shell {...sh} speak="काम पूरा!" hiTitle="काम पूरा!" enTitle="Job closed · BG04" fieldH={400}
        top={<div className="relative flex justify-center mt-1"><Beaver pose="cele" /><Art n="spark" className="absolute left-[18%] top-6" /><Art n="spark" className="absolute right-[16%] top-0" /></div>}
        foot={<Foot hi="अगला काम" en="Next job" go={() => (done >= 3 ? reset('last') : reset('jobs'))} />}>
        <div className="flex justify-center gap-3 mt-4">{[0, 1, 2, 3].map(i => i <= done ? <Art key={i} n="stop" w={36} /> : <span key={i} className="w-[36px] h-[36px] rounded-full border-2 border-navy bg-cream" />)}</div>
        <div className="text-center mt-3"><T hi={`आज 4 में से ${done + 1} हो गए`} en={`${done + 1} of 4 jobs done today`} className="items-center text-[19px]" sub="text-[11px] text-mid" /></div>
      </Shell>),
    last: (
      <Shell {...sh} speak="आज का काम पूरा!" hiTitle="आज का काम पूरा!" enTitle="All done today" fieldH={400}
        top={<div className="relative flex justify-center mt-1"><Beaver pose="jump" /><Art n="spark" className="absolute left-[22%] top-8" /><Art n="spark" className="absolute right-[20%] top-2" /></div>} foot={<Foot hi="घर" en="Home" go={() => reset('lang')} />}>
        <div className="mt-6 text-center"><T hi="कोई नया काम नहीं" en="New jobs show up here." className="items-center text-[19px]" sub="text-[11px] text-mid" /></div>
      </Shell>),
    reopen: (
      <Shell {...sh} speak="काम फिर खुला" onBack={back} hiTitle="काम फिर खुला" enTitle="Job reopened" fieldH={300}
        top={<div className="flex items-end justify-between mt-1"><div><div className="font-mono text-[64px] leading-none">BG04</div><span className="inline-block mt-2 px-3 h-7 rounded-full border-2 border-navy bg-cream font-hi text-[12px] leading-[24px]">फिर से</span></div><Art n="again" w={92} /></div>}
        foot={<Foot hi="काम देखें" en="View job" go={() => go('job')} />}>
        <ArtBox n="note" className="mt-2" style={{ width: '100%', height: 100 }}><div className="flex gap-3 items-center px-5 pt-6"><Speaker text="विद्यार्थी ने बताया पंखा फिर रुक गया" /><T hi="विद्यार्थी ने बताया" en="Fan stopped again" className="text-[17px]" sub="text-[11px] text-mid" /></div></ArtBox>
        <div className="mt-3 rounded-[14px] bg-sky border-[2.5px] border-navy p-3 flex items-center gap-3"><Art n="part-cap" w={26} /><T hi="पिछली बार: कैपेसिटर बदला" en="Last time: capacitor replaced" className="text-[14px]" sub="text-[11px] text-mid" /></div>
      </Shell>),
    slot: (
      <Shell {...sh} speak="समय बदल गया" onBack={back} hiTitle="समय बदल गया" enTitle="Slot changed" fieldH={200} foot={<Foot hi="ठीक है" en="OK" go={() => reset('jobs')} />}>
        <div className="relative mt-2 mx-auto" style={{ width: 300, height: 130 }}><Art n="was" className="absolute inset-0" /><div className="absolute left-5 top-4 font-hi text-[13px]">पहले</div><div className="absolute left-5 top-10 font-hi font-extrabold text-[30px]">रात 8:30</div></div>
        <div className="flex items-center justify-center gap-3 mt-1"><Art n="down" w={30} /><span className="font-hi text-[14px]">विद्यार्थी ने बदला</span></div>
        <div className="mt-2 rounded-[20px] bg-sun border-[2.5px] border-navy p-5"><div className="font-hi text-[13px]">अब</div><div className="font-hi font-extrabold text-[36px]">रात 9:00</div></div>
      </Shell>),
    history: (
      <Shell {...sh} speak="इस पंखे का इतिहास" onBack={back} hiTitle="इस पंखे का इतिहास" enTitle="History of this fan" fieldH={200} top={<div className="font-mono text-[40px] text-center leading-none -mt-1">BG04</div>}>
        <div className="space-y-3 pt-2">{[['कैपेसिटर बदला', 'Capacitor replaced', '3 हफ़्ते पहले'], ['पंखा साफ़ किया', 'Cleaned', '2 महीने पहले'], ['बेयरिंग की आवाज़', 'Bearing noise', '5 महीने पहले']].map(([a, b, w]) => <div key={b} className="rounded-[14px] border-[2.5px] border-navy bg-cream p-3 flex items-center gap-3"><Art n="repair" w={34} /><div><T hi={a} en={b} className="text-[17px]" sub="text-[11px] text-mid" /><span className="font-hi text-[11px] text-ember">{w}</span></div></div>)}</div>
        <div className="font-hi font-extrabold text-[18px] mt-4">3 बार, 5 महीने में</div>
      </Shell>),
    profile: (
      <Shell {...sh} speak="मेरा प्रोफ़ाइल" onBack={back} hiTitle="मेरा प्रोफ़ाइल" enTitle="My profile" fieldH={300}
        top={<ArtBox n="badge" className="mx-auto mt-2" style={{ width: 'min(342px, 100%)', height: 120 }}><div className="flex items-center gap-3 px-6 pt-[34px]"><span className="w-12 h-12 rounded-full bg-sun border-2 border-navy flex items-center justify-center font-head font-extrabold text-[22px]">R</span><div><div className="font-hi font-extrabold text-[26px] leading-none">रवि</div><div className="font-mono text-[12px]">Ravi · 014</div></div></div></ArtBox>}>
        <div className="flex gap-3 mt-3"><div className="flex-1"><T hi="आज की शिफ़्ट" en="Today's shift" className="text-[13px]" sub="text-[10px]" /><div className="rounded-[10px] bg-sun2 border-2 border-navy p-2 font-hi text-[13px] mt-1">शाम 5 से रात 10</div></div><div><T hi="मेरे ब्लॉक" en="My blocks" className="text-[13px]" sub="text-[10px]" /><div className="flex gap-1 mt-1">{['BG', 'F', 'C'].map(b => <span key={b} className="px-2.5 py-2 bg-sky border-2 border-navy rounded-[8px] font-mono text-[12px]">{b}</span>)}</div></div></div>
        <div className="mt-4"><T hi="भाषा" en="Language" className="items-center text-[13px]" sub="text-[10px]" /><div className="flex mt-1 rounded-full border-[2.5px] border-navy overflow-hidden">{([['hi', 'हिंदी'], ['en', 'English']] as const).map(([l, t]) => <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 font-hi font-extrabold text-[14px] ${lang === l ? 'bg-sun' : 'bg-cream'}`}>{t}</button>)}</div></div>
        <div className="flex items-end justify-between mt-5"><Beaver pose="stand" /><button onClick={() => reset('lang')} className="underline"><T hi="बाहर निकलें" en="Log out" className="items-center text-[15px]" sub="text-[10px]" /></button></div>
      </Shell>),
    eOffline: (
      <Shell {...sh} speak="इंटरनेट नहीं है" fieldH={330} top={<div className="flex justify-center mt-4"><Beaver pose="sit" /></div>} foot={<Foot hi="फिर कोशिश करें" en="Try again" go={back} />}>
        <div className="text-center mt-6"><T hi="इंटरनेट नहीं है" en="No internet" className="items-center text-[24px]" sub="text-[12px] text-mid" /><p className="font-hi text-[13px] mt-10">आपका काम फ़ोन में सुरक्षित है। नेट आते ही अपने आप चला जाएगा।</p><p className="text-[11px] text-mid mt-1">Your work is saved on the phone. It sends itself when the net is back.</p></div>
      </Shell>),
    eServer: (
      <Shell {...sh} speak="कुछ गड़बड़ हो गई" fieldH={330} top={<div className="flex justify-center mt-4"><Beaver pose="think" /></div>} foot={<Foot hi="फिर कोशिश करें" en="Try again" go={back} />}>
        <div className="text-center mt-6"><T hi="कुछ गड़बड़ हो गई" en="Something went wrong" className="items-center text-[24px]" sub="text-[12px] text-mid" /><p className="font-hi text-[13px] mt-10">ग़लती हमारी तरफ़ से है। आपका काम सुरक्षित है।</p><p className="text-[11px] text-mid mt-1">The fault is on our side. Your work is safe.</p></div>
      </Shell>),
  }
  return <LangCtx.Provider value={lang}><Phone bg="#FFFBF3"><Transition id={nav.screen} dir={nav.dir} mode="slide">{view[nav.screen]}</Transition></Phone></LangCtx.Provider>
}
