/* English for the Hindi lines that have no English line beside them. In English mode every Hindi / English pair simply swaps places
   (see LangCtx in ../fig/Fig.tsx); the lines below stand alone on their screens, so they are translated here. */
import { setToEnglish } from '../fig/Fig'
import { store } from './store'

const WORDS: Record<string, string> = {
  'सुनें': 'Listen', 'सामान': 'Bag', 'रास्ता': 'Way', 'दरवाज़ा': 'Door', 'मरम्मत': 'Repair', 'कोड': 'Code', 'आगे': 'Next',
  'विद्यार्थी का संदेश': 'Message from the student', 'विद्यार्थी ने बताया': 'The student says', 'पंखा फिर रुक गया': 'The fan stopped again', 'फिर से': 'Again',
  'विद्यार्थी ने बदला': 'The student changed it', 'पहले': 'Before', 'अब': 'Now', 'बाद में': 'After',
  'आज की शिफ़्ट': "Today's shift", 'सुबह 10 से शाम 6': '10 AM to 6 PM', 'हिंदी': 'Hindi', 'दोनों': 'Both',
  'आप': 'You', 'लगभग 5 मिनट': 'About 5 minutes', 'गलत? फिर से डालें': 'Wrong? Type it again', 'कोई नया काम नहीं': 'No new jobs',
  'कोई संदेश नहीं': 'No message', 'दौरा 1 / 2': 'Visit 1 of 2', 'कैपेसिटर': 'Capacitor', 'स्टोर': 'Store', 'पास का ब्लॉक': 'Nearby block',
  'स्टोर में': 'In the store', 'पास के ब्लॉक में': 'In the nearby block', 'बेयरिंग की आवाज़': 'Bearing noise',
  '3 बार, 5 महीने में': '3 times in 5 months', '3 हफ़्ते पहले': '3 weeks ago', '2 महीने पहले': '2 months ago', '5 महीने पहले': '5 months ago',
  'कमरे में विद्यार्थी होंगे': 'The student will be in the room', 'गलियारा, खुला है': 'The corridor is open', 'वॉशरूम, खुला है': 'The washroom is open', 'वार्डन दरवाज़ा खोलेंगी': 'The warden will open the door',
}
const DAYPART: Record<string, string> = { 'सुबह': 'AM', 'दोपहर': 'PM', 'शाम': 'PM', 'रात': 'PM' }

/** "दोपहर 2:30–3:00 बजे" -> "2:30 to 3:00 PM", "दोपहर 2:30" -> "2:30 PM", "आज दोपहर 2:30 बजे" -> "Today 2:30 PM" */
function time(hi: string): string | undefined {
  const m = hi.match(/^(आज )?(सुबह|दोपहर|शाम|रात)? ?(\d{1,2}:\d{2})(?:[–-](\d{1,2}:\d{2}))?( बजे)?$/)
  if (!m) return undefined
  const part = m[2] ? DAYPART[m[2]] : ''
  const body = m[4] ? `${m[3]} to ${m[4]} ${part}` : `${m[3]} ${part}`
  return (m[1] ? 'Today ' : '') + body.trim()
}

export function installEnglish() {
  setToEnglish(hi => {
    const w = WORDS[hi]; if (w) return w
    const t = time(hi); if (t) return t
    for (const j of store.get().jobs) {
      if (hi === j.issueHi) return j.issueEn
      if (hi === j.noteHi && j.noteEn) return j.noteEn
      if (hi === j.slotHi) return j.slotEn
      if (hi === j.itemHi) return j.item
    }
    return undefined
  })
}
