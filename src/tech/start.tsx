import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Lock, BadgeCheck, MapPin, Clock3, Users, KeyRound, ShieldAlert, PackageX, LogOut, Volume2, Languages, CalendarClock, UserRound, Wifi, X } from 'lucide-react'
import { Art, Avatar, Beaver, Keypad, OtpInput, Tag, Toggle, Tooltip, cx, IconButton } from '../ds/ui'
import { Drop, Rise, Pop, Shake, spring, springPop } from '../ds/motion'
import { fx, useMuted, setMuted } from '../ds/fx'
import { StatusBar } from '../ds/stage'
import { TECHS, code4 } from '../data/iitr'
import { Big, LangPill, Shell, Small, Speaker, T, useApp, useLang } from './shell'
import { BAG, store, Job } from './store'
import { playVoice, stopVoice } from './voice'

export function Lang() {
  const { nav } = useApp()
  const lang = useLang()
  const pick = (l: 'hi' | 'en') => { fx.select(); store.set({ lang: l }); setTimeout(() => nav.go('staff', { tr: 'wave' }), 220) }
  return (
    <div className="absolute inset-0 flex flex-col bg-signal">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center px-6 pt-[70px]">
        <Beaver pose="wave" size={130} bob />
        <Rise delay={0.1} className="mt-5 text-center"><div className="font-hi text-[34px] font-extrabold leading-tight">अपनी भाषा चुनें</div><div className="font-head text-[18px] font-bold opacity-80">Choose your language</div></Rise>
        <Rise delay={0.15} className="mt-4"><Speaker k="lang" size={56} variant="sun" /></Rise>
        <div className="mt-8 flex w-full flex-col gap-3">
          {([['hi', 'हिन्दी', 'Hindi', 'font-hi'], ['en', 'English', 'अंग्रेज़ी', 'font-head']] as const).map(([l, a, b, f], i) => (
            <Drop key={l} delay={0.2 + i * 0.08}>
              <motion.button onClick={() => pick(l)} whileTap={{ y: 3, boxShadow: '0 0 0 #00224E' }} aria-pressed={lang === l}
                className={cx('flex h-[88px] w-full items-center gap-4 rounded-[22px] border-2 border-navy px-4 text-left shadow-btn', lang === l ? 'bg-sun' : 'bg-paper')}>
                <span onClick={e => { e.stopPropagation(); fx.tap(); playVoice('lang', l) }} role="button" aria-label={`Hear ${b}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-signal2 text-white"><Volume2 size={24} /></span>
                <span className="flex-1"><span className={cx('block text-[36px] font-extrabold leading-none', f)}>{a}</span><span className="text-[15px] text-mid">{b}</span></span>
                {lang === l && <Pop><span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-cream"><Check size={18} strokeWidth={3.5} /></span></Pop>}
              </motion.button>
            </Drop>
          ))}
        </div>
        <p className="mt-auto pb-10 text-center font-hi text-[16px]">बाद में बदल सकते हैं<span className="block font-body text-[14px] opacity-75">You can change this later</span></p>
      </div>
    </div>
  )
}

const Digits = ({ v, n = 4, mask, error }: { v: string; n?: number; mask?: boolean; error?: boolean }) => (
  <div className="flex justify-center gap-2.5">
    {Array.from({ length: n }, (_, i) => (
      <motion.span key={i} animate={{ scale: v[i] ? [1.15, 1] : 1, y: i === v.length ? -3 : 0 }} transition={springPop}
        className={cx('flex h-[66px] w-[56px] items-center justify-center rounded-[16px] border-2 font-mono text-[32px] font-medium', error ? 'border-ember bg-ember2 text-ember' : v[i] ? 'border-navy bg-paper' : i === v.length ? 'border-navy bg-paper shadow-btn' : 'border-navy/30 bg-paper/70')}>
        {v[i] ? (mask ? '•' : v[i]) : ''}
      </motion.span>
    ))}
  </div>
)

export function Staff() {
  const { nav } = useApp()
  const [v, setV] = useState(store.get().staff.slice(0, 4))
  const [err, setErr] = useState(0)
  const tech = TECHS.find(t => t.staffNo === v)
  useEffect(() => {
    if (v.length < 4) return
    if (tech) { fx.success(); store.set({ staff: v, otp: code4() }); setTimeout(() => nav.go('otp', { tr: 'wave' }), 700) }
    else { fx.error(); setErr(e => e + 1); setTimeout(() => setV(''), 600) }
  }, [v])
  return (
    <Shell voice="staff" title={{ hi: 'अपना स्टाफ़ नंबर डालें', en: 'Enter your staff number' }}
      top={<Shake k={err} className="mt-4"><Digits v={v} error={!!err && v.length === 4 && !tech} /></Shake>}>
      <AnimatePresence mode="wait">
        {tech ? <motion.div key="t" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4 flex items-center gap-3 rounded-[16px] border-2 border-navy bg-green2 p-3"><Avatar name={tech.name} size={40} tone="sky" /><T hi={tech.hi} en={`${tech.name} · ${tech.trade}`} size="sm" /><BadgeCheck className="ml-auto text-green" /></motion.div>
          : <motion.p key="h" className="mb-4 text-center text-[14px] text-mid">{err ? 'यह नंबर नहीं मिला · Number not found' : 'डेमो: 4721 डालें · Demo: type 4721 (Ravi)'}</motion.p>}
      </AnimatePresence>
      <Keypad tone="sky" onKey={d => setV(x => (x + d).slice(0, 4))} onDelete={() => setV(x => x.slice(0, -1))} />
    </Shell>
  )
}

export function Otp() {
  const { nav, toast } = useApp()
  const lang = useLang()
  const s = store.use(x => x)
  const tech = TECHS.find(t => t.staffNo === s.staff) || TECHS[0]
  const otp = useMemo(() => { const c = store.get().otp || code4(); store.set({ otp: c }); return c }, [])
  const [v, setV] = useState(''); const [err, setErr] = useState(0); const [tries, setTries] = useState(3)
  useEffect(() => { const t = setTimeout(() => toast({ kind: 'system', app: 'Messages', icon: '✉', title: 'IWD-ALIGN', body: `${otp} आपका ALIGN लॉगिन OTP है। ${otp} is your ALIGN login code. Do not share it.`, action: { label: lang === 'hi' ? 'कोड भरें · Fill code' : 'Fill code', run: () => setV(otp) } }), 1100); return () => clearTimeout(t) }, [])
  useEffect(() => {
    if (v.length < 4) return
    if (v === otp) { fx.success(); store.set({ signedIn: true }); setTimeout(() => nav.go('bag', { tr: 'wave' }), 500) }
    else { fx.error(); setErr(e => e + 1); setTries(t => t - 1); setTimeout(() => setV(''), 650) }
  }, [v])
  return (
    <Shell voice="otp" title={{ hi: 'OTP डालें', en: 'Enter the OTP' }}
      sub={<T size="sm" hi={`फ़ोन ${tech.phone} और ईमेल पर 4 अंक भेजे`} en={`4 digits sent to ${tech.phone} and your email`} />}
      top={<Shake k={err} className="mt-4"><Digits v={v} error={!!err && v.length === 4} /></Shake>}>
      <div className="mb-4 flex h-6 items-center justify-center text-center text-[14px] font-semibold">
        {err > 0 && v.length < 4 ? <span className="text-ember">{lang === 'hi' ? `ग़लत OTP · ${tries} बार और` : `Wrong code · ${tries} tries left`}</span> : <span className="flex items-center gap-1.5 text-mid"><KeyRound size={16} />{lang === 'hi' ? 'मैसेज ऊपर दिखेगा' : 'The message shows at the top'}</span>}
      </div>
      <Keypad tone="sky" onKey={d => setV(x => (x + d).slice(0, 4))} onDelete={() => setV(x => x.slice(0, -1))} />
      <Small hi="OTP फिर से भेजें" en="Send the OTP again" onClick={() => { const c = code4(); store.set({ otp: c }); toast({ kind: 'system', app: 'Messages', icon: '✉', title: 'IWD-ALIGN', body: `${c} is your new ALIGN login code.`, action: { label: 'Fill code', run: () => setV(c) } }) }} />
    </Shell>
  )
}

export function Bag() {
  const { nav, toast } = useApp()
  const lang = useLang()
  const { packed } = store.use(s => s)
  const all = packed.length === BAG.length
  const toggle = (id: string) => { const on = packed.includes(id); on ? fx.deselect() : fx.check(); store.set({ packed: on ? packed.filter(x => x !== id) : [...packed, id] }) }
  const missing = BAG.filter(b => !packed.includes(b.id))
  return (
    <Shell voice="bag" back={false} title={{ hi: 'बैग देखें', en: 'Check your bag' }}
      top={<div className="flex items-end justify-between"><Art n="bag" w={150} className="-mb-2" /><div className="mb-2 rounded-[14px] border-2 border-navy bg-paper px-3 py-2 text-center"><div className="font-head text-[28px] font-extrabold leading-none tabular">{packed.length}/{BAG.length}</div><div className="text-[12px] font-semibold text-mid">{lang === 'hi' ? 'रख लिया' : 'packed'}</div></div></div>}
      foot={all ? <Big hi="सब तैयार" en="Bag is ready" sound="success" onClick={() => nav.go('jobs', { tr: 'wave' })} />
        : <Big variant="sun" hi={`${missing.length} कम हैं · स्टोर को बताएं`} en={`${missing.length} missing · tell store`} onClick={() => { store.set({ missing: missing.map(m => m.id) }); toast({ kind: 'sticky', tone: 'sky', title: lang === 'hi' ? 'स्टोर को बता दिया' : 'Store has been told', body: lang === 'hi' ? 'गेट पर सुबह 8:15 तक मिलेगा · Pick up at the gate by 8:15 AM' : 'Pick up at the gate by 8:15 AM', icon: <PackageX size={22} /> }); nav.go('jobs', { tr: 'wave' }) }} />}>
      <p className="mb-3 text-center text-[14px] font-semibold text-mid">{lang === 'hi' ? 'जो रख लिया, उस पर दबाएँ' : 'Tap what you have packed'}</p>
      <div className="grid grid-cols-3 gap-3 pb-4">
        {BAG.map((b, i) => {
          const on = packed.includes(b.id)
          return (
            <Rise key={b.id} delay={i * 0.04}>
              <motion.button onClick={() => toggle(b.id)} whileTap={{ scale: 0.94 }} aria-pressed={on}
                className={cx('relative flex h-[128px] w-full flex-col items-center justify-center gap-1.5 rounded-[18px] border-2 transition-colors', on ? 'border-navy bg-sky2 shadow-btn' : 'border-line bg-paper')}>
                <span className="absolute right-2 top-2"><AnimatePresence>{on && <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={springPop} className="flex h-6 w-6 items-center justify-center rounded-full bg-green text-white"><Check size={15} strokeWidth={3.5} /></motion.span>}</AnimatePresence></span>
                <Art n={b.art} w={46} className={cx(!on && 'opacity-70')} />
                <T hi={b.hi} en={b.en} size="sm" align="center" />
              </motion.button>
            </Rise>
          )
        })}
      </div>
    </Shell>
  )
}

export function JobCard({ j, big, onClick }: { j: Job; big?: boolean; onClick?: () => void }) {
  const lang = useLang()
  const done = j.status === 'done'
  return (
    <motion.button layout onClick={() => { if (onClick) { fx.tap(); onClick() } }} disabled={!onClick} whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cx('w-full rounded-[20px] border-2 text-left', big ? 'border-navy bg-paper p-4 shadow-[0_4px_0_#00224E]' : done ? 'border-transparent bg-sand p-3' : 'border-navy/25 bg-paper p-3')}>
      <div className="flex items-center gap-3">
        <span className={cx('flex shrink-0 items-center justify-center rounded-[14px]', big ? 'h-14 w-14 bg-sky2' : 'h-11 w-11 bg-sand')}>
          {done ? <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-white"><Check size={18} strokeWidth={3.5} /></span> : <Art n={j.art} w={big ? 40 : 30} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className={cx('truncate font-mono font-medium leading-none', big ? 'text-[30px]' : 'text-[20px]', done && 'text-mid line-through decoration-2')}>{j.room}</div>
          <div className="mt-1 truncate text-[14px] text-mid">{j.bhawan}</div>
        </div>
        <Tag tone={done ? 'success' : big ? 'sun' : 'neutral'} icon={<Clock3 size={14} />}>{lang === 'hi' ? j.timeHi : j.time}</Tag>
      </div>
      {!done && <div className="mt-3"><T hi={`${j.itemHi} · ${j.issueHi}`} en={`${j.item} · ${j.issue}`} size={big ? 'md' : 'sm'} /></div>}
      {big && (
        <div className="mt-3 flex flex-wrap gap-2">
          {j.girls && <Tag tone="info" icon={<ShieldAlert size={14} />}>{lang === 'hi' ? 'गेट पर अटेंडेंट मिलेंगी' : 'Attendant meets you at the gate'}</Tag>}
          {j.shared > 0 && <Tag tone="neutral" icon={<Users size={14} />}>{j.shared} {lang === 'hi' ? 'विद्यार्थी' : 'students'}</Tag>}
          {j.access === 'warden' && <Tag tone="warn" icon={<KeyRound size={14} />}>{lang === 'hi' ? 'वार्डन खोलेंगे' : 'Warden opens'}</Tag>}
        </div>
      )}
    </motion.button>
  )
}

export function Jobs() {
  const { nav, online } = useApp()
  const lang = useLang()
  const jobs = store.use(s => s.jobs)
  const next = jobs.find(j => j.status === 'next'); const queued = jobs.filter(j => j.status === 'queued'); const done = jobs.filter(j => j.status === 'done' || j.status === 'part' || j.status === 'missed')
  const left = jobs.length - done.length
  return (
    <Shell voice="jobs" back={false} title={{ hi: 'आज के काम', en: "Today's jobs" }}
      banner={!online ? <div className="absolute inset-x-0 top-[44px] z-10 bg-navy py-1 text-center text-[13px] font-semibold text-cream">{lang === 'hi' ? 'ऑफ़लाइन · काम फ़ोन में सुरक्षित है' : 'Offline · your work is saved on the phone'}</div> : undefined}
      top={
        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">{jobs.map(j => <span key={j.id} className={cx('h-2.5 flex-1 rounded-full border-2 border-navy', j.status === 'done' ? 'bg-navy' : j.status === 'next' ? 'bg-sun' : 'bg-paper')} />)}</div>
          <span className="font-head text-[16px] font-bold">{lang === 'hi' ? `${left} बाकी, ${done.length} हो गए` : `${left} left, ${done.length} done`}</span>
          <Tooltip label={lang === 'hi' ? 'मेरा प्रोफ़ाइल' : 'My profile'}><button aria-label="My profile" onClick={() => { fx.tap(); nav.go('profile') }} className="rounded-full"><Avatar name="Ravi Kumar" size={44} /></button></Tooltip>
        </div>
      }
      foot={next ? <Big hi="अगला काम खोलें" en="Open next job" onClick={() => { store.set({ activeId: next.id }); nav.go('job', { tr: 'wave' }) }} /> : <Big hi="आज का काम पूरा" en="All done today" variant="sun" onClick={() => nav.reset('last', { tr: 'wave' })} />}>
      {next && <><p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{lang === 'hi' ? 'अगला' : 'Next'}</p><Drop><JobCard j={next} big onClick={() => { store.set({ activeId: next.id }); nav.go('job', { tr: 'wave' }) }} /></Drop></>}
      {queued.length > 0 && <p className="mb-2 mt-5 text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{lang === 'hi' ? 'इसके बाद · भवन के क्रम में' : 'After that · in Bhawan order'}</p>}
      <div className="flex flex-col gap-2.5">{queued.map((j, i) => <Rise key={j.id} delay={0.08 + i * 0.05}><JobCard j={j} /></Rise>)}</div>
      {done.length > 0 && <p className="mb-2 mt-5 text-[13px] font-bold uppercase tracking-[0.08em] text-mid">{lang === 'hi' ? 'हो गए' : 'Done'}</p>}
      <div className="flex flex-col gap-2 pb-4">{done.map(j => <JobCard key={j.id} j={j} />)}</div>
    </Shell>
  )
}

export function Profile() {
  const { nav } = useApp()
  const lang = useLang(); const s = store.use(x => x); const muted = useMuted()
  const t = TECHS.find(x => x.staffNo === s.staff) || TECHS[0]
  return (
    <Shell voice="profile" title={{ hi: 'मेरा प्रोफ़ाइल', en: 'My profile' }}
      top={<Drop className="mt-3"><div className="flex items-center gap-3 rounded-[18px] border-2 border-navy bg-paper p-3 shadow-btn"><Avatar name={t.name} size={52} /><div><div className={cx('text-[22px] font-extrabold leading-tight', lang === 'hi' ? 'font-hi' : 'font-head')}>{lang === 'hi' ? t.hi : t.name}</div><div className="text-[14px] text-mid">{t.trade} · IWD · <span className="font-mono">#{t.staffNo}</span></div></div><span className="ml-auto text-right"><span className="block font-head text-[22px] font-extrabold">★ {t.rating}</span><span className="text-[12px] text-mid">{t.years} yrs</span></span></div></Drop>}
      foot={<Big variant="paper" hi="बाहर निकलें" en="Log out" icon={<LogOut size={24} />} onClick={() => { store.set({ signedIn: false, staff: '' }); nav.reset('lang', { tr: 'wave' }) }} />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[16px] bg-sand p-3"><div className="flex items-center gap-1.5 text-[13px] font-bold text-mid"><CalendarClock size={15} />{lang === 'hi' ? 'आज की शिफ़्ट' : "Today's shift"}</div><div className={cx('mt-1 text-[18px] font-bold', lang === 'hi' ? 'font-hi' : 'font-head')}>{lang === 'hi' ? 'शाम 5 – रात 10' : '5 PM – 10 PM'}</div></div>
        <div className="rounded-[16px] bg-sand p-3"><div className="flex items-center gap-1.5 text-[13px] font-bold text-mid"><MapPin size={15} />{lang === 'hi' ? 'मेरे भवन' : 'My Bhawans'}</div><div className="mt-1 text-[15px] font-semibold leading-snug">Himalaya, Rajendra, Govind</div></div>
      </div>
      <div className="mt-5 flex flex-col gap-4 rounded-[18px] border-2 border-line bg-paper p-4">
        <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[16px] font-semibold"><Languages size={20} />{lang === 'hi' ? 'भाषा' : 'Language'}</span><LangPill /></div>
        <Toggle tone="blue" on={s.autoVoice} onChange={v => store.set({ autoVoice: v })} label={lang === 'hi' ? 'हर स्क्रीन पर आवाज़ अपने आप' : 'Voice help on every screen'} sub={lang === 'hi' ? 'Voice help plays by itself' : 'हर स्क्रीन पर अपने आप बजेगी'} />
        <Toggle tone="blue" on={!muted} onChange={v => setMuted(!v)} label={lang === 'hi' ? 'आवाज़ें और कंपन' : 'Sounds and vibration'} sub={lang === 'hi' ? 'Clicks and buzzes' : 'बटन की आवाज़ और कंपन'} />
      </div>
      <div className="mt-4 flex items-center gap-3 pb-4"><Beaver pose="stand" size={70} /><p className="text-[14px] text-mid">{lang === 'hi' ? 'कोई दिक्कत? सुपरवाइज़र डेस्क: 01332-28••••' : 'Stuck? Supervisor desk: 01332-28••••'}</p></div>
    </Shell>
  )
}

export function ErrorScreen({ kind }: { kind: 'offline' | 'server' }) {
  const { nav } = useApp()
  const lang = useLang()
  const e = kind === 'offline' ? { hi: 'इंटरनेट नहीं है', en: 'No internet', bhi: 'आपका काम फ़ोन में सुरक्षित है। नेट आते ही अपने आप चला जाएगा।', ben: 'Your work is saved on the phone. It goes as soon as the internet is back.', pose: 'sit' as const, icon: <Wifi size={20} /> }
    : { hi: 'कुछ गड़बड़ हो गई', en: 'Something went wrong', bhi: 'ग़लती हमारी तरफ़ से है। आपका काम सुरक्षित है।', ben: 'The fault is on our side. Your work is safe.', pose: 'think' as const, icon: <X size={20} /> }
  return (
    <Shell voice={kind} title={{ hi: e.hi, en: e.en }} top={<div className="flex justify-center"><Beaver pose={e.pose} size={130} /></div>} foot={<Big hi="फिर कोशिश करें" en="Try again" onClick={() => nav.back()} />}>
      <div className="mt-2 text-center"><p className={cx('text-[18px] leading-relaxed', lang === 'hi' ? 'font-hi font-semibold' : 'font-semibold')}>{lang === 'hi' ? e.bhi : e.ben}</p><p className="mt-2 text-[15px] text-mid">{lang === 'hi' ? e.ben : e.bhi}</p></div>
    </Shell>
  )
}
export { Lock, UserRound, IconButton, Speaker, stopVoice, spring }
