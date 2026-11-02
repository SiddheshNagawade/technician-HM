/* Technician side of the live link: scheduled student requests become jobs; heading out and closing move the student's screen. */
import { store, Job } from './store'
import { pushReq, watchReqs, Remote } from '../data/sync'
const cache = new Map<string, Remote>(), sent = new Map<string, number>()
watchReqs(r => {
  cache.set(r.id, r); const d = r.data, id = 'q' + r.id
  if (d.stage >= 2 && d.stage < 5 && !store.get().jobs.some(j => j.id === id) && !sent.has(id + 'x')) {
    const t = store.get().jobs[0], w = String(d.where || '')
    const job: Job = { ...t, id, room: w.split(' ').pop() || w, item: d.item, itemHi: d.item, issueHi: `${d.item}: ${d.issue || ''}`, issueEn: `${d.item}: ${d.issue || ''}`, timeHi: d.slot || '', slotHi: d.slot || '', slotEn: d.slot || '', noteHi: d.note || '', noteEn: d.note || '', photo: '', code: d.code || t.code, status: 'queued', reopened: false }
    store.set(s => ({ jobs: [...s.jobs, job] }))
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
