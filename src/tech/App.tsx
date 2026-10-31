import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNav, Stage } from '../ds/nav'
import { PhoneStage, ScreenGroup, SimAction } from '../ds/stage'
import { ToastHost, ToastOutlet, useToast } from '../ds/ui'
import { Ctx, Screen } from './shell'
import * as A from './start'
import * as B from './job'
import { store, activeJob } from './store'
import { stopVoice } from './voice'

const GROUPS: ScreenGroup[] = [
  { title: 'Getting in', items: [{ id: 'lang', label: 'Choose language' }, { id: 'staff', label: 'Staff number' }, { id: 'otp', label: 'OTP' }, { id: 'bag', label: 'Morning bag' }] },
  { title: 'The round', items: [{ id: 'jobs', label: "Today's jobs" }, { id: 'job', label: 'Job details' }, { id: 'history', label: 'Fixture history' }, { id: 'trip', label: 'On the way' }, { id: 'cant', label: "Can't get in" }, { id: 'nobody', label: 'Notice left' }] },
  { title: 'Doing the job', items: [{ id: 'work', label: 'Working' }, { id: 'part', label: 'Which part' }, { id: 'stock', label: 'Stock status' }, { id: 'reserved', label: 'Part reserved' }, { id: 'code', label: 'Closing code' }, { id: 'photo', label: 'Close with photo' }, { id: 'done', label: 'Job closed' }, { id: 'last', label: 'All done today' }] },
  { title: 'Changes and help', items: [{ id: 'reopen', label: 'Job reopened' }, { id: 'slot', label: 'Slot changed' }, { id: 'profile', label: 'Profile' }, { id: 'eOffline', label: 'No internet' }, { id: 'eServer', label: 'Server error' }] },
]

function Inner() {
  const s0 = store.get()
  const nav = useNav<Screen>((new URLSearchParams(location.search).get('s') as Screen) || (s0.signedIn ? 'jobs' : 'lang'), 'push')
  const toast = useToast()
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const u = () => setOnline(true), d = () => setOnline(false); addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  useEffect(() => () => stopVoice(), [nav.key])

  const sim = useMemo<SimAction[]>(() => {
    const out: SimAction[] = []
    const j = activeJob()
    if (nav.screen === 'code') {
      out.push({ label: `Student reads the code: ${j.code}`, sub: 'The job closes', run: () => dispatchEvent(new CustomEvent('align-code', { detail: j.code })) })
      out.push({ label: 'Student reads a wrong code', sub: 'See the error', run: () => dispatchEvent(new CustomEvent('align-code', { detail: j.code.slice(0, 3) + ((Number(j.code[3]) + 4) % 10) })) })
    }
    if (nav.screen === 'jobs' || nav.screen === 'job') {
      out.push({ label: 'A student moves their visit', sub: 'Slot changed alert', run: () => { toast({ kind: 'system', app: 'ALIGN', title: 'समय बदला · Slot changed', body: 'B-104: 6:00 PM → 7:00 PM', onTap: () => nav.go('slot', { tr: 'wave' }) }); nav.go('slot', { tr: 'wave' }) } })
      out.push({ label: 'A student reopens a job', sub: 'Fan stopped again', run: () => { toast({ kind: 'system', app: 'ALIGN', title: 'काम फिर खुला · Job reopened', body: 'B-104 ceiling fan stopped again' }); nav.go('reopen', { tr: 'wave' }) } })
    }
    if (nav.screen === 'trip' || nav.screen === 'job') out.push({ label: 'Student is not in the room', sub: 'Door locked', run: () => nav.go('cant') })
    if (!['lang', 'staff', 'otp'].includes(nav.screen)) {
      out.push({ label: 'Internet drops', sub: 'Offline screen', run: () => nav.go('eOffline', { tr: 'wave' }) })
      out.push({ label: 'Server error', sub: 'Error screen', run: () => nav.go('eServer', { tr: 'wave' }) })
    }
    return out
  }, [nav.screen, nav.key])

  const jump = (id: string) => {
    const scr = id as Screen
    if (!['lang', 'staff', 'otp'].includes(scr)) store.set({ signedIn: true, staff: store.get().staff || '4721' })
    if (['job', 'trip', 'work', 'code', 'photo', 'history', 'reopen', 'cant', 'nobody', 'part', 'stock', 'reserved'].includes(scr) && !store.get().jobs.some(j => j.status === 'next')) store.reset()
    if (scr === 'work') store.set({ workStart: Date.now() - 754_000 })
    nav.reset(scr, { tr: 'wave' })
  }

  const v: Record<Screen, React.ReactElement> = {
    lang: <A.Lang />, staff: <A.Staff />, otp: <A.Otp />, bag: <A.Bag />, jobs: <A.Jobs />, profile: <A.Profile />, eOffline: <A.ErrorScreen kind="offline" />, eServer: <A.ErrorScreen kind="server" />,
    job: <B.Job />, trip: <B.Trip />, cant: <B.Cant />, nobody: <B.Nobody />, work: <B.Work />, part: <B.Part />, stock: <B.Stock />, reserved: <B.Reserved />,
    code: <B.Code />, photo: <B.Photo />, done: <B.Done />, last: <B.Last />, reopen: <B.Reopen />, slot: <B.Slot />, history: <B.HistoryScreen />,
  }
  return (
    <Ctx.Provider value={{ nav, toast, online }}>
      <PhoneStage app="Technician app" accent="#0794FF" bg="#FFFBF3" sim={sim}
        tagline="For IWD electricians, plumbers and carpenters on their hostel round. Hindi first, big buttons, and a speaker on every screen that explains what to do."
        groups={GROUPS} current={nav.screen} onJump={jump} onRestart={() => { store.reset(); nav.reset('lang', { tr: 'wave' }) }}>
        <Stage nav={nav as never} waveColor="#0794FF">{v[nav.screen]}</Stage>
        <ToastOutlet />
      </PhoneStage>
    </Ctx.Provider>
  )
}

export default function App() { return <ToastHost><Inner /></ToastHost> }
