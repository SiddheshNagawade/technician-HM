/* Technician app: every screen is the Figma frame (see ../fig/Fig.tsx). This file attaches behaviour,
   live data and the spoken help to the Figma layers by node id. */
import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { Fig, FNode, Binds, Bind, SvgMod, setFill, figArt } from '../fig/Fig'
import { Settle, Hop, WalkIn, Reveal, PopIn, RiseIn, PlaceDown, Flicker, SpinDown, Slap } from '../fig/anim'
import { NavApi } from '../ds/nav'
import { Hanging, peek } from '../fig/mascot'
import { fx } from '../ds/fx'
import { motion } from 'framer-motion'
import DATA from './fig.json'
import { store, activeJob, finishActive, setJob, counts, BAG, PARTS } from './store'
import { playVoice, stopVoice, VoiceKey, useVoicePlaying } from './voice'

export type Screen = 'lang' | 'staff' | 'pin' | 'bag' | 'jobs' | 'job' | 'details' | 'heading' | 'working' | 'code' | 'done' | 'last' | 'cant' | 'nobody'
  | 'photo' | 'part' | 'stock' | 'reserved' | 'reopen' | 'slot' | 'history' | 'profile' | 'offline' | 'e500'
export const AppCtx = createContext<{ nav: NavApi<Screen> }>(null!)
const useNav = () => useContext(AppCtx).nav
const D = DATA as unknown as Record<string, FNode>
const useS = () => store.use(s => s)
const F = ({ id, binds, extra }: { id: string; binds?: Binds; extra?: ReactNode }) => <Fig s={D[id]} binds={binds} extra={extra} />

/* ---------- shared bits: back, language pill, speaker (plays this screen's spoken help) ---------- */
function useTop(voice: VoiceKey, ids: { back?: string; pill?: string; speaker?: string }): Binds {
  const nav = useNav(); const s = useS(); const playing = useVoicePlaying()
  const auto = s.autoVoice
  useEffect(() => { if (auto) { const t = setTimeout(() => say(voice), 500); return () => clearTimeout(t) } }, [voice])
  useEffect(() => () => stopVoice(), [])
  const b: Binds = {}
  if (ids.back) b[ids.back] = { onClick: () => { stopVoice(); nav.back() }, label: 'वापस · Back' }
  if (ids.pill) b[ids.pill] = { onClick: () => { const l = s.lang === 'hi' ? 'en' : 'hi'; store.set({ lang: l, voiceMode: l }); fx.toggleOn() }, label: s.lang === 'hi' ? 'Switch voice to English' : 'आवाज़ हिंदी में करें',
    render: () => <SvgMod id="kit-217:81" mod={svg => s.lang === 'en' ? svg.replace('<rect x="1.25" y="1.25" width="94.5" height="41.5" rx="20.75" fill="#FFFBF3"/>', '<rect x="1.25" y="1.25" width="94.5" height="41.5" rx="20.75" fill="#FFD265"/>') : svg} /> }
  if (ids.speaker) b[ids.speaker] = { onClick: () => (playing ? stopVoice() : say(voice)), label: 'सुनें · Listen', wrap: el => <motion.div animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={playing ? { repeat: Infinity, duration: 0.8 } : {}}>{el}</motion.div> }
  return b
}
/* The beaver drawings from the Figma, by mood. */
export const BEAVER = { wave: '230:104', cheer: '230:1128', thumbs: '230:1636', think: '230:2027', point: '230:1320' } as const

export function say(k: VoiceKey) {
  const s = store.get()
  fx.tap()
  if (s.voiceMode === 'both') { playVoice(k, 'hi'); return }
  playVoice(k, s.voiceMode === 'en' ? 'en' : 'hi')
}

/* ---------- keypad (drawn keys from the Figma) ---------- */
function keypad(keys: string[], texts: string[], del: string, onKey: (d: string) => void, onDel: () => void): Binds {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const b: Binds = {}
  keys.forEach((k, i) => {
    if (i < 10) { b[k] = { onClick: () => { fx.key(i); onKey(digits[i]) }, label: digits[i] }; b[texts[i]] = { style: { pointerEvents: 'none' } } }
    else b[k] = { onClick: () => { fx.erase(); onDel() }, label: 'मिटाएँ · Delete' }
  })
  b[del] = { style: { pointerEvents: 'none' } }
  return b
}
const slotMod = (active: boolean) => (svg: string) => setFill(svg, 0, active ? '#FFF1C7' : '#FFFBF3')

/* ================= Getting in ================= */
export function Lang() {
  const nav = useNav()
  const pick = (l: 'hi' | 'en') => { store.set({ lang: l, voiceMode: l === 'hi' ? 'both' : 'en' }); fx.select(); nav.go('staff') }
  return (
    <F id="230:78" binds={{
      '230:104': { wrap: el => <Settle>{el}</Settle> },
      '230:81': { onClick: () => say('lang'), label: 'सुनें · Listen' }, '230:82': { style: { pointerEvents: 'none' } },
      '230:86': { onClick: () => pick('hi'), label: 'हिन्दी' }, '230:94': { onClick: () => pick('en'), label: 'English' },
    }} />
  )
}

export function Staff() {
  const nav = useNav(); const s = useS()
  const [v, setV] = useState(s.staff)
  const top = useTop('staff', { pill: '230:200', speaker: '230:202' })
  const add = (d: string) => { if (v.length >= 4) return; const n = v + d; setV(n); if (n.length === 4) { store.set({ staff: n }); fx.success(); setTimeout(() => nav.go('pin'), 350) } }
  const slots = ['230:137', '230:141', '230:145', '230:149'], txt = ['230:140', '230:144', '230:148']
  const binds: Binds = { ...top, ...keypad(['230:152', '230:156', '230:160', '230:164', '230:168', '230:172', '230:176', '230:180', '230:184', '230:188', '230:192'], ['230:155', '230:159', '230:163', '230:167', '230:171', '230:175', '230:179', '230:183', '230:187', '230:191'], '230:195', add, () => setV(v.slice(0, -1))) }
  slots.forEach((id, i) => { binds[id] = { render: () => <SvgMod id={id} mod={slotMod(i === v.length)} /> } })
  txt.forEach((id, i) => { binds[id] = { text: v[i] || '' } })
  const extra = <div style={{ position: 'absolute', left: 285, top: 208, width: 32, height: 42, textAlign: 'center', font: '500 32px/42px "DM Mono", monospace', color: '#00224E', pointerEvents: 'none' }}>{v[3] || ''}</div>
  return <F id="230:110" binds={binds} extra={extra} />
}

export function Pin() {
  const nav = useNav()
  const [v, setV] = useState('')
  const top = useTop('pin', { pill: '230:312', speaker: '230:314' })
  const add = (d: string) => { if (v.length >= 4) return; const n = v + d; setV(n); if (n.length === 4) { store.set({ signedIn: true }); fx.success(); setTimeout(() => nav.reset('bag', { tr: 'wave' }), 350); setTimeout(() => peek({ mood: 'wave', say: 'नमस्ते रवि!', sub: 'Hello, Ravi' }), 1100) } }
  const slots = ['230:250', '230:254', '230:258', '230:261']
  const binds: Binds = { ...top, '230:245': { wrap: el => <Flicker delay={0.4}>{el}</Flicker> }, ...keypad(['230:264', '230:268', '230:272', '230:276', '230:280', '230:284', '230:288', '230:292', '230:296', '230:300', '230:304'], ['230:267', '230:271', '230:275', '230:279', '230:283', '230:287', '230:291', '230:295', '230:299', '230:303'], '230:307', add, () => setV(v.slice(0, -1))) }
  slots.forEach((id, i) => { binds[id] = { render: () => <SvgMod id={i === 2 ? '230:250' : id} mod={slotMod(i === v.length)} /> } })
  binds['230:253'] = { text: v[0] ? '•' : '' }; binds['230:257'] = { text: v[1] ? '•' : '' }
  const extra = <>{[2, 3].map(i => <div key={i} style={{ position: 'absolute', left: [0, 0, 245, 294][i], top: 207, width: 32, height: 39, textAlign: 'center', font: '500 30px/39px "DM Mono", monospace', color: '#00224E', pointerEvents: 'none' }}>{v[i] ? '•' : ''}</div>)}</>
  return <F id="230:221" binds={binds} extra={extra} />
}

const BAG_IDS = { ok: { items: ['230:352', '230:364', '230:375', '230:385', '230:396', '230:408'], marks: ['230:360', '230:371', '230:381', '230:392', '230:404', '230:414'] },
  miss: { items: ['230:575', '230:587', '230:598', '230:608', '230:621', '230:633'], marks: ['230:583', '230:594', '230:604', '230:617', '230:629', '230:639'] } }
export function Bag() {
  const nav = useNav(); const s = useS()
  const miss = s.missing.length > 0
  const ids = miss ? BAG_IDS.miss : BAG_IDS.ok
  const top = useTop('bag', miss ? { back: '230:676', pill: '230:679', speaker: '230:681' } : { back: '230:444', pill: '230:447', speaker: '230:449' })
  const toggle = (id: string) => { const m = s.missing.includes(id); m ? fx.check() : fx.deselect(); store.set({ missing: m ? s.missing.filter(x => x !== id) : [...s.missing, id] }) }
  const binds: Binds = { ...top, [miss ? '230:656' : '230:424']: { wrap: el => <PlaceDown>{el}</PlaceDown> } }
  BAG.forEach((it, i) => {
    const out = s.missing.includes(it.id)
    binds[ids.items[i]] = { onClick: () => toggle(it.id), label: `${it.hi} · ${it.en}` }
    binds[ids.marks[i]] = { art: out ? '230:617' : '230:360', wrap: el => <PopIn key={String(out)} delay={0}>{el}</PopIn> }
  })
  if (miss) {
    binds['230:613'] = { hide: true }
    binds['230:685'] = { onClick: () => { fx.success(); nav.reset('jobs', { tr: 'wave' }) }, text: ['स्टोर को बताएँ', `Tell the store · ${s.missing.length} missing`] as unknown as ReactNode }
    binds['230:649'] = { text: `${BAG.filter(b => s.missing.includes(b.id)).map(b => b.en).join(', ')} · pick up at the gate by 10:15 AM` }
    const rings = BAG.map((it, i) => s.missing.includes(it.id) ? <img key={it.id} src={figArt('230:613')} alt="" style={{ position: 'absolute', left: [24, 142, 260][i % 3], top: i < 3 ? 342 : 464, pointerEvents: 'none' }} /> : null)
    return <F id="230:555" binds={binds} extra={<>{rings}</>} />
  }
  binds['230:453'] = { onClick: () => { fx.success(); nav.reset('jobs', { tr: 'wave' }); setTimeout(() => peek({ mood: 'thumbs', say: 'चलिए!', sub: 'Bag ready. Let’s go.' }), 900) } }
  return <F id="230:332" binds={binds} />
}

/* ================= The round ================= */
export function Jobs() {
  const nav = useNav(); const s = useS(); const c = counts(s)
  const next = s.jobs.find(j => j.status === 'next')
  const others = s.jobs.filter(j => j !== next)
  const off = !navigator.onLine
  const P = off ? { root: '232:399', pill: '232:452', spk: '232:453', card: '232:405', fan: '232:411', room: '232:416', issue: '232:417', time: '232:454', tags: ['232:420', '232:422', '232:424'], ics: ['232:441', '232:447', '232:426'], rooms: ['232:455', '232:456', '232:457'], c1: '232:430', c2: '232:431', btn: '232:432', bv: '232:435' }
    : { root: '232:303', pill: '232:383', spk: '232:385', card: '232:320', fan: '232:326', room: '232:331', issue: '232:332', time: '232:336', tags: ['232:337', '232:342', '232:347'], ics: ['232:372', '232:378', '232:351'], rooms: ['232:341', '232:346', '232:355'], c1: '232:356', c2: '232:357', btn: '232:389', bv: '232:366' }
  const top = useTop('jobs', { pill: P.pill, speaker: P.spk })
  if (!next) return <Last />
  const open = (id: string) => { store.set({ activeId: id }); nav.go('job') }
  const binds: Binds = {
    ...top, [P.card]: { onClick: () => open(next.id), label: `${next.room} · ${next.issueEn}`, wrap: el => <PlaceDown>{el}</PlaceDown> },
    [P.fan]: { art: next.icon === '232:326' ? undefined : next.icon, style: { pointerEvents: 'none' } }, [P.room]: { text: next.room, style: { pointerEvents: 'none' } }, [P.issue]: { text: next.issueHi, style: { pointerEvents: 'none' } }, [P.time]: { text: next.timeHi, style: { pointerEvents: 'none' } },
    [P.c1]: { text: `${c.left} काम बाकी, ${c.done} हो गया` }, [P.c2]: { text: `${c.left} job${c.left === 1 ? '' : 's'} left, ${c.done} done` },
    [P.btn]: { onClick: () => open(next.id) }, [P.bv]: { wrap: el => <Settle delay={0.3}>{el}</Settle>, onClick: () => nav.go('profile'), label: 'मेरा प्रोफ़ाइल · My profile' },
  }
  P.tags.forEach((t, i) => {
    const j = others[i]
    if (!j) { binds[t] = binds[P.ics[i]] = binds[P.rooms[i]] = { hide: true }; return }
    binds[t] = { onClick: () => j.status !== 'done' && open(j.id), label: `${j.room} · ${j.issueEn}`, render: () => <SvgMod id={t} mod={svg => setFill(svg, 0, j.status === 'done' ? '#EDE4CF' : '#FFFBF3')} />, wrap: el => <PlaceDown delay={0.1 + i * 0.08}>{el}</PlaceDown> }
    binds[P.ics[i]] = { art: j.status === 'done' ? '232:351' : j.icon === '232:326' ? '232:372' : j.icon, style: { pointerEvents: 'none' } }
    binds[P.rooms[i]] = { text: j.room, style: { pointerEvents: 'none' } }
  })
  return <F id={P.root} binds={binds} />
}

/* Job overview, then details. */
export function Job() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const playing = useVoicePlaying()
  const top = useTop('job', { back: '230:760' })
  return (
    <F id="230:691" binds={{
      ...top, '230:695': j.item === 'Ceiling fan' ? { render: () => <FanSpin /> } : { hide: true },
      '230:711': { onClick: () => { const l = s.lang === 'hi' ? 'en' : 'hi'; store.set({ lang: l, voiceMode: l }); fx.toggleOn() }, label: 'हिं · EN', style: { background: s.lang === 'en' ? '#FFD265' : '#FFFBF3' } },
      '230:713': { text: j.room }, '230:714': { text: j.issueHi }, '230:715': { text: j.issueEn }, '230:716': { text: j.slotHi },
      '230:717': { onClick: () => (playing ? stopVoice() : say('note')), label: 'विद्यार्थी का संदेश सुनें · Hear the student' }, '230:718': { style: { pointerEvents: 'none' } }, '230:722': { onClick: () => say('note') },
      '230:723': { wrap: el => <Reveal dur={1}>{el}</Reveal> },
      '230:763': { onClick: () => nav.go('details'), text: ['आगे', 'See the details'] as unknown as ReactNode },
    }} />
  )
}
/** The Figma fan on the job screen: the rod stays, the blades spin up and wind down once. */
function FanSpin() {
  return (
    <SvgMod id="230:695" mod={svg => svg.replace(/(<g clip-path="url\(#clip0_230_695\)">)([\s\S]*?)(<path d="M195 0V148"[^>]*\/>)([\s\S]*?)(<\/g><defs>)/, (_m, a, blades, rod, hub, end) =>
      `${a}<g class="fig-spin" style="transform-origin:195.8px 167.3px">${blades}</g>${rod}${hub}${end}`)} />
  )
}

export function Details() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const top = useTop('job', { back: '230:827', pill: '230:830', speaker: '230:832' })
  return (
    <F id="230:769" binds={{
      ...top, '230:787': { text: j.room }, '230:788': { text: j.issueHi }, '230:792': { text: `आज ${j.timeHi}` },
      '230:793': { wrap: el => <PlaceDown>{el}</PlaceDown> }, '230:798': { onClick: () => say('note'), label: 'संदेश सुनें · Hear the message' },
      '230:806': { text: j.noteHi || 'कोई संदेश नहीं' }, '230:816': { text: j.accessHi },
      '230:836': { onClick: () => { setJob(j.id, {}); nav.go('heading') } },
      '230:823': { onClick: () => nav.go('cant') }, '230:826': { onClick: () => nav.go('cant') },
    }} />
  )
}

export function Heading() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const top = useTop('trip', { back: '230:893', pill: '230:896', speaker: '230:898' })
  return (
    <F id="230:844" binds={{
      ...top, '230:864': { wrap: el => <Reveal dir="y" dur={1.2}>{el}</Reveal> }, '230:870': { wrap: el => <WalkIn from={-140} dur={1.6}>{el}</WalkIn> },
      '230:876': { wrap: el => <PopIn delay={0.5}>{el}</PopIn> }, '230:881': { text: j.room },
      '230:902': { onClick: () => { store.set({ workStart: Date.now(), steps: [false, false, false], photos: [false, false] }); fx.success(); nav.go('working', { tr: 'wave' }) } },
    }} />
  )
}

export function Working() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const top = useTop('work', { back: '230:983', pill: '230:986', speaker: '230:988' })
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const sec = Math.max(0, Math.floor((now - s.workStart) / 1000))
  const steps: [string, number][] = [['230:930', 0], ['230:940', 1], ['230:950', 2]]
  const binds: Binds = {
    ...top, '230:927': { text: `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}` }, '230:929': { text: `${j.room} · Time on this job` },
    '230:973': { onClick: () => nav.go('part') }, '230:976': { onClick: () => nav.go('part') },
    '230:992': { onClick: () => nav.go('code') },
  }
  steps.forEach(([id, i]) => {
    const done = s.steps[i]
    binds[id] = { art: done ? '230:930' : '230:950', onClick: () => { done ? fx.deselect() : fx.check(); store.set(x => ({ steps: x.steps.map((v, k) => (k === i ? !v : v)) })) }, label: ['Switch off', 'Check the capacitor', 'Test run'][i], wrap: el => <PopIn key={String(done)} delay={0}>{el}</PopIn> }
  })
  ;([['230:958', 0], ['230:966', 1]] as [string, 0 | 1][]).forEach(([id, i]) => {
    const has = s.photos[i]
    binds[id] = { art: has ? '230:958' : '230:966', onClick: () => { fx.shutter(); if (!s.photos[i]) peek({ mood: 'thumbs', say: 'बढ़िया फ़ोटो!', sub: 'Nice photo', ms: 1800 }); store.set(x => ({ photos: (i === 0 ? [!x.photos[0], x.photos[1]] : [x.photos[0], !x.photos[1]]) as [boolean, boolean] })) }, label: i ? 'बाद की फ़ोटो · After photo' : 'पहले की फ़ोटो · Before photo', wrap: el => <PlaceDown key={String(has)} delay={0}>{el}</PlaceDown> }
  })
  return <F id="230:909" binds={binds} />
}

export function Code() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const [v, setV] = useState(''); const [bad, setBad] = useState(0)
  const top = useTop('code', { back: '230:1089', pill: '230:1092', speaker: '230:1094' })
  const vref = useRef(v); vref.current = v
  const check = (n: string) => {
    if (n === j.code) { fx.success(); finishAndGo(nav, 'done') }
    else { fx.error(); setBad(b => b + 1); setTimeout(() => setV(''), 500) }
  }
  const add = (d: string) => { if (vref.current.length >= 4) return; const n = vref.current + d; setV(n); if (n.length === 4) setTimeout(() => check(n), 250) }
  useEffect(() => { const f = (e: Event) => { const c = (e as CustomEvent).detail as string; setV(''); c.split('').forEach((d, i) => setTimeout(() => add(d), 260 * (i + 1))) }; addEventListener('align-code', f); return () => removeEventListener('align-code', f) }, [])
  const slots = ['230:1023', '230:1027', '230:1031', '230:1034']
  const binds: Binds = { ...top, '230:1018': { wrap: el => <motion.div key={bad} animate={bad ? { x: [0, -10, 9, -6, 4, 0] } : {}} transition={{ duration: 0.36 }}>{el}</motion.div> },
    ...keypad(['230:1037', '230:1041', '230:1045', '230:1049', '230:1053', '230:1057', '230:1061', '230:1065', '230:1069', '230:1073', '230:1077'], ['230:1040', '230:1044', '230:1048', '230:1052', '230:1056', '230:1060', '230:1064', '230:1068', '230:1072', '230:1076'], '230:1080', add, () => setV(x => x.slice(0, -1))),
    '230:1026': { text: v[0] || '' }, '230:1030': { text: v[1] || '' },
    '230:1083': { style: { color: bad ? '#B8530A' : '#00224E' } },
    '230:1085': { onClick: () => nav.go('photo') }, '230:1088': { onClick: () => nav.go('photo') },
  }
  slots.forEach((id, i) => { binds[id] = { render: () => <SvgMod id={id} mod={slotMod(i === v.length)} /> } })
  const extra = <>{[2, 3].map(i => <div key={i} style={{ position: 'absolute', left: [0, 0, 189, 252][i], top: 186, width: 40, height: 49, textAlign: 'center', font: '500 38px/49px "DM Mono", monospace', color: '#00224E', pointerEvents: 'none' }}>{v[i] || ''}</div>)}</>
  return <F id="230:998" binds={binds} extra={extra} />
}
function finishAndGo(nav: NavApi<Screen>, to: Screen, status: 'done' | 'missed' | 'part' = 'done') {
  const room = activeJob().room
  finishActive(status)
  nav.replace(to, { tr: 'wave', p: { room } })
}

export function Done() {
  const nav = useNav(); const s = useS(); const c = counts(s)
  const top = useTop('done', { pill: '230:1161', speaker: '230:1163' })
  const dots = ['230:1139', '230:1143', '230:1147', '230:1150']
  const binds: Binds = {
    ...top, '230:1128': { wrap: el => <Hop delay={0.3}>{el}</Hop> }, '230:1133': { wrap: el => <PopIn delay={0.5}>{el}</PopIn> }, '230:1135': { wrap: el => <PopIn delay={0.65}>{el}</PopIn> },
    '230:1138': { text: `Job closed · ${nav.params.room || ''}` }, '230:1153': { text: `आज ${c.total} में से ${c.done} हो गए` }, '230:1154': { text: `${c.done} of ${c.total} jobs done today` },
    '230:1167': { onClick: () => { const n = store.get().jobs.find(j => j.status === 'next'); n ? nav.reset('job', { tr: 'push' }) : nav.reset('last', { tr: 'wave' }) } },
  }
  dots.forEach((id, i) => { binds[id] = { art: i < c.done ? '230:1139' : '230:1147', wrap: el => <PopIn delay={0.7 + i * 0.1}>{el}</PopIn> } })
  return <F id="230:1113" binds={binds} />
}

export function Last() {
  const nav = useNav()
  const top = useTop('last', { pill: '230:1207', speaker: '230:1209' })
  return <F id="230:1173" binds={{ ...top, '230:1188': { wrap: el => <Hop delay={0.3}>{el}</Hop> }, '230:1193': { wrap: el => <PopIn delay={0.5}>{el}</PopIn> }, '230:1195': { wrap: el => <PopIn delay={0.6}>{el}</PopIn> }, '230:1213': { onClick: () => { store.reset(); store.set({ signedIn: true }); nav.reset('jobs', { tr: 'wave' }) }, text: ['घर', 'Home · start a new round'] as unknown as ReactNode } }} />
}

export function Cant() {
  const nav = useNav()
  const top = useTop('cant', { back: '230:1280', pill: '230:1283', speaker: '230:1285' })
  const left = () => { fx.paper(); nav.go('nobody'); setTimeout(() => peek({ mood: 'think', say: 'कोई बात नहीं', sub: 'No problem. Next job.' }), 900) }
  return (
    <F id="230:1219" binds={{
      ...top, '230:1239': { onClick: left, label: 'दरवाज़ा बंद है · Door is locked' }, '230:1250': { onClick: left, label: 'कोई नहीं है · Nobody here' },
      '230:1256': { onClick: () => { location.href = 'tel:+911332285311' }, label: 'सुपरवाइज़र को फ़ोन · Call supervisor' }, '230:1268': { wrap: el => <Settle delay={0.3}>{el}</Settle> },
    }} />
  )
}

export function Nobody() {
  const nav = useNav()
  const top = useTop('nobody', { back: '230:1363', pill: '230:1366', speaker: '230:1368' })
  return (
    <F id="230:1292" binds={{
      ...top, '230:1312': { wrap: el => <Slap delay={0.2}>{el}</Slap> }, '230:1320': { wrap: el => <Settle delay={0.4}>{el}</Settle> },
      '230:1332': { wrap: el => <Reveal dur={0.9} delay={0.3}>{el}</Reveal> }, '230:1350': { wrap: el => <PlaceDown delay={0.5}>{el}</PlaceDown> },
      '230:1372': { onClick: () => { const n = finishActive('missed'); n ? nav.reset('job') : nav.reset('last', { tr: 'wave' }) } },
    }} />
  )
}

export function Photo() {
  const nav = useNav()
  const [flash, setFlash] = useState(false)
  const top = useTop('photo', { back: '230:1427', pill: '230:1430', speaker: '230:1432' })
  return (
    <F id="230:1379" binds={{
      ...top, '230:1399': { wrap: el => <RiseIn y={20}>{el}</RiseIn> },
      '230:1436': { onClick: () => { fx.shutter(); setFlash(true); setTimeout(() => finishAndGo(nav, 'done'), 450) } },
    }} extra={flash ? <motion.div style={{ position: 'absolute', inset: 0, background: '#FFFFFF' }} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.45 }} /> : null} />
  )
}

/* ================= Parts ================= */
const PART_POS: Record<string, [string, number, number, number]> = { motor: ['230:1507', 52, 222, 96], cap: ['230:1467', 246, 212, 77], switch: ['230:1477', 47, 410, 74], bulb: ['230:1483', 194, 418, 83], washer: ['230:1489', 61, 558, 70], other: ['230:1495', 226, 564, 77] }
export function Part() {
  const nav = useNav(); const s = useS()
  const top = useTop('part', { back: '230:1514', pill: '230:1517', speaker: '230:1519' })
  const [, x, y, w] = PART_POS[s.part]
  const cx = x + w / 2, cy = y + w / 2
  const binds: Binds = {
    ...top, '230:1523': { onClick: () => nav.go('stock') },
    // the yellow highlight sits behind the drawings and their names, so it never hides a label
    '230:1464': { style: { zIndex: -1 }, render: () => <motion.img src={figArt('230:1464')} alt="" initial={false} animate={{ x: cx - 75.5 - 209, y: cy - 52.5 - 198 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }} style={{ display: 'block' }} /> },
    '230:1473': { render: () => <motion.img key={s.part} src={figArt('230:1473')} alt="" initial={{ x: cx + 33.5 - 318, y: cy - 56.5 - 194, scale: 0.3, opacity: 0 }} animate={{ x: cx + 33.5 - 318, y: cy - 56.5 - 194, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} style={{ display: 'block' }} /> },
  }
  for (const [k, [id]] of Object.entries(PART_POS)) binds[id] = { onClick: () => { fx.select(); store.set({ part: k }) }, label: PARTS.find(p => p.id === k)!.en }
  const extra = null
  return <Fig s={D['230:1442']} binds={binds} extra={extra} />
}

export function Stock() {
  const nav = useNav(); const s = useS(); const p = PARTS.find(x => x.id === s.part)!
  const top = useTop('stock', { back: '230:1601', pill: '230:1604', speaker: '230:1606' })
  return (
    <F id="230:1529" binds={{
      ...top, '230:1568': { wrap: el => <RiseIn y={16}>{el}</RiseIn> }, '230:1549': { text: p.hi },
      '230:1554': { text: String(p.store), style: { color: p.store ? '#1B7F52' : '#B8530A' } }, '230:1560': { text: String(p.near), style: { color: p.near ? '#1B7F52' : '#B8530A' } },
      '230:1610': { onClick: () => { fx.success(); nav.go('reserved') }, disabled: !p.store && !p.near },
    }} />
  )
}

export function Reserved() {
  const nav = useNav(); const s = useS(); const p = PARTS.find(x => x.id === s.part)!
  const top = useTop('reserved', { back: '230:1665', pill: '230:1668', speaker: '230:1670' })
  return (
    <F id="230:1618" binds={{
      ...top, '230:1636': { wrap: el => <Settle>{el}</Settle> }, '230:1641': { wrap: el => <PopIn delay={0.4}>{el}</PopIn> }, '230:1643': { wrap: el => <PopIn delay={0.5}>{el}</PopIn> },
      '230:1647': { wrap: el => <PlaceDown delay={0.3}>{el}</PlaceDown> }, '230:1656': { text: p.hi },
      '230:1652': { art: PART_POS[p.id][0], style: { transform: `scale(${80 / PART_POS[p.id][3]})`, transformOrigin: '0 0' } },
      '230:1674': { onClick: () => { const n = finishActive('part'); n ? nav.reset('job') : nav.reset('last', { tr: 'wave' }) } },
    }} />
  )
}

/* ================= Changes, history, profile ================= */
export function Reopen() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const top = useTop('reopen', { back: '230:1741', pill: '230:1744', speaker: '230:1746' })
  return (
    <F id="230:1680" binds={{
      ...top, '230:1700': { text: j.room }, '230:1701': { wrap: el => <motion.div initial={{ rotate: -90, scale: 0.6, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}>{el}</motion.div> },
      '230:1711': { wrap: el => <PlaceDown delay={0.2}>{el}</PlaceDown> }, '230:1716': { onClick: () => say('note'), label: 'संदेश सुनें · Hear it' },
      '230:1750': { onClick: () => nav.reset('job') },
    }} />
  )
}

export function Slot() {
  const nav = useNav()
  const top = useTop('slot', { back: '230:1801', pill: '230:1804', speaker: '230:1806' })
  return (
    <F id="230:1759" binds={{
      ...top, '230:1786': { wrap: el => <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.3 }}>{el}</motion.div> },
      '230:1788': { wrap: el => <PlaceDown delay={0.55}>{el}</PlaceDown> }, '230:1810': { onClick: () => nav.reset('jobs') },
    }} />
  )
}

export function History() {
  const nav = useNav(); const s = useS(); const j = activeJob(s)
  const top = useTop('history', { back: '230:1884', pill: '230:1887', speaker: '230:1889' })
  const b: Binds = { ...top, '230:1836': { text: j.room }, '230:1839': { wrap: el => <Reveal dir="y" dur={1.2}>{el}</Reveal> } }
  ;['230:1844', '230:1858', '230:1872'].forEach((id, i) => { b[id] = { wrap: el => <PlaceDown delay={0.2 + i * 0.12}>{el}</PlaceDown> } })
  void nav
  return <F id="230:1818" binds={b} />
}

export function Profile() {
  const nav = useNav(); const s = useS()
  const top = useTop('profile', { back: '230:1976', pill: '230:1979', speaker: '230:1981' })
  const chips: [string, string, 'hi' | 'both' | 'en'][] = [['230:1952', '230:1956', 'hi'], ['230:1957', '230:1961', 'both'], ['230:1962', '230:1966', 'en']]
  const b: Binds = { ...top, '230:1916': { wrap: el => <PlaceDown>{el}</PlaceDown> }, '230:1967': { wrap: el => <Settle delay={0.3}>{el}</Settle> },
    '230:1926': { text: `Ravi · ${s.staff || '014'}` },
    '230:1972': { onClick: () => { store.set({ signedIn: false, staff: '' }); nav.reset('lang', { tr: 'wave' }) } }, '230:1975': { onClick: () => { store.set({ signedIn: false, staff: '' }); nav.reset('lang', { tr: 'wave' }) } } }
  chips.forEach(([art, label, m]) => {
    const on = s.voiceMode === m
    b[art] = { onClick: () => { fx.select(); store.set({ voiceMode: m, lang: m === 'en' ? 'en' : 'hi' }) }, label: m === 'both' ? 'दोनों · Both' : m === 'hi' ? 'हिंदी' : 'English', render: () => <SvgMod id={art} mod={svg => setFill(svg, 0, on ? '#FFD265' : '#FFFBF3')} /> }
    b[label] = { style: { pointerEvents: 'none' } }
  })
  return <F id="230:1896" binds={b} />
}

export function ErrorScreen({ kind }: { kind: 'offline' | 'e500' }) {
  const nav = useNav()
  const off = kind === 'offline'
  const top = useTop(off ? 'offline' : 'server', off ? { pill: '230:1996', speaker: '230:1998' } : { pill: '230:2021', speaker: '230:2023' })
  const ids = off ? ['230:2002', '230:2007', '230:2008'] : ['230:2027', '230:2032', '230:2033']
  return <F id={off ? '230:1992' : '230:2017'} binds={{ ...top, ...Object.fromEntries(ids.map(i => [i, { hide: true }])), [off ? '230:2011' : '230:2036']: { onClick: () => nav.back() } }}
    extra={<Hanging art={BEAVER.cheer} sign="sign-board" cx={195} top={92} scale={0.95} rope title={off ? 'इंटरनेट नहीं है' : 'कुछ गड़बड़ हो गई'} sub={off ? 'No internet. Your work is safe on the phone.' : 'Something went wrong. Your work is safe.'} />} />
}

export const ALL: Record<Screen, () => React.ReactElement> = {
  lang: Lang, staff: Staff, pin: Pin, bag: Bag, jobs: Jobs, job: Job, details: Details, heading: Heading, working: Working, code: Code, done: Done, last: Last,
  cant: Cant, nobody: Nobody, photo: Photo, part: Part, stock: Stock, reserved: Reserved, reopen: Reopen, slot: Slot, history: History, profile: Profile,
  offline: () => <ErrorScreen kind="offline" />, e500: () => <ErrorScreen kind="e500" />,
}
export type { Bind }
export { SpinDown }
