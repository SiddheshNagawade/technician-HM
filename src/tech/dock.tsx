/* The bottom bar of the technician app: Jobs, Bag (tools), History, Profile. Hindi first, English small (they swap in English mode).
   It sits on the main screens only (not while signing in, and not on a screen where a job is in progress), and the screens
   move their big buttons up by DOCK_PUSH so nothing is ever covered. */
import React from 'react'
import { LangCtx } from '../fig/Fig'
import { fx } from '../ds/fx'
import { useAssets } from '../fig/preload'
import { BAR_H } from '../ds/stage'
import type { Screen } from './screens'

export const DOCK_H = BAR_H
/** The bar is on every screen after signing in. Which tab is lit follows what the screen is about. */
export const NO_DOCK: Screen[] = ['lang', 'staff', 'pin']
export const showsDock = (s: Screen) => !NO_DOCK.includes(s)
const LIT: Partial<Record<Screen, 'jobs' | 'bag' | 'history' | 'profile'>> = { bag: 'bag', part: 'bag', stock: 'bag', reserved: 'bag', history: 'history', profile: 'profile' }
const litOf = (s: Screen) => LIT[s] || 'jobs'

const NAVY = '#00224E'
// the same hand-drawn pictures as the supervisor's sidebar
const PIC = { jobs: 'check', bag: 'fixtures', history: 'desk', profile: 'team' } as const
const BASE = import.meta.env.BASE_URL
const PICS = Object.values(PIC).map(n => `${BASE}fig/ico-rail-${n}.svg`)
const TABS: { id: 'jobs' | 'bag' | 'history' | 'profile'; go: Screen; hi: string; en: string }[] = [
  { id: 'jobs', go: 'jobs', hi: 'काम', en: 'Jobs' }, { id: 'bag', go: 'bag', hi: 'बैग', en: 'Bag' },
  { id: 'history', go: 'history', hi: 'इतिहास', en: 'History' }, { id: 'profile', go: 'profile', hi: 'प्रोफ़ाइल', en: 'Profile' },
]

export function Dock({ screen, onGo }: { screen: Screen; onGo: (s: Screen) => void }) {
  const lang = React.useContext(LangCtx)
  const lit = litOf(screen)
  const ready = useAssets(PICS) // the bar appears with its pictures, never before them
  if (!showsDock(screen) || !ready) return null
  return (
    <nav aria-label="Main" style={{ width: 390, height: DOCK_H, display: 'flex' }}>
      {TABS.map(t => {
        const on = t.id === lit
        const [big, small] = lang === 'en' ? [t.en, t.hi] : [t.hi, t.en]
        return (
          <button key={t.id} type="button" aria-current={on ? 'page' : undefined} aria-label={`${t.hi} · ${t.en}`} className="fig-press"
            onClick={() => { if (on) return; fx.tap(); onGo(t.go) }}
            style={{ flex: 1, border: 0, background: 'none', padding: '3px 0 0', cursor: on ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <span style={{ width: 46, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#FFD265' : 'transparent', boxShadow: on ? `0 0 0 2px ${NAVY}` : 'none', transition: 'background .2s' }}>
              <img src={`${BASE}fig/ico-rail-${PIC[t.id]}.svg`} alt="" draggable={false} style={{ width: 26, height: 26, objectFit: 'contain' }} />
            </span>
            <span key={lang} style={{ font: `800 ${big.length > 7 ? 11 : 12}px/13px "Baloo 2","Noto Sans Devanagari","DM Sans",sans-serif`, color: NAVY, animation: 'figfade .35s ease both' }}>{big}</span>
            <span style={{ font: '500 9px/11px "DM Sans",sans-serif', color: '#3E4F72', opacity: 0.85 }}>{small}</span>
          </button>
        )
      })}
    </nav>
  )
}
