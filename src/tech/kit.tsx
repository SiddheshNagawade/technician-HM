import { ReactNode, createContext, useContext } from 'react'
import { Art, Back, LangPill, Speaker } from '../components/ui'

export type Lang = 'hi' | 'en'
export const LangCtx = createContext<Lang>('hi')

/* Hindi first, English small below. If the technician switches to EN, English leads. */
export const T = ({ hi, en, className = '', sub = 'text-[12.5px] opacity-75 font-body' }: { hi: string; en: string; className?: string; sub?: string }) => {
  const l = useContext(LangCtx)
  const [a, b] = l === 'hi' ? [hi, en] : [en, hi]
  return <span className={`flex flex-col ${className}`}><span className={l === 'hi' ? 'font-hi font-extrabold leading-tight' : 'font-head font-extrabold leading-tight'}>{a}</span><span className={sub}>{b}</span></span>
}

/* Blue field (Figma "field" frame) on top, wavy edge into the cream sheet. fieldH is the Figma field height. */
export function Shell({ hiTitle, enTitle, speak, onBack, lang, setLang, top, children, foot, bottom = '#FFFBF3', fieldH = 240, banner }: {
  hiTitle?: string; enTitle?: string; speak: string; onBack?: () => void; lang: Lang; setLang: (l: Lang) => void
  top?: ReactNode; children?: ReactNode; foot?: ReactNode; bottom?: string; fieldH?: number; banner?: ReactNode
}) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: bottom }}>
      <Art n="field" className="absolute left-0 top-0 w-full pointer-events-none" style={{ height: fieldH }} />
      {banner}
      <div className="relative shrink-0 px-5" style={{ minHeight: fieldH - 16 }}>
        <div className="flex items-center gap-2 pt-[30px] h-[74px]">
          {onBack ? <Back onClick={onBack} /> : <span />}
          <span className="flex-1" /><LangPill lang={lang} onToggle={() => setLang(lang === 'hi' ? 'en' : 'hi')} /><Speaker text={speak} lang={lang === 'hi' ? 'hi-IN' : 'en-IN'} />
        </div>
        {hiTitle && <div className="text-center"><T hi={hiTitle} en={enTitle || ''} className="items-center [&>span:first-child]:text-[28px]" sub="text-[12.5px] opacity-80 font-body" /></div>}
        {top}
      </div>
      <div className="relative flex-1 min-h-0 overflow-y-auto px-5">{children}</div>
      {foot && <div className="relative px-5 pt-2 pb-6 shrink-0 flex flex-col gap-3">{foot}</div>}
    </div>
  )
}

export const Dots = ({ value, of = 4, mask }: { value: string; of?: number; mask?: boolean }) => (
  <div className="flex gap-2 justify-center">{Array.from({ length: of }, (_, i) => <span key={i} className={`w-[44px] h-[56px] rounded-[10px] border-[2.5px] border-navy flex items-center justify-center font-mono text-[30px] ${i < value.length ? 'bg-cream' : 'bg-sun2'}`}>{value[i] ? (mask ? '•' : value[i]) : ''}</span>)}</div>
)
