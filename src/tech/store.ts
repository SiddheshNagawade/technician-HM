/* Technician app state: Ravi Kumar, IWD electrician, staff no. 014, day round (10 AM to 6 PM) in Himalaya Bhawan.
   Mock and local: any staff number and PIN work. The jobs match the Figma screens. */
import { createStore } from '../data/iitr'

export type JobStatus = 'next' | 'queued' | 'done' | 'missed' | 'part'
export type Job = {
  id: string; room: string; item: string; itemHi: string; issueHi: string; issueEn: string; timeHi: string; slotHi: string; slotEn: string
  noteHi: string; noteEn: string; accessHi: string; photo: string
  steps3: [string, string][]; photoHi: string; photoEn: string; part: string; place: 'Room' | 'Corridor' | 'Washroom' | 'Common room' | 'Stairs'; code: string; status: JobStatus; icon: string; reopened?: boolean
}
const jobs = (): Job[] => [
  { id: 'j1', room: 'BG04', item: 'Ceiling fan', itemHi: 'पंखा', issueHi: 'पंखा नहीं चल रहा', issueEn: 'Ceiling fan not working', timeHi: 'दोपहर 2:30 बजे', slotHi: 'दोपहर 2:30–3:00 बजे', slotEn: '2:30 to 3:00 PM',
    noteHi: 'पंखा थोड़ी देर चलकर रुक जाता है', noteEn: 'The fan runs for a while, then stops', accessHi: 'कमरे में विद्यार्थी होंगे', photo: 'fan', steps3: [['पंखा बंद करें', 'Switch off'], ['कैपेसिटर जाँचें', 'Check the capacitor'], ['चलाकर देखें', 'Test run']], photoHi: 'ठीक किए हुए पंखे की फ़ोटो', photoEn: 'A photo of the fixed fan', part: 'cap', place: 'Room', code: '4729', status: 'next', icon: '232:326' },
  { id: 'j2', room: 'F2', item: 'Tube light', itemHi: 'ट्यूबलाइट', issueHi: 'गलियारे की ट्यूबलाइट नहीं जल रही', issueEn: 'Corridor tube light not working', timeHi: 'दोपहर 3:00 बजे', slotHi: 'दोपहर 3:00–3:30 बजे', slotEn: '3:00 to 3:30 PM',
    noteHi: 'वॉटर कूलर के पास वाली लाइट', noteEn: 'The light near the water cooler', accessHi: 'गलियारा, खुला है', photo: '', steps3: [['स्विच बंद करें', 'Switch off'], ['चोक और ट्यूब जाँचें', 'Check the choke and the tube'], ['जलाकर देखें', 'Test the light']], photoHi: 'ठीक की हुई ट्यूबलाइट की फ़ोटो', photoEn: 'A photo of the fixed tube light', part: 'bulb', place: 'Corridor', code: '1586', status: 'queued', icon: '232:372' },
  { id: 'j3', room: 'W1', item: 'Geyser switch', itemHi: 'गीज़र स्विच', issueHi: 'वॉशरूम का गीज़र स्विच ख़राब', issueEn: 'Washroom geyser switch not working', timeHi: 'दोपहर 3:30 बजे', slotHi: 'दोपहर 3:30–4:00 बजे', slotEn: '3:30 to 4:00 PM',
    noteHi: 'स्विच दबाने पर कुछ नहीं होता', noteEn: 'Nothing happens when the switch is pressed', accessHi: 'वॉशरूम, खुला है', photo: 'switch', steps3: [['गीज़र बंद करें', 'Turn the geyser off'], ['स्विच की वायरिंग जाँचें', 'Check the switch wiring'], ['चालू करके देखें', 'Test the geyser']], photoHi: 'ठीक किए हुए स्विच की फ़ोटो', photoEn: 'A photo of the fixed switch', part: 'switch', place: 'Washroom', code: '3041', status: 'queued', icon: '232:378' },
  { id: 'j4', room: '305', item: 'Socket', itemHi: 'सॉकेट', issueHi: 'सॉकेट ढीला है', issueEn: 'Loose socket', timeHi: 'दोपहर 1:30 बजे', slotHi: 'दोपहर 1:30–2:00 बजे', slotEn: '1:30 to 2:00 PM',
    noteHi: '', noteEn: '', accessHi: 'कमरे में विद्यार्थी होंगे', photo: '', steps3: [['मेन स्विच बंद करें', 'Switch off the mains'], ['सॉकेट कसें', 'Tighten the socket'], ['प्लग लगाकर देखें', 'Test with a plug']], photoHi: 'ठीक किए हुए सॉकेट की फ़ोटो', photoEn: 'A photo of the fixed socket', part: 'switch', place: 'Room', code: '8812', status: 'done', icon: '232:351' },
]
export const BAG = [
  { id: 'toolkit', hi: 'औज़ार', en: 'Toolkit' }, { id: 'fuse', hi: 'फ़्यूज़', en: 'Fuses' }, { id: 'blades', hi: 'पंखे के पंख', en: 'Fan blades' },
  { id: 'bulb', hi: 'बल्ब', en: 'Bulbs' }, { id: 'tape', hi: 'टेप', en: 'Tape' }, { id: 'gloves', hi: 'दस्ताने', en: 'Gloves' },
]
export const PARTS = [
  { id: 'motor', hi: 'पंखे की मोटर', en: 'Fan motor', store: 0, near: 1 }, { id: 'cap', hi: 'कैपेसिटर', en: 'Capacitor', store: 2, near: 1 },
  { id: 'switch', hi: 'स्विच', en: 'Switch', store: 6, near: 3 }, { id: 'bulb', hi: 'बल्ब', en: 'Bulb', store: 4, near: 0 },
  { id: 'washer', hi: 'नल की वॉशर', en: 'Tap washer', store: 9, near: 2 }, { id: 'other', hi: 'कुछ और', en: 'Something else', store: 0, near: 0 },
]
export type State = {
  lang: 'hi' | 'en'; voiceMode: 'hi' | 'both' | 'en'; signedIn: boolean; staff: string; pin: string
  missing: string[]; jobs: Job[]; activeId: string; workStart: number; steps: boolean[]; photos: [boolean, boolean]; pics: [string, string]; part: string; autoVoice: boolean
}
export const store = createStore<State>('align.tech.fig.v4', () => ({
  lang: 'hi', voiceMode: 'both', signedIn: false, staff: '', pin: '', missing: [], jobs: jobs(), activeId: 'j1', workStart: Date.now() - 760_000,
  steps: [true, true, false], photos: [true, false], pics: ['', ''], part: 'cap', autoVoice: false,
}))
export const activeJob = (s = store.get()) => s.jobs.find(j => j.id === s.activeId) || s.jobs[0]
export const setJob = (id: string, p: Partial<Job>) => store.set(s => ({ jobs: s.jobs.map(j => (j.id === id ? { ...j, ...p } : j)) }))
/** Close the active job and move "next" to the following one. Returns the new next job, if any. */
export function finishActive(status: JobStatus = 'done') {
  const s = store.get()
  const list = s.jobs.map(j => (j.id === s.activeId ? { ...j, status } : j))
  const next = list.find(j => j.status === 'queued')
  store.set({ jobs: next ? list.map(j => (j.id === next.id ? { ...j, status: 'next' as const } : j)) : list, activeId: next?.id || s.activeId, steps: [false, false, false], photos: [false, false], workStart: Date.now() })
  return next
}
export const counts = (s = store.get()) => ({ left: s.jobs.filter(j => j.status === 'next' || j.status === 'queued').length, done: s.jobs.filter(j => j.status === 'done').length, total: s.jobs.length })
export const HI_DIGITS = (n: number) => String(n)
