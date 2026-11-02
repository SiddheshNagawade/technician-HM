/* Technician side of the live link: scheduled student requests become jobs; heading out and closing move the student's screen. */
import { store, Job } from './store'
import { pushReq, watchReqs, Remote } from '../data/sync'
const cache = new Map<string, Remote>(), sent = new Map<string, number>()
watchReqs(r => {
  cache.set(r.id, r); const d = r.data, id = 'q' + r.id
  if (d.stage < 5 && d.item && !store.get().jobs.some(j => j.id === id)) {
    const t = store.get().jobs[0], w = String(d.where || ''), when = (d.times && d.times.length > 1 ? d.times.join(' / ') : d.slot) || ''
    const text = [d.issue, d.note].filter(Boolean).join(' · ')
    const job: Job = { ...t, id, room: w.split(' ').pop() || w, item: d.item, itemHi: d.item, issueHi: d.item, issueEn: `${d.item}${d.issue ? ': ' + d.issue : ''}`, timeHi: when, slotHi: when, slotEn: when,
      noteHi: text, noteEn: text, accessHi: d.letIn ? 'Let in if out' : 'Student will be there', photo: d.photo || '', place: /corridor/i.test(w) ? 'Corridor' : /washroom/i.test(w) ? 'Washroom' : /stairs/i.test(w) ? 'Stairs' : /common/i.test(w) ? 'Common room' : 'Room',
      steps3: [['समस्या जाँचें', 'Check the problem'], ['ठीक करें', 'Fix it'], ['चलाकर देखें', 'Test it']], code: d.code || t.code, status: 'next', reopened: false }
    // the newest request becomes the big "next job" card, so it can be started right away
    store.set(s => ({ jobs: [...s.jobs.map(j => (j.status === 'next' ? { ...j, status: 'queued' as const } : j)), job] }))
  }
})
const up = (id: string, stage: number, extra: object = {}) => { const r = cache.get(id.slice(1)); if (!r || (sent.get(id) || 0) >= stage) return; sent.set(id, stage); pushReq({ ...r, data: { ...r.data, stage, ...extra } }) }
store.subscribe(() => {
  const s = store.get()
  s.jobs.filter(j => j.id[0] === 'q').forEach(j => {
    if (j.status === 'done') up(j.id, 5, { closedAt: Date.now() })
    else if (j.status === 'part') up(j.id, 2, { part: s.part })
    else if (s.activeId === j.id) up(j.id, s.steps.some(Boolean) ? 4 : 3)
  })
})
