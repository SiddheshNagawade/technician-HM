import { ReactNode, createContext, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Volume2, Square } from 'lucide-react'
import { IconButton, Tooltip, cx, ToastOpts } from '../ds/ui'
import { NavApi } from '../ds/nav'
import { StatusBar } from '../ds/stage'
import { fx } from '../ds/fx'
import { springPop } from '../ds/motion'
import { store } from './store'
import { VoiceKey, playVoice, stopVoice, useVoicePlaying } from './voice'

export type Screen = 'lang' | 'staff' | 'otp' | 'bag' | 'jobs' | 'job' | 'trip' | 'cant' | 'nobody' | 'work' | 'part' | 'stock' | 'reserved'
  | 'code' | 'photo' | 'done' | 'last' | 'reopen' | 'slot' | 'history' | 'profile' | 'eOffline' | 'eServer'
type AppCtx = { nav: NavApi<Screen>; toast: (t: ToastOpts) => void; online: boolean }
export const Ctx = createContext<AppCtx>(null!)
export const useApp = () => useContext(Ctx)
export const useLang = () => store.use(s => s.lang)

/** Bilingual label: chosen language big, the other small underneath. */
export function T({ hi, en, className, size = 'md', align = 'left', subClass }: { hi: ReactNode; en: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; align?: 'left' | 'center'; subClass?: string }) {
  const lang = useLang()
  const [a, b] = lang === 'hi' ? [hi, en] : [en, hi]
  const big = { sm: 'text-[16px]', md: 'text-[19px]', lg: 'text-[24px]', xl: 'text-[30px]' }[size]
  const small = { sm: 'text-[13px]', md: 'text-[14px]', lg: 'text-[15px]', xl: 'text-[16px]' }[size]
  return (
    <span className={cx('flex flex-col', align === 'center' && 'items-center text-center', className)}>
      <span className={cx(big, 'leading-tight', lang === 'hi' ? 'font-hi font-bold' : 'font-head font-bold')}>{a}</span>
      <span className={cx(small, 'leading-snug opacity-75', lang === 'hi' ? 'font-body' : 'font-hibody', subClass)}>{b}</span>
    </span>
  )
}

/** Speaker: plays the spoken help for this screen. Shows moving bars while talking. */
export function Speaker({ k, size = 44, variant = 'paper', label }: { k: VoiceKey; size?: number; variant?: 'paper' | 'sun'; label?: string }) {
  const lang = useLang(); const playing = useVoicePlaying(); const on = playing === `${lang}:${k}`
  return (
    <Tooltip label={on ? (lang === 'hi' ? 'रोकें' : 'Stop') : label || (lang === 'hi' ? 'सुनें: ये स्क्रीन क्या है' : 'Listen: what this screen is for')}>
      <motion.button aria-label={label || 'Listen to help for this screen'} onClick={() => { fx.tap(); playVoice(k, lang) }} whileTap={{ scale: 0.88 }} transition={springPop}
        className={cx('relative flex shrink-0 items-center justify-center rounded-full border-2 border-navy', on ? 'bg-sun' : variant === 'sun' ? 'bg-sun' : 'bg-paper')} style={{ width: size, height: size }}>
        {on && <motion.span className="absolute inset-[-6px] rounded-full border-2 border-sun" animate={{ scale: [1, 1.25], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
        {on ? (
          <span className="flex h-5 items-end gap-[3px]">{[0, 1, 2, 3].map(i => <motion.span key={i} className="w-[3px] rounded-full bg-navy" animate={{ height: [6, 18, 9, 15, 6] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }} />)}</span>
        ) : <Volume2 size={size * 0.48} strokeWidth={2.4} />}
      </motion.button>
    </Tooltip>
  )
}

/** Language switch pill (हिं · EN) */
export function LangPill() {
  const lang = useLang()
  return (
    <Tooltip label={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}>
      <button onClick={() => { fx.select(); stopVoice(); store.set({ lang: lang === 'hi' ? 'en' : 'hi' }) }} aria-label="Change language"
        className="relative flex h-11 items-center rounded-full border-2 border-navy bg-paper p-1 font-bold">
        {(['hi', 'en'] as const).map(l => (
          <span key={l} className={cx('relative z-10 flex h-full items-center rounded-full px-3 text-[15px]', l === 'hi' ? 'font-hi' : 'font-head', lang === l ? 'text-cream' : 'text-navy')}>
            {lang === l && <motion.span layoutId="langpill" className="absolute inset-0 -z-10 rounded-full bg-navy" transition={springPop} />}
            {l === 'hi' ? 'हिं' : 'EN'}
          </span>
        ))}
      </button>
    </Tooltip>
  )
}

/** Blue field on top with a wave edge, then a cream body and a big action at the bottom. */
export function Shell({ voice, title, sub, back = true, top, children, foot, field = 'h-auto', tone = 'blue', banner }: {
  voice: VoiceKey; title?: { hi: string; en: string }; sub?: ReactNode; back?: boolean; top?: ReactNode; children?: ReactNode; foot?: ReactNode; field?: string; tone?: 'blue' | 'sun' | 'green'; banner?: ReactNode
}) {
  const { nav } = useApp()
  const auto = store.use(s => s.autoVoice); const lang = useLang()
  useEffect(() => { if (auto) { const t = setTimeout(() => playVoice(voice, lang), 500); return () => { clearTimeout(t); stopVoice() } } return () => stopVoice() }, [voice])
  const bg = { blue: 'bg-signal', sun: 'bg-sun', green: 'bg-[#2FB07A]' }[tone]
  const fill = { blue: '#0794FF', sun: '#FFD265', green: '#2FB07A' }[tone]
  return (
    <div className="absolute inset-0 flex flex-col bg-cream">
      <StatusBar dark={false} />
      <div className={cx('relative shrink-0', bg, field)}>
        {banner}
        <div className="flex items-center gap-2 px-5 pt-[50px]">
          {back && nav.depth > 1 ? <IconButton label="Back" onClick={() => { stopVoice(); nav.back() }}><ArrowLeft size={22} strokeWidth={2.5} /></IconButton> : <span className="w-11" />}
          <span className="flex-1" /><LangPill /><Speaker k={voice} />
        </div>
        {title && <motion.div className="px-6 pt-4" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}><T hi={title.hi} en={title.en} size="xl" /></motion.div>}
        {sub && <div className="px-6 pt-1">{sub}</div>}
        <div className="px-5 pb-4">{top}</div>
        <svg className="absolute -bottom-[17px] left-0 w-full" height="18" viewBox="0 0 390 18" preserveAspectRatio="none" aria-hidden><path d="M0 0 H390 V6 C 340 18, 300 18, 260 8 C 220 -1, 175 -1, 130 9 C 90 18, 45 18, 0 6 Z" fill={fill} /></svg>
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto px-5 pt-7 no-scrollbar">{children}</div>
      {foot && <div className="shrink-0 px-5 pb-8 pt-3">{foot}</div>}
    </div>
  )
}

/** The technician's main action: Hindi big, English small, arrow. Big enough for gloves. */
export function Big({ hi, en, onClick, icon, variant = 'blue', disabled, sound = 'tap' }: { hi: string; en: string; onClick: () => void; icon?: ReactNode; variant?: 'blue' | 'paper' | 'sun' | 'danger'; disabled?: boolean; sound?: 'tap' | 'success' | 'select' }) {
  const lang = useLang()
  const [a, b] = lang === 'hi' ? [hi, en] : [en, hi]
  const v = { blue: 'bg-signal2 text-white', paper: 'bg-paper text-navy', sun: 'bg-sun text-navy', danger: 'bg-ember text-white' }[variant]
  return (
    <motion.button disabled={disabled} onClick={() => { fx[sound](); stopVoice(); onClick() }} whileTap={disabled ? undefined : { y: 3, boxShadow: '0 0 0 #00224E' }} transition={{ type: 'spring', stiffness: 900, damping: 30 }}
      className={cx('flex min-h-[76px] w-full items-center justify-between gap-3 rounded-[20px] border-2 border-navy px-5 text-left shadow-btn', v, disabled && 'opacity-50 !shadow-none')}>
      <span className="flex min-w-0 flex-col">
        <span className={cx('truncate text-[26px] leading-[1.1]', lang === 'hi' ? 'font-hi font-extrabold' : 'font-head font-extrabold')}>{a}</span>
        <span className={cx('truncate text-[14px] opacity-85', lang === 'hi' ? 'font-body' : 'font-hibody')}>{b}</span>
      </span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">{icon || <ArrowRight size={26} strokeWidth={2.6} />}</span>
    </motion.button>
  )
}

/** Small bilingual link-style button under the main action */
export function Small({ hi, en, onClick }: { hi: string; en: string; onClick: () => void }) {
  const lang = useLang()
  return (
    <button onClick={() => { fx.tap(); onClick() }} className="mt-1 flex min-h-[48px] w-full flex-col items-center justify-center text-center">
      <span className={cx('text-[16px] font-bold underline decoration-2 underline-offset-4', lang === 'hi' ? 'font-hi' : 'font-head')}>{lang === 'hi' ? hi : en}</span>
      <span className="text-[13px] text-mid">{lang === 'hi' ? en : hi}</span>
    </button>
  )
}
export { Square }
