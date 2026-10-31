/* Technician app state: Ravi Kumar, electrician, IWD Electrical. Evening hostel round. */
import { createStore, H, code4 } from '../data/iitr'

export type JobStatus = 'next' | 'queued' | 'done' | 'missed' | 'part'
export type Job = {
  id: string; bhawan: string; girls: boolean; room: string; place: string; item: string; itemHi: string; issue: string; issueHi: string
  time: string; timeHi: string; student: string; note: string; noteHi: string; access: 'in' | 'warden'; shared: number; code: string
  status: JobStatus; art: string; history: { what: string; whatHi: string; when: string; whenHi: string }[]
}
export type BagItem = { id: string; hi: string; en: string; art: string }
export const BAG: BagItem[] = [
  { id: 'toolkit', hi: 'औज़ार', en: 'Toolkit', art: 'item-toolkit' }, { id: 'fuse', hi: 'फ़्यूज़', en: 'Fuses', art: 'item-fuse' },
  { id: 'blades', hi: 'पंखे के पंख', en: 'Fan blades', art: 'item-blades' }, { id: 'bulb', hi: 'बल्ब', en: 'Bulbs', art: 'item-bulb' },
  { id: 'tape', hi: 'टेप', en: 'Tape', art: 'item-tape' }, { id: 'gloves', hi: 'दस्ताने', en: 'Gloves', art: 'item-gloves' },
]
export const PARTS = [
  { id: 'cap', hi: 'कैपेसिटर', en: 'Capacitor 2.5 µF', art: 'part-cap', store: 2, near: 1 },
  { id: 'motor', hi: 'पंखे की मोटर', en: 'Fan motor', art: 'part-motor', store: 0, near: 1 },
  { id: 'switch', hi: 'स्विच', en: 'Switch', art: 'part-switch', store: 6, near: 3 },
  { id: 'bulb', hi: 'चोक / बल्ब', en: 'Choke / bulb', art: 'part-bulb', store: 4, near: 0 },
  { id: 'washer', hi: 'नल की वॉशर', en: 'Tap washer', art: 'part-washer', store: 9, near: 2 },
  { id: 'other', hi: 'कुछ और', en: 'Something else', art: 'part-other', store: 0, near: 0 },
]

const seedJobs = (): Job[] => [
  {
    id: 'j1', bhawan: 'Rajendra Bhawan', girls: false, room: 'C-214', place: 'Room', item: 'Tube light', itemHi: 'ट्यूबलाइट', issue: 'Flickering', issueHi: 'टिमटिमा रही है',
    time: '5:30 PM', timeHi: 'शाम 5:30', student: 'Aman', note: '', noteHi: '', access: 'in', shared: 0, code: code4(), status: 'done', art: 'part-bulb', history: [],
  },
  {
    id: 'j2', bhawan: 'Himalaya Bhawan', girls: true, room: 'B-104', place: 'Room', item: 'Ceiling fan', itemHi: 'पंखा', issue: 'Not spinning', issueHi: 'पंखा नहीं चल रहा',
    time: '6:00 PM', timeHi: 'शाम 6:00', student: 'Siddhi', note: 'Fan runs for a few minutes, then stops. Ticking sound.', noteHi: 'पंखा थोड़ी देर चलकर रुक जाता है। टिक टिक की आवाज़।',
    access: 'in', shared: 0, code: '4729', status: 'next', art: 'drawing',
    history: [{ what: 'Capacitor replaced', whatHi: 'कैपेसिटर बदला', when: '3 weeks ago', whenHi: '3 हफ़्ते पहले' }, { what: 'Cleaned and oiled', whatHi: 'साफ़ किया, तेल डाला', when: '2 months ago', whenHi: '2 महीने पहले' }, { what: 'Bearing noise', whatHi: 'बेयरिंग की आवाज़', when: '5 months ago', whenHi: '5 महीने पहले' }],
  },
  {
    id: 'j3', bhawan: 'Himalaya Bhawan', girls: true, room: 'F1 Corridor', place: 'Corridor', item: 'Tube light', itemHi: 'ट्यूबलाइट', issue: 'Not turning on', issueHi: 'जल नहीं रही',
    time: '6:30 PM', timeHi: 'शाम 6:30', student: '3 students', note: 'Near the water cooler', noteHi: 'वॉटर कूलर के पास', access: 'in', shared: 3, code: code4(), status: 'queued', art: 'part-bulb', history: [],
  },
  {
    id: 'j4', bhawan: 'Govind Bhawan', girls: false, room: 'A-012', place: 'Room', item: 'Socket', itemHi: 'सॉकेट', issue: 'Loose, no power', issueHi: 'ढीला है, बिजली नहीं',
    time: '7:30 PM', timeHi: 'शाम 7:30', student: 'Rohit', note: 'Laptop charger falls out', noteHi: 'चार्जर निकल जाता है', access: 'warden', shared: 0, code: code4(), status: 'queued', art: 'socket', history: [],
  },
]

export type State = {
  lang: 'hi' | 'en'; signedIn: boolean; staff: string; otp: string
  packed: string[]; missing: string[]; jobs: Job[]; activeId: string; workStart: number; steps: number[]; photos: number; part: string
  autoVoice: boolean; slotChanged: boolean
}
export const store = createStore<State>('align.tech.v2', () => ({
  lang: 'hi', signedIn: false, staff: '', otp: '', packed: [], missing: [], jobs: seedJobs(), activeId: 'j2', workStart: Date.now() - 0.2 * H,
  steps: [], photos: 0, part: 'cap', autoVoice: false, slotChanged: false,
}))
export const activeJob = () => { const s = store.get(); return s.jobs.find(j => j.id === s.activeId) || s.jobs[1] }
export const setJob = (id: string, p: Partial<Job>) => store.set(s => ({ jobs: s.jobs.map(j => (j.id === id ? { ...j, ...p } : j)) }))
export function finishActive(status: JobStatus = 'done') {
  const s = store.get()
  const jobs = s.jobs.map(j => (j.id === s.activeId ? { ...j, status } : j))
  const next = jobs.find(j => j.status === 'queued')
  store.set({ jobs: next ? jobs.map(j => (j.id === next.id ? { ...j, status: 'next' } : j)) : jobs, activeId: next?.id || s.activeId, steps: [], photos: 0 })
  return next
}
