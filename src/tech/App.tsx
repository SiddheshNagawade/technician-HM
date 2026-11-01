import React, { useEffect, useMemo, useState } from 'react'
import { useNav, Stage } from '../ds/nav'
import { PhoneStage, ScreenGroup, SimAction } from '../ds/stage'
import { AppCtx, ALL, Screen, allFrames, BAG_PICS, STEP_PICS } from './screens'
import { PeekHost, OfflineBuddy, preloadMascot } from '../fig/mascot'
import { prefetchBundles, fileUrl } from '../fig/preload'
import { LangCtx } from '../fig/Fig'
import { installEnglish } from './english'
import { Dock } from './dock'
installEnglish()

// once the first screen is up, quietly fetch every other screen's packed drawings (one request each), so later screens appear whole at once
const BACKGROUND = ['build-1', 'build-2', 'build-3', 'build-log']
const PHOTOS = ['fan', 'fan-before', 'switch', 'tube'].map(n => `${import.meta.env.BASE_URL}photos/${n}.jpg`)
function warmEverything() {
  prefetchBundles(allFrames().map(f => f.i), [...[...BACKGROUND, ...BAG_PICS, ...STEP_PICS].map(fileUrl), ...PHOTOS]); setTimeout(() => preloadMascot(), 1500)
  // the spoken clips too (about 1.7 MB for Hindi), one after the other, so a press on the speaker starts the sound at once
  const mode = store.get().voiceMode === 'en' ? 'en' : 'hi'
  const keys = Object.keys(SCRIPTS) as VoiceKey[]
  setTimeout(async () => { for (const k of keys) await preloadVoice(k, mode) }, 2500)
}
import { store, activeJob, setJob } from './store'
import { stopVoice, preloadVoice, SCRIPTS, VoiceKey } from './voice'

const GROUPS: ScreenGroup[] = [
  { title: 'Getting in and the morning bag', items: [{ id: 'lang', label: 'Language' }, { id: 'staff', label: 'Sign in' }, { id: 'pin', label: 'PIN' }, { id: 'bag', label: 'Morning bag' }, { id: 'jobs', label: "Today's jobs" }] },
  { title: 'Do a job, from heading out to closed', items: [{ id: 'job', label: 'Job' }, { id: 'details', label: 'Job details' }, { id: 'heading', label: 'Heading out' }, { id: 'working', label: 'Working' }, { id: 'code', label: 'Closing code' }, { id: 'done', label: 'Job closed' }, { id: 'last', label: 'All done' }, { id: 'cant', label: "Can't get in" }, { id: 'nobody', label: 'Notice left' }, { id: 'photo', label: 'Close with photo' }, { id: 'part', label: 'Which part' }, { id: 'stock', label: 'Stock status' }, { id: 'reserved', label: 'Part reserved' }] },
  { title: 'History, profile and error pages', items: [{ id: 'reopen', label: 'Reopened job' }, { id: 'slot', label: 'Slot changed' }, { id: 'history', label: 'Fan history' }, { id: 'profile', label: 'Profile' }, { id: 'offline', label: 'No internet' }, { id: 'e500', label: 'Something went wrong' }] },
]

function prep(scr: Screen) {
  if (!['lang', 'staff', 'pin'].includes(scr)) store.set({ signedIn: true, staff: store.get().staff || '014' })
  if (scr === 'bag') store.set({ missing: [] })
  if (['job', 'details', 'heading', 'working', 'code', 'cant', 'nobody', 'photo', 'part', 'stock', 'reserved', 'reopen', 'history'].includes(scr) && !store.get().jobs.some(j => j.status === 'next')) store.reset()
  if (scr === 'working') store.set({ workStart: Date.now() - 760_000, steps: [true, true, false], photos: [true, false] })
  if (scr === 'done' || scr === 'last') { const s = store.get(); if (scr === 'last') store.set({ jobs: s.jobs.map(j => ({ ...j, status: 'done' as const })) }) }
}

function Inner() {
  const lang = store.use(s => s.lang); const missing = store.use(s => s.missing.length > 0)
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { warmEverything() }, [])
  useEffect(() => { const u = () => setOnline(true), d = () => setOnline(false); addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  const start = (new URLSearchParams(location.search).get('s') as Screen) || (store.get().signedIn ? 'jobs' : 'lang')
  useMemo(() => prep(start), [])
  const nav = useNav<Screen>(start, 'push')
  const [, force] = useState(0)
  useEffect(() => () => stopVoice(), [nav.key])
  const j = activeJob()
  const sim: SimAction[] = []
  if (nav.screen === 'code') {
    sim.push({ label: `Student reads the code: ${j.code}`, sub: 'The job closes', run: () => dispatchEvent(new CustomEvent('align-code', { detail: j.code })) })
    sim.push({ label: 'Student reads a wrong code', sub: 'Try again', run: () => dispatchEvent(new CustomEvent('align-code', { detail: j.code.slice(0, 3) + ((+j.code[3] + 4) % 10) })) })
  }
  if (['jobs', 'job', 'details'].includes(nav.screen)) {
    sim.push({ label: 'A student moves their visit', sub: 'Slot changed', run: () => nav.go('slot', { tr: 'wave' }) })
    if (j.id === 'j1') { // these two screens are about the BG04 ceiling fan, so they are offered only on that job
      sim.push({ label: 'A student reopens a job', sub: 'Fan stopped again', run: () => { setJob(j.id, { reopened: true }); nav.go('reopen', { tr: 'wave' }) } })
      sim.push({ label: 'See this fan’s history', sub: 'Past repairs', run: () => nav.go('history') })
    }
  }
  if (['heading', 'details'].includes(nav.screen)) sim.push({ label: 'The door is locked', sub: "Can't get in", run: () => nav.go('cant') })
  if (!['lang', 'staff', 'pin'].includes(nav.screen)) {
    sim.push({ label: 'Internet drops', sub: 'No internet', run: () => nav.go('offline', { tr: 'wave' }) })
    sim.push({ label: 'Server error', sub: 'Something went wrong', run: () => nav.go('e500', { tr: 'wave' }) })
  }
  const jump = (id: string) => { prep(id as Screen); force(x => x + 1); nav.reset(id as Screen, { tr: 'swap' }) }
  const El = ALL[nav.screen]
  return (
    <LangCtx.Provider value={lang}>
    <AppCtx.Provider value={{ nav }}>
      <PhoneStage app="Technician app" accent="#0794FF" bg="#FFFBF3" sim={sim} groups={GROUPS} current={nav.screen} onJump={jump}
        tagline="For IWD electricians, plumbers and carpenters on their hostel round. Hindi first, big buttons, and a speaker on every screen that explains what to do."
        onRestart={() => { store.reset(); nav.reset('lang', { tr: 'wave' }) }}>
        <Stage nav={nav as never} waveColor="#0794FF"><El /></Stage>
        {!(nav.screen === 'bag' && missing) && <Dock screen={nav.screen} onGo={s => nav.reset(s, { tr: 'swap' })} />}
        <OfflineBuddy offline={!online} cx={195} scale={1.05} title="इंटरनेट नहीं है" sub="No internet. Your work is saved and sends itself later." back={{ mood: 'wave', say: 'नेट आ गया!', sub: 'Back online' }} />
        <PeekHost w={390} h={844} size={300} />
      </PhoneStage>
    </AppCtx.Provider>
    </LangCtx.Provider>
  )
}
export default function App() { return <Inner /> }
export { React }
