import { ReactNode, createContext, useContext } from 'react'
import { Back, LangPill, Speaker } from '../components/ui'

export type Lang = 'hi' | 'en'
export const LangCtx = createContext<Lang>('hi')

/* Hindi first, English small below. If the technician switches to EN, English leads. */
export const T = ({ hi, en, className = '', sub = 'text-[12.5px] opacity-75 font-body' }: { hi: string; en: string; className?: string; sub?: string }) => {
  const l = useContext(LangCtx)
  const [a, b] = l === 'hi' ? [hi, en] : [en, hi]
  return <span className={`flex flex-col ${className}`}><span className={l === 'hi' ? 'font-hi font-extrabold leading-tight' : 'font-head font-extrabold leading-tight'}>{a}</span><span className={sub}>{b}</span></span>
}

const Wave = ({ fill }: { fill: string }) => (
  <svg viewBox="0 0 390 24" preserveAspectRatio="none" className="block w-full h-6 -mb-px" aria-hidden><path d="M0 0H390V8C340 22 300 0 240 10S120 24 60 10 20 8 0 12Z" fill="#0794FF" /><path d="M0 12C20 8 40 10 60 10S120 24 240 10 340 22 390 8V24H0Z" fill={fill} /></svg>
)

/* Blue top (title, lang pill, speaker) with wavy edge into a cream or blue bottom */
export function Shell({ title, hiTitle, enTitle, speak, onBack, lang, setLang, top, children, foot, bottom = '#FFFBF3', topClass = '', banner }: {
  title?: never; hiTitle?: string; enTitle?: string; speak: string; onBack?: () => void; lang: Lang; setLang: (l: Lang) => void
  top?: ReactNode; children?: ReactNode; foot?: ReactNode; bottom?: string; topClass?: string; banner?: ReactNode
}) {
  return (
    <div className="h-full flex flex-col" style={{ background: bottom }}>
      {banner}
      <div className={`bg-signal shrink-0 px-5 ${banner ? 'pt-3' : 'pt-[52px]'} ${topClass}`}>
        <div className="flex items-center gap-2 h-11">
          {onBack ? <Back onClick={onBack} /> : <span />}
          <span className="flex-1" /><LangPill lang={lang} onToggle={() => setLang(lang === 'hi' ? 'en' : 'hi')} /><Speaker text={speak} lang={lang === 'hi' ? 'hi-IN' : 'en-IN'} />
        </div>
        {hiTitle && <div className="text-center -mt-1 pb-2"><T hi={hiTitle} en={enTitle || ''} className="items-center text-[28px] [&>span:first-child]:text-[28px]" /></div>}
        {top}
      </div>
      <Wave fill={bottom} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-1">{children}</div>
      {foot && <div className="px-5 pt-2 pb-6 shrink-0 flex flex-col gap-3">{foot}</div>}
    </div>
  )
}

export const Dots = ({ n, of = 4, mask }: { n: number; of?: number; mask?: boolean }) => (
  <div className="flex gap-2 justify-center py-1">{Array.from({ length: of }, (_, i) => <span key={i} className="w-[44px] h-[56px] rounded-[10px] border-[2.5px] border-navy bg-cream flex items-center justify-center font-mono text-[30px]">{i < n ? (mask ? '•' : '') : ''}</span>)}</div>
)
