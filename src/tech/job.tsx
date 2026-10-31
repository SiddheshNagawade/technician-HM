import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Camera, DoorClosed, UserX, PhoneCall, MapPin, Clock3, ShieldAlert, KeyRound, History, PackageSearch, Warehouse, Building2, RotateCcw, ArrowDown, StickyNote, Timer, Sparkles, Plus } from '../ds/icons'
import { Art, Avatar, Beaver, Keypad, Tag, Tooltip, cx, Choice } from '../ds/ui'
import { Drop, Rise, Pop, Shake, Ink, spring, springPop } from '../ds/motion'
import { fx } from '../ds/fx'
import { Big, Shell, Small, Speaker, T, useApp, useLang } from './shell'
import { activeJob, finishActive, store, PARTS, setJob } from './store'

const L = (lang: string, hi: string, en: string) => (lang === 'hi' ? hi : en)

export function Job() {
  const { nav } = useApp()
  const lang = useLang(); store.use(s => s.activeId)
  const j = activeJob()
  return (
    <Shell voice="job" field="pb-2"
      top={<div className="mt-2 flex items-end justify-between"><div><div className={cx('font-mono font-medium leading-[0.9] tracking-[-0.02em]', j.room.length > 6 ? 'text-[44px]' : 'text-[64px]')}>{j.room}</div><div className="mt-1 text-[16px] font-semibold">{j.bhawan}</div></div><Art n={j.art} w={86} /></div>}
      foot={<><Big hi="सफ़र शुरू करें" en="Start trip" onClick={() => nav.go('trip', { tr: 'wave' })} /><Small hi="मैं ये काम नहीं कर पाऊँगा" en="I can't make this visit" onClick={() => nav.go('cant')} /></>}>
      <Rise><T hi={j.issueHi} en={`${j.item} · ${j.issue}`} size="lg" /></Rise>
      <Rise delay={0.05} className="mt-3 flex flex-wrap gap-2"><Tag tone="sun" icon={<Clock3 size={14} />}>{L(lang, j.timeHi, j.time)} – {L(lang, '30 मिनट', '30 min')}</Tag>{j.access === 'warden' ? <Tag tone="warn" icon={<KeyRound size={14} />}>{L(lang, 'वार्डन कमरा खोलेंगे', 'Warden opens the room')}</Tag> : <Tag tone="success" icon={<Check size={14} />}>{L(lang, 'विद्यार्थी कमरे में होंगे', 'Student will be in')}</Tag>}</Rise>
      {j.note && (
        <Drop delay={0.12} className="mt-4">
          <div className="relative flex items-center gap-3 rounded-[6px] border-2 border-navy bg-sun2 p-4 shadow-card">
            <span className="absolute -top-2.5 left-8 h-4 w-14 bg-sun/80" />
            <Speaker k="note" size={46} variant="sun" label="Hear the student's message" />
            <div className="min-w-0"><div className="text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{L(lang, `${j.student} का संदेश`, `From ${j.student}`)}</div><div className={cx('text-[17px] font-semibold leading-snug', lang === 'hi' && 'font-hi')}>{L(lang, j.noteHi, j.note)}</div></div>
          </div>
        </Drop>
      )}
      {j.girls && (
        <Rise delay={0.18} className="mt-3 flex items-start gap-3 rounded-[16px] border-2 border-navy bg-sky2 p-3.5">
          <ShieldAlert size={22} className="mt-0.5 shrink-0 text-signal2" /><T size="sm" hi="लड़कियों का भवन: गेट पर अटेंडेंट आपके साथ चलेंगी। वो आ रही हैं।" en="Girls' Bhawan: an attendant walks with you from the gate. She has been told." />
        </Rise>
      )}
      <Rise delay={0.22} className="mt-3">
        <button onClick={() => { fx.tap(); nav.go('history') }} className="flex w-full items-center gap-3 rounded-[16px] border-2 border-line bg-paper p-3.5 text-left hover:border-navy/50">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-sand"><History size={20} /></span>
          <T size="sm" hi={`पिछली बार: ${j.history[0]?.whatHi || 'कोई काम नहीं'}`} en={`Last time: ${j.history[0]?.what || 'no earlier repairs'}`} className="flex-1" />
          {j.history.length > 0 && <Tag tone="warn">{j.history.length}×</Tag>}
        </button>
      </Rise>
      <Rise delay={0.26} className="mb-3 mt-3 flex items-center gap-3 rounded-[16px] bg-green2 p-3.5"><Sparkles size={20} className="text-green" /><T size="sm" hi="शायद कैपेसिटर चाहिए · आपके बैग में है" en="Likely needs a capacitor · it is in your bag" /></Rise>
    </Shell>
  )
}

export function Trip() {
  const { nav, toast } = useApp()
  const lang = useLang(); const j = activeJob()
  useEffect(() => { const t = setTimeout(() => toast({ kind: 'sticky', tone: 'sky', title: L(lang, 'विद्यार्थी को बता दिया', 'Student has been told'), body: L(lang, `${j.student} को संदेश गया: आप 10 मिनट में आ रहे हैं`, `${j.student} got an alert: you are 10 minutes away`), icon: <Check size={22} /> }), 900); return () => clearTimeout(t) }, [])
  return (
    <Shell voice="trip" title={{ hi: 'रास्ते में', en: 'On the way' }} sub={<Tag tone="dark" icon={<Clock3 size={14} />}>{L(lang, 'लगभग 6 मिनट पैदल', 'About 6 min walk')}</Tag>}
      foot={<><Big hi="पहुँच गया" en="I have arrived" onClick={() => { store.set({ workStart: Date.now(), steps: [], photos: 0 }); nav.go('work', { tr: 'wave' }) }} /><Small hi="अंदर नहीं जा पा रहे?" en="Can't get in?" onClick={() => nav.go('cant')} /></>}>
      <div className="relative h-[330px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 350 330" fill="none">
          <Ink d="M40 300 C 70 230, 170 270, 180 200 S 120 110, 210 90 S 300 60, 300 40" dash="2 10" width={4} />
        </svg>
        <div className="absolute bottom-[14px] left-[16px] flex flex-col items-center"><span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-navy bg-sun font-hi text-[14px] font-extrabold">{L(lang, 'आप', 'You')}</span></div>
        <motion.div className="absolute" initial={{ left: 30, top: 270 }} animate={{ left: [30, 150, 170, 240, 278], top: [270, 230, 175, 100, 30] }} transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}>
          <Beaver pose="walk" size={58} />
        </motion.div>
        <div className="absolute right-0 top-0 flex flex-col items-end"><span className="flex h-14 w-14 items-center justify-center rounded-[16px] border-2 border-navy bg-paper"><MapPin size={28} /></span><span className="mt-1 font-mono text-[18px] font-medium">{j.room.split(',')[0]}</span><span className="text-[13px] text-mid">{j.bhawan}</span></div>
      </div>
    </Shell>
  )
}

export function Cant() {
  const { nav } = useApp()
  const lang = useLang()
  const opts = [
    { i: <DoorClosed size={26} />, hi: 'दरवाज़ा बंद है', en: 'Door is locked', go: () => nav.go('nobody', { tr: 'wave' }) },
    { i: <UserX size={26} />, hi: 'कोई नहीं है', en: 'Nobody is here', go: () => nav.go('nobody', { tr: 'wave' }) },
    { i: <PhoneCall size={26} />, hi: 'सुपरवाइज़र को फ़ोन', en: 'Call the supervisor', go: () => { location.href = 'tel:0133228' } },
  ]
  return (
    <Shell voice="cant" title={{ hi: 'अंदर नहीं जा पा रहे?', en: "Can't get in?" }}>
      <div className="flex flex-col gap-3">
        {opts.map((o, i) => (
          <Drop key={o.en} delay={i * 0.07}>
            <motion.button onClick={() => { fx.select(); o.go() }} whileTap={{ y: 3, boxShadow: '0 0 0 #00224E' }} className="flex min-h-[84px] w-full items-center gap-4 rounded-[20px] border-2 border-navy bg-paper px-4 text-left shadow-btn">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-sky2">{o.i}</span><T hi={o.hi} en={o.en} size="lg" />
            </motion.button>
          </Drop>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-[16px] bg-sand p-4"><T hi="घबराइए मत, हम संभाल लेंगे" en="Don't worry, we'll sort it out" size="sm" /><Beaver pose="think" size={64} /></div>
    </Shell>
  )
}

export function Nobody() {
  const { nav } = useApp()
  const lang = useLang(); const j = activeJob()
  const steps = [['नोटिस छोड़ा', 'Notice left', true], ['विद्यार्थी नया समय चुनेंगे', 'Student picks a new time', false], ['दूसरा दौरा', 'Second visit', false]] as const
  return (
    <Shell voice="nobody" title={{ hi: 'विद्यार्थी नहीं मिले', en: "Student wasn't in" }} foot={<Big hi="अगला काम" en="Next job" onClick={() => { finishActive('missed'); nav.reset('jobs', { tr: 'wave' }) }} />}>
      <div className="relative flex h-[150px] items-start gap-4">
        <Art n="door" w={96} />
        <Drop delay={0.2} className="mt-3 w-[190px]"><div className="relative rounded-[4px] border-2 border-navy bg-sun p-3 shadow-card"><span className="absolute -top-2 left-1/2 h-3.5 w-12 -translate-x-1/2 bg-paper/80" /><p className={cx('text-[15px] font-semibold leading-snug', lang === 'hi' && 'font-hi')}>{L(lang, `${j.student}, आपका ${j.itemHi} देखने आए थे। नया समय चुनें।`, `${j.student}, we came for your ${j.item.toLowerCase()}. Pick a new time.`)}</p></div></Drop>
      </div>
      <p className="mb-3 mt-2 text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{L(lang, 'आगे क्या होगा', 'What happens now')}</p>
      <div className="flex flex-col gap-3">
        {steps.map(([hi, en, d], i) => (
          <Rise key={en} delay={0.1 + i * 0.07} className="flex items-center gap-3">
            <span className={cx('flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy', d ? 'bg-green text-white' : 'bg-paper')}>{d ? <Check size={16} strokeWidth={3.5} /> : <span className="font-head text-[14px] font-bold">{i + 1}</span>}</span>
            <T hi={hi} en={en} size="sm" />
          </Rise>
        ))}
      </div>
      <Rise delay={0.35} className="mt-5 flex items-center gap-3 rounded-[16px] bg-green2 p-3.5"><StickyNote size={20} className="text-green" /><T size="sm" hi="विद्यार्थी को संदेश चला गया" en="The student has been messaged" /></Rise>
    </Shell>
  )
}

function useClock(start: number) {
  const [n, setN] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(t) }, [])
  const s = Math.max(0, Math.floor((n - start) / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
export function Work() {
  const { nav } = useApp()
  const lang = useLang(); const s = store.use(x => x); const j = activeJob()
  const time = useClock(s.workStart)
  const STEPS = [['MCB बंद करें', 'Switch off the MCB', 'ic-off'], ['कैपेसिटर जाँचें', 'Check the capacitor', 'ic-cap'], ['चलाकर देखें', 'Test run all speeds', 'ic-test']] as const
  const toggle = (i: number) => { const on = s.steps.includes(i); on ? fx.deselect() : fx.check(); store.set({ steps: on ? s.steps.filter(x => x !== i) : [...s.steps, i] }) }
  return (
    <Shell voice="work" field="pb-1"
      top={<div className="mt-1 flex items-center justify-between"><div><div className="flex items-center gap-2 text-[14px] font-bold"><motion.span className="h-2.5 w-2.5 rounded-full bg-ember" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />{L(lang, 'काम चल रहा है', 'Working')}</div><div className="font-mono text-[56px] font-medium leading-none tabular">{time}</div></div><div className="text-right"><div className="font-mono text-[24px] font-medium">{j.room.split(',')[0]}</div><div className="text-[13px] font-semibold">{L(lang, j.itemHi, j.item)}</div></div></div>}
      foot={<Big hi="काम पूरा" en="Work is done" onClick={() => nav.go('code', { tr: 'wave' })} />}>
      <div className="flex flex-col gap-2.5">
        {STEPS.map(([hi, en, ic], i) => {
          const on = s.steps.includes(i)
          return (
            <motion.button key={en} onClick={() => toggle(i)} whileTap={{ scale: 0.98 }} aria-pressed={on}
              className={cx('flex min-h-[68px] w-full items-center gap-3 rounded-[18px] border-2 px-4 text-left transition-colors', on ? 'border-navy bg-green2' : 'border-line bg-paper')}>
              <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-navy transition-colors', on ? 'bg-green text-white' : 'bg-paper')}>{on ? <Pop><Check size={18} strokeWidth={3.5} /></Pop> : <span className="font-head text-[15px] font-bold">{i + 1}</span>}</span>
              <T hi={hi} en={en} size="md" className={cx('flex-1', on && 'opacity-70')} /><Art n={ic} w={30} />
            </motion.button>
          )
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[['पहले', 'Before'], ['बाद में', 'After']].map(([hi, en], i) => {
          const has = s.photos > i
          return (
            <motion.button key={en} onClick={() => { if (!has) { fx.shutter(); store.set({ photos: Math.max(s.photos, i + 1) }) } }} whileTap={{ scale: 0.96 }}
              className={cx('relative flex h-[118px] flex-col items-center justify-center gap-1 rounded-[16px] border-2', has ? 'border-navy bg-paper p-1.5' : 'border-dashed border-navy/40 bg-paper')}>
              {has ? <motion.div initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springPop} className="flex h-full w-full flex-col items-center justify-center rounded-[10px] bg-sand"><Art n="photo-fan" w={70} /><span className="text-[12px] font-semibold">{L(lang, hi, en)} ✓</span></motion.div>
                : <><Camera size={26} /><T hi={`${hi} की फ़ोटो`} en={`${en} photo`} size="sm" align="center" /></>}
            </motion.button>
          )
        })}
      </div>
      <button onClick={() => { fx.tap(); nav.go('part') }} className="mb-3 mt-4 flex min-h-[60px] w-full items-center gap-3 rounded-[18px] border-2 border-navy bg-sun2 px-4 text-left shadow-btn active:translate-y-[3px] active:shadow-none">
        <PackageSearch size={24} /><T hi="सामान चाहिए" en="Needs a part" size="md" className="flex-1" /><Plus size={22} />
      </button>
    </Shell>
  )
}

export function Part() {
  const { nav } = useApp()
  const sel = store.use(s => s.part)
  return (
    <Shell voice="part" title={{ hi: 'कौन सा सामान चाहिए?', en: 'Which part is needed?' }} foot={<Big hi="आगे" en="Next" onClick={() => nav.go('stock')} />}>
      <div className="grid grid-cols-2 gap-3 pb-4">
        {PARTS.map((p, i) => <Rise key={p.id} delay={i * 0.03}><Choice tone="sky" on={sel === p.id} onClick={() => store.set({ part: p.id })} art={<Art n={p.art} w={54} style={{ maxHeight: 60, width: 'auto' }} />} title={<T hi={p.hi} en={p.en} size="sm" align="center" />} className="!min-h-[150px]" /></Rise>)}
      </div>
    </Shell>
  )
}

export function Stock() {
  const { nav } = useApp()
  const lang = useLang(); const p = PARTS.find(x => x.id === store.use(s => s.part)) || PARTS[0]
  const rows = [{ hi: 'मुख्य स्टोर (IWD)', en: 'Main store (IWD)', n: p.store, icon: <Warehouse size={22} /> }, { hi: 'पास का ब्लॉक', en: 'Nearby block store', n: p.near, icon: <Building2 size={22} /> }]
  const none = p.store + p.near === 0
  return (
    <Shell voice="stock" title={{ hi: 'स्टॉक देखें', en: 'Stock status' }} sub={<div className="flex items-center gap-2"><Art n={p.art} w={30} /><T hi={p.hi} en={p.en} size="sm" /></div>}
      foot={<Big hi={none ? 'मँगवाएँ' : 'रिज़र्व करें'} en={none ? 'Order it' : 'Reserve'} onClick={() => nav.go('reserved', { tr: 'wave' })} />}>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <Drop key={r.en} delay={i * 0.08}>
            <div className="rounded-[18px] border-2 border-navy bg-paper p-4">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-sand">{r.icon}</span><T hi={r.hi} en={r.en} size="md" className="flex-1" />
                <span className={cx('font-head text-[34px] font-extrabold leading-none', r.n ? 'text-green' : 'text-ember')}>{r.n}</span></div>
              <div className="mt-3 flex gap-1.5">{Array.from({ length: Math.max(6, r.n) }, (_, k) => <motion.span key={k} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ ...springPop, delay: 0.2 + k * 0.04 }} className={cx('h-7 flex-1 origin-bottom rounded-[6px] border-2', k < r.n ? 'border-navy bg-sky' : 'border-dashed border-navy/25')} />)}</div>
            </div>
          </Drop>
        ))}
      </div>
      <p className="mb-3 mt-4 text-center text-[14px] text-mid">{L(lang, none ? 'स्टॉक में नहीं है · 2 से 3 दिन लगेंगे' : 'आज रात आपके लिए रख दिया जाएगा', none ? 'Not in stock · takes 2 to 3 days' : 'It will be kept aside for you tonight')}</p>
    </Shell>
  )
}

export function Reserved() {
  const { nav } = useApp()
  const lang = useLang(); const p = PARTS.find(x => x.id === store.use(s => s.part)) || PARTS[0]
  return (
    <Shell voice="reserved" tone="green" title={{ hi: 'सामान रख दिया गया', en: 'Part reserved' }} top={<div className="flex justify-center"><Beaver pose="cele" size={120} bob /></div>}
      foot={<Big hi="अगला काम" en="Next job" onClick={() => { finishActive('part'); nav.reset('jobs', { tr: 'wave' }) }} />}>
      <Drop><div className="flex items-center gap-4 rounded-[20px] border-2 border-navy bg-paper p-4 shadow-btn"><Art n={p.art} w={50} /><T hi={`${p.hi} · कल सुबह 8:15 तक गेट पर`} en={`${p.en} · collect at the gate by 8:15 AM`} size="md" /></div></Drop>
      <Rise delay={0.15} className="mt-3 flex items-center gap-3 rounded-[16px] bg-green2 p-3.5"><Check size={20} className="text-green" /><T size="sm" hi="विद्यार्थी को बता दिया, नया समय कल" en="Student told · new visit tomorrow" /></Rise>
    </Shell>
  )
}

export function Code() {
  const { nav, toast } = useApp()
  const lang = useLang(); const j = activeJob()
  const [v, setV] = useState(''); const [err, setErr] = useState(0); const [tries, setTries] = useState(3)
  useEffect(() => { const h = (e: Event) => setV((e as CustomEvent).detail); addEventListener('align-code', h); return () => removeEventListener('align-code', h) }, [])
  useEffect(() => {
    if (v.length < 4) return
    if (v === j.code) { fx.success(); setTimeout(() => { finishActive('done'); nav.reset('done', { tr: 'wave' }) }, 450) }
    else { fx.error(); setErr(e => e + 1); setTries(t => t - 1); setTimeout(() => setV(''), 650); if (tries <= 1) toast({ kind: 'sticky', tone: 'ember', title: L(lang, 'तीन बार ग़लत', 'Three wrong tries'), body: L(lang, 'फ़ोटो से बंद करें', 'Close with a photo instead') }) }
  }, [v])
  return (
    <Shell voice="code" title={{ hi: 'विद्यार्थी से कोड पूछें', en: 'Ask the student for the code' }}
      top={<Shake k={err} className="mt-4"><div className="relative mx-auto max-w-[300px] rounded-[22px] border-2 border-navy bg-paper p-4 shadow-btn"><div className="flex justify-center gap-2.5">{Array.from({ length: 4 }, (_, i) => <motion.span key={i} animate={{ scale: v[i] ? [1.15, 1] : 1 }} transition={springPop} className={cx('flex h-[58px] w-[50px] items-center justify-center rounded-[14px] border-2 font-mono text-[30px]', err && v.length === 4 ? 'border-ember bg-ember2 text-ember' : v[i] ? 'border-navy bg-sky2' : i === v.length ? 'border-navy' : 'border-navy/25')}>{v[i] || ''}</motion.span>)}</div><span className="absolute -bottom-[12px] left-10 h-5 w-5 rotate-45 border-b-2 border-r-2 border-navy bg-paper" /></div></Shake>}>
      <div className="mb-3 h-6 text-center text-[14px] font-semibold">{err > 0 && v.length < 4 ? <span className="text-ember">{L(lang, `ग़लत कोड · ${tries} बार और`, `Wrong code · ${tries} tries left`)}</span> : <span className="text-mid">{L(lang, 'कोड विद्यार्थी के फ़ोन पर है', "The code is on the student's phone")}</span>}</div>
      <Keypad tone="sky" onKey={d => setV(x => (x + d).slice(0, 4))} onDelete={() => setV(x => x.slice(0, -1))} />
      <Small hi="कोड नहीं मिला? फ़ोटो से बंद करें" en="No code? Close with a photo" onClick={() => nav.go('photo')} />
    </Shell>
  )
}

export function Photo() {
  const { nav } = useApp()
  const lang = useLang(); const j = activeJob()
  const [shot, setShot] = useState(false)
  return (
    <Shell voice="photo" title={{ hi: 'फ़ोटो से बंद करें', en: 'Close with a photo' }}
      foot={shot ? <Big hi="सुपरवाइज़र को भेजें" en="Send to the supervisor" sound="success" onClick={() => { finishActive('done'); nav.reset('done', { tr: 'wave' }) }} /> : <Big hi="फ़ोटो खींचें" en="Take the photo" icon={<Camera size={26} />} onClick={() => { fx.shutter(); setShot(true) }} />}>
      <div className="relative mx-auto flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[20px] border-2 border-navy bg-navy">
        <AnimatePresence mode="wait">
          {shot ? <motion.div key="s" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="flex h-full w-full items-center justify-center bg-sand"><Art n="photo-fan" w={170} /></motion.div>
            : <motion.div key="v" className="flex h-full w-full items-center justify-center"><Art n="camera" w={120} className="opacity-90" />{['left-3 top-3 border-l-4 border-t-4', 'right-3 top-3 border-r-4 border-t-4', 'left-3 bottom-3 border-l-4 border-b-4', 'right-3 bottom-3 border-r-4 border-b-4'].map(c => <span key={c} className={cx('absolute h-8 w-8 rounded-[4px] border-sun', c)} />)}</motion.div>}
        </AnimatePresence>
      </div>
      <div className="mb-3 mt-4 text-center"><T align="center" size="md" hi={`ठीक किए हुए ${j.itemHi} की साफ़ फ़ोटो`} en={`A clear photo of the fixed ${j.item.toLowerCase()}`} /><p className="mt-2 text-[14px] text-mid">{L(lang, 'सुपरवाइज़र फ़ोटो देखकर काम बंद करेंगे', 'The supervisor checks it, then closes the job')}</p></div>
    </Shell>
  )
}

export function Done() {
  const { nav } = useApp()
  const lang = useLang(); const jobs = store.use(s => s.jobs)
  const done = jobs.filter(j => j.status !== 'queued' && j.status !== 'next').length
  const more = jobs.some(j => j.status === 'next')
  return (
    <Shell voice="done" tone="green" back={false} title={{ hi: 'काम पूरा!', en: 'Job closed!' }} top={<div className="relative flex justify-center"><Beaver pose="cele" size={140} bob />{[0, 1, 2, 3, 4, 5].map(i => <motion.span key={i} className="absolute h-3 w-3 rounded-[3px] border-2 border-navy" style={{ background: ['#FFD265', '#BDDDFF', '#FFFBF3'][i % 3], left: '50%', top: '40%' }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(i) * 130, y: Math.sin(i * 2) * 70 - 40, rotate: 200, opacity: 0 }} transition={{ duration: 1.1, delay: 0.3 }} />)}</div>}
      foot={<Big hi={more ? 'अगला काम' : 'आज का काम पूरा'} en={more ? 'Next job' : 'Finish for today'} onClick={() => nav.reset(more ? 'jobs' : 'last', { tr: 'wave' })} />}>
      <div className="flex justify-center gap-3">{jobs.map((j, i) => <motion.span key={j.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springPop, delay: 0.3 + i * 0.1 }} className={cx('flex h-11 w-11 items-center justify-center rounded-full border-2 border-navy', i < done ? 'bg-green text-white' : 'bg-paper')}>{i < done && <Check size={20} strokeWidth={3.5} />}</motion.span>)}</div>
      <div className="mt-4"><T align="center" size="lg" hi={`आज ${jobs.length} में से ${done} हो गए`} en={`${done} of ${jobs.length} jobs done today`} /></div>
      <Rise delay={0.5} className="mt-5 flex items-center gap-3 rounded-[16px] bg-green2 p-3.5"><Check size={20} className="text-green" /><T size="sm" hi="विद्यार्थी ने कोड दिया, सुपरवाइज़र को रिकॉर्ड मिल गया" en="Closed with the student's code · supervisor has the record" /></Rise>
    </Shell>
  )
}

export function Last() {
  const { nav } = useApp()
  return (
    <Shell voice="last" tone="green" back={false} title={{ hi: 'आज का काम पूरा!', en: 'All done for today!' }} top={<div className="flex justify-center"><Beaver pose="jump" size={150} bob /></div>}
      foot={<Big variant="paper" hi="आज के काम देखें" en="See today's jobs" onClick={() => nav.reset('jobs', { tr: 'wave' })} />}>
      <div className="mt-2"><T align="center" size="md" hi="कोई नया काम आएगा तो यहीं दिखेगा" en="New jobs will show up here" /></div>
    </Shell>
  )
}

export function Reopen() {
  const { nav } = useApp()
  const lang = useLang(); const j = activeJob()
  return (
    <Shell voice="reopen" tone="sun" title={{ hi: 'काम फिर खुला', en: 'Job reopened' }} top={<div className="mt-2 flex items-end justify-between"><div className="font-mono text-[60px] font-medium leading-none">{j.room.split(',')[0]}</div><span className="flex h-16 w-16 items-center justify-center rounded-[18px] border-2 border-navy bg-paper"><RotateCcw size={32} /></span></div>}
      foot={<Big hi="काम देखें" en="View job" onClick={() => nav.go('job', { tr: 'wave' })} />}>
      <Drop><div className="flex items-center gap-3 rounded-[6px] border-2 border-navy bg-sun2 p-4 shadow-card"><Speaker k="note" variant="sun" /><T hi="विद्यार्थी ने बताया: पंखा फिर रुक गया" en="Student says: the fan stopped again" size="md" /></div></Drop>
      <Rise delay={0.12} className="mt-3 flex items-center gap-3 rounded-[16px] border-2 border-navy bg-sky2 p-3.5"><Art n="part-cap" w={30} /><T hi="पिछली बार: कैपेसिटर बदला · 3 हफ़्ते पहले" en="Last time: capacitor replaced · 3 weeks ago" size="sm" /></Rise>
      <Rise delay={0.18} className="mt-3 flex items-center gap-3 rounded-[16px] bg-sand p-3.5"><History size={20} /><T size="sm" hi="सुपरवाइज़र ने इसे आज की सूची में सबसे ऊपर रखा" en="The supervisor moved it to the top of today's list" /></Rise>
    </Shell>
  )
}

export function Slot() {
  const { nav } = useApp()
  const lang = useLang()
  return (
    <Shell voice="slot" tone="sun" title={{ hi: 'समय बदल गया', en: 'Visit time changed' }} foot={<Big hi="ठीक है" en="OK" onClick={() => { store.set({ slotChanged: false }); nav.reset('jobs', { tr: 'wave' }) }} />}>
      <div className="rounded-[18px] border-2 border-dashed border-navy/40 bg-paper p-4 opacity-70"><div className="text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{L(lang, 'पहले', 'Before')}</div><div className={cx('text-[30px] font-extrabold line-through decoration-ember decoration-[3px]', lang === 'hi' ? 'font-hi' : 'font-head')}>{L(lang, 'शाम 6:00', '6:00 PM')}</div></div>
      <div className="my-2 flex items-center justify-center gap-2 text-[14px] font-semibold text-mid"><motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}><ArrowDown size={22} /></motion.span>{L(lang, 'विद्यार्थी ने बदला', 'The student changed it')}</div>
      <Drop delay={0.2}><div className="rounded-[20px] border-2 border-navy bg-sun p-5 shadow-btn"><div className="text-[13px] font-bold uppercase tracking-[0.08em]">{L(lang, 'अब', 'Now')}</div><div className={cx('text-[40px] font-extrabold leading-tight', lang === 'hi' ? 'font-hi' : 'font-head')}>{L(lang, 'शाम 7:00', '7:00 PM')}</div><div className="text-[15px]">Himalaya Bhawan · B-104</div></div></Drop>
      <p className="mb-3 mt-4 text-center text-[14px] text-mid">{L(lang, 'आपकी सूची अपने आप बदल गई है', 'Your list has been updated')}</p>
    </Shell>
  )
}

export function HistoryScreen() {
  const lang = useLang(); const j = activeJob()
  return (
    <Shell voice="history" title={{ hi: `इस ${j.itemHi} का इतिहास`, en: `History of this ${j.item.toLowerCase()}` }} sub={<span className="font-mono text-[24px] font-medium">{j.room.split(',')[0]} · {j.bhawan}</span>}>
      <ol className="relative ml-4 border-l-2 border-dashed border-navy/30 pl-6">
        {(j.history.length ? j.history : [{ what: 'No earlier repairs', whatHi: 'पहले कोई काम नहीं', when: '', whenHi: '' }]).map((h, i) => (
          <Rise key={h.what} delay={i * 0.07} className="relative mb-4">
            <span className="absolute -left-[35px] top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-navy bg-sun" />
            <div className="rounded-[16px] border-2 border-navy bg-paper p-3.5"><T hi={h.whatHi} en={h.what} size="md" />{h.when && <div className="mt-1 text-[13px] font-semibold text-mid">{L(lang, h.whenHi, h.when)}</div>}</div>
          </Rise>
        ))}
      </ol>
      {j.history.length >= 3 && <Rise delay={0.3} className="mb-3 flex items-center gap-3 rounded-[16px] border-2 border-ember bg-ember2 p-3.5"><Timer size={20} className="text-ember" /><T size="sm" hi={`5 महीने में ${j.history.length} बार · पूरा पंखा बदलना ठीक रहेगा`} en={`${j.history.length} times in 5 months · consider replacing the fan`} /></Rise>}
    </Shell>
  )
}
export { Avatar, Tooltip, setJob }
