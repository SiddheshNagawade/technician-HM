/* The bottom bar of the technician app: Jobs, Bag (tools), History, Profile. Hindi first, English small (they swap in English mode).
   It sits on the main screens only (not while signing in, and not on a screen where a job is in progress), and the screens
   move their big buttons up by DOCK_PUSH so nothing is ever covered. */
import React from 'react'
import { LangCtx } from '../fig/Fig'
import { fx } from '../ds/fx'
import type { Screen } from './screens'

export const DOCK_H = 60
export const DOCK_TOP = 844 - DOCK_H
/** Screens that show the bar -> which tab is lit. */
export const DOCKED: Partial<Record<Screen, 'jobs' | 'bag' | 'history' | 'profile'>> = { jobs: 'jobs', last: 'jobs', bag: 'bag', history: 'history', profile: 'profile' }

const NAVY = '#00224E'
const ICONS: Record<string, React.ReactNode> = {
  jobs: <><rect x="6" y="5" width="16" height="19" rx="3.5" /><path d="M10.5 5V3.8h7V5" /><path d="M10 14.5l3 3 5-6" /></>,
  bag: <><rect x="4" y="10" width="20" height="13" rx="3.5" /><path d="M10 10V7.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V10" /><path d="M4 16h20" /><path d="M12.5 16v2.5h3V16" /></>,
  history: <><circle cx="14" cy="14" r="9.5" /><path d="M14 8.5V14l3.8 2.4" /></>,
  profile: <><circle cx="14" cy="10" r="4.2" /><path d="M5.5 23c.8-4.6 4-6.8 8.5-6.8s7.7 2.2 8.5 6.8" /></>,
}
const TABS: { id: 'jobs' | 'bag' | 'history' | 'profile'; go: Screen; hi: string; en: string }[] = [
  { id: 'jobs', go: 'jobs', hi: 'काम', en: 'Jobs' }, { id: 'bag', go: 'bag', hi: 'बैग', en: 'Bag' },
  { id: 'history', go: 'history', hi: 'इतिहास', en: 'History' }, { id: 'profile', go: 'profile', hi: 'प्रोफ़ाइल', en: 'Profile' },
]

export function Dock({ screen, onGo }: { screen: Screen; onGo: (s: Screen) => void }) {
  const lang = React.useContext(LangCtx)
  const lit = DOCKED[screen]
  if (!lit) return null
  return (
    <nav aria-label="Main" style={{ position: 'absolute', left: 0, top: DOCK_TOP, width: 390, height: DOCK_H, zIndex: 40, display: 'flex', background: '#FFFBF3', borderTop: `2.5px solid ${NAVY}`, boxSizing: 'border-box' }}>
      {TABS.map(t => {
        const on = t.id === lit
        const [big, small] = lang === 'en' ? [t.en, t.hi] : [t.hi, t.en]
        return (
          <button key={t.id} type="button" aria-current={on ? 'page' : undefined} aria-label={`${t.hi} · ${t.en}`} className="fig-press"
            onClick={() => { if (on) return; fx.tap(); onGo(t.go) }}
            style={{ flex: 1, border: 0, background: 'none', padding: '5px 0 0', cursor: on ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <span style={{ width: 44, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#FFD265' : 'transparent', boxShadow: on ? `0 0 0 2px ${NAVY}` : 'none', transition: 'background .2s' }}>
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{ICONS[t.id]}</svg>
            </span>
            <span key={lang} style={{ font: `800 ${big.length > 7 ? 11 : 12}px/14px "Baloo 2","Noto Sans Devanagari","DM Sans",sans-serif`, color: NAVY, animation: 'figfade .35s ease both' }}>{big}</span>
            <span style={{ font: '500 9px/10px "DM Sans",sans-serif', color: '#3E4F72', opacity: 0.85 }}>{small}</span>
          </button>
        )
      })}
    </nav>
  )
}
