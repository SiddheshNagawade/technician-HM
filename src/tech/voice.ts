/* Spoken help for every technician screen. Not a read-out of the text on screen: it explains what the
   screen is for and what to do next, in plain words. Recorded clips live in /public/voice/<lang>/<key>.mp3
   (generated with a neural voice); if a clip is missing the phone's own voice reads the same script. */
import { useEffect, useState } from 'react'

export type VoiceKey = 'lang' | 'staff' | 'otp' | 'bag' | 'jobs' | 'job' | 'trip' | 'cant' | 'nobody' | 'work' | 'part' | 'stock' | 'reserved'
  | 'code' | 'photo' | 'done' | 'last' | 'reopen' | 'slot' | 'history' | 'profile' | 'offline' | 'server' | 'note'

export const SCRIPTS: Record<VoiceKey, { hi: string; en: string }> = {
  lang: {
    hi: 'नमस्ते! ये ऐप आपके हॉस्टल के काम में मदद करेगा। जिस भाषा में बात करनी है, उस पर दबाइए। हिंदी के लिए ऊपर वाला बटन, अंग्रेज़ी के लिए नीचे वाला।',
    en: 'Hello! This app helps you with your hostel repair jobs. Tap the language you want to use. Hindi is the top button, English is the one below it.',
  },
  staff: {
    hi: 'अपना चार अंकों का स्टाफ़ नंबर डालिए। ये नंबर आपके आई डब्ल्यू डी पहचान पत्र पर लिखा है। नीचे के बटन से नंबर दबाइए। ग़लत हो जाए तो मिटाने वाला बटन दबाइए।',
    en: 'Type your four digit staff number. You will find it on your IWD identity card. Use the number buttons below. If you make a mistake, press the delete button.',
  },
  otp: {
    hi: 'हमने आपके फ़ोन पर और आपके ईमेल पर, जो आपने ऑफ़िस में दिया था, एक चार अंकों का ओ टी पी भेजा है। मैसेज खोलिए, वो चार अंक देखिए, और यहाँ डाल दीजिए। मैसेज ऊपर दिखे तो उस पर दबाने से अंक अपने आप भर जाएँगे।',
    en: 'We have sent a four digit code to your phone and to the email you gave the office. Open the message, look at the four numbers, and type them here. If the message shows at the top of the screen, tap it and the numbers fill in by themselves.',
  },
  bag: {
    hi: 'निकलने से पहले अपना बैग देख लीजिए। जो सामान बैग में रख लिया है, उस पर दबाइए, उस पर सही का निशान लग जाएगा। कुछ कम है, तो उसे बिना निशान छोड़ दीजिए। हम स्टोर को बता देंगे, और सामान गेट पर मिल जाएगा।',
    en: 'Before you leave, check your bag. Tap each thing you have packed and it gets a tick. If something is missing, leave it without a tick. We will tell the store and you can collect it at the gate.',
  },
  jobs: {
    hi: 'ये आज के आपके काम हैं। हमने इन्हें भवन के हिसाब से लगाया है, ताकि आपको कम चलना पड़े। सबसे ऊपर वाला अगला काम है। उसे शुरू करने के लिए नीचे का नीला बटन दबाइए।',
    en: 'These are your jobs for today. We have put them in order by Bhawan, so you walk less. The one at the top is your next job. Press the big blue button at the bottom to start it.',
  },
  job: {
    hi: 'ये इस काम की पूरी जानकारी है। कमरा, क्या ख़राब है, और विद्यार्थी का संदेश। संदेश सुनने के लिए उसके पास वाला स्पीकर दबाइए। तैयार हों तो सफ़र शुरू करें दबाइए। विद्यार्थी को अपने आप ख़बर चली जाएगी।',
    en: 'This is everything about the job: the room, what is broken, and the student\'s message. Press the small speaker next to the message to hear it. When you are ready, press Start trip. The student is told automatically.',
  },
  note: {
    hi: 'विद्यार्थी का संदेश: पंखा थोड़ी देर चलता है, फिर रुक जाता है। टिक टिक की आवाज़ भी आती है।',
    en: 'Message from the student: the fan runs for a few minutes and then stops. It also makes a ticking sound.',
  },
  trip: {
    hi: 'आप रास्ते में हैं। विद्यार्थी को बता दिया गया है कि आप आ रहे हैं। कमरे पर पहुँचकर, पहुँच गया वाला बटन दबाइए। अगर अंदर नहीं जा पा रहे, तो नीचे लिखे पर दबाइए।',
    en: 'You are on the way. The student has been told you are coming. When you reach the room, press I have arrived. If you cannot get in, press the line below the button.',
  },
  cant: {
    hi: 'कोई बात नहीं। बताइए क्या हुआ। दरवाज़ा बंद है, या कोई नहीं है, तो उस पर दबाइए। हम विद्यार्थी को संदेश भेज देंगे। ज़रूरत हो तो सुपरवाइज़र को फ़ोन भी कर सकते हैं।',
    en: 'No problem. Tell us what happened. If the door is locked or nobody is there, tap that option and we message the student. You can also call the supervisor if you need to.',
  },
  nobody: {
    hi: 'हमने विद्यार्थी को बता दिया है कि आप आए थे। वो नया समय चुनेंगे। आपको कुछ नहीं करना है। अगले काम पर चलिए।',
    en: 'We have told the student that you came. They will pick a new time. You do not need to do anything. Go on to your next job.',
  },
  work: {
    hi: 'काम शुरू हो गया है, और घड़ी चल रही है। हर कदम पूरा होने पर उस पर दबाइए। काम से पहले और बाद की फ़ोटो लेना अच्छा है। कोई पुर्ज़ा चाहिए, तो सामान चाहिए दबाइए। काम पूरा हो जाए, तो नीचे का बटन दबाइए।',
    en: 'The job has started and the timer is running. Tap each step when you finish it. It is good to take a photo before and after. If you need a part, press Needs a part. When the work is done, press the button at the bottom.',
  },
  part: {
    hi: 'कौन सा पुर्ज़ा चाहिए, उस पर दबाइए। फिर आगे दबाइए। हम देखेंगे कि स्टोर में है या नहीं।',
    en: 'Tap the part you need, then press Next. We will check if the store has it.',
  },
  stock: {
    hi: 'ये दिखाता है कि पुर्ज़ा कहाँ मिलेगा। मुख्य स्टोर में और पास के ब्लॉक में कितने हैं। रिज़र्व करें दबाइए, तो पुर्ज़ा आपके लिए रख दिया जाएगा।',
    en: 'This shows where the part is: how many are in the main store and in the nearby block. Press Reserve and it will be kept for you.',
  },
  reserved: {
    hi: 'पुर्ज़ा आपके लिए रख दिया गया है। कल सुबह सवा आठ बजे तक गेट पर ले लीजिए। विद्यार्थी को भी बता दिया गया है। अब अगले काम पर चलिए।',
    en: 'The part is kept for you. Collect it at the gate by eight fifteen tomorrow morning. The student has been told too. Now go on to your next job.',
  },
  code: {
    hi: 'काम पूरा हो गया? तो विद्यार्थी से उनके फ़ोन पर लिखा चार अंकों का कोड पूछिए। वो कोड यहाँ डालिए। सही कोड डालते ही काम बंद हो जाएगा। कोड नहीं मिल रहा, तो फ़ोटो से भी बंद कर सकते हैं।',
    en: 'Is the job finished? Then ask the student for the four digit code on their phone, and type it here. As soon as the code is right, the job closes. If you cannot get the code, you can close it with a photo instead.',
  },
  photo: {
    hi: 'ठीक किए हुए सामान की एक साफ़ फ़ोटो लीजिए। सुपरवाइज़र फ़ोटो देखकर काम बंद करेंगे।',
    en: 'Take one clear photo of the fixed item. The supervisor will look at it and then close the job.',
  },
  done: {
    hi: 'शाबाश! ये काम बंद हो गया। विद्यार्थी ने कोड दे दिया। अगले काम के लिए नीचे का बटन दबाइए।',
    en: 'Well done! This job is closed. The student gave the code. Press the button at the bottom for your next job.',
  },
  last: {
    hi: 'आज के सारे काम पूरे हो गए। बहुत बढ़िया! कोई नया काम आएगा, तो यहीं दिखेगा।',
    en: 'All of today\'s jobs are done. Great work! If a new job comes in, it will show up here.',
  },
  reopen: {
    hi: 'ये काम फिर से खुल गया है। विद्यार्थी ने बताया है कि दिक्कत फिर से आ गई। पिछली बार क्या बदला था, वो नीचे लिखा है। काम देखें दबाइए।',
    en: 'This job has been opened again. The student says the problem came back. What you changed last time is written below. Press View job.',
  },
  slot: {
    hi: 'विद्यार्थी ने आने का समय बदल दिया है। पुराना समय ऊपर है, नया समय नीचे पीले डिब्बे में। ठीक है दबाइए, आपकी सूची अपने आप बदल जाएगी।',
    en: 'The student has changed the visit time. The old time is at the top, the new time is in the yellow box. Press OK and your list updates by itself.',
  },
  history: {
    hi: 'इस सामान पर पहले क्या क्या काम हुआ है, वो यहाँ लिखा है। बार बार ख़राब हो रहा हो, तो सुपरवाइज़र को बताइए।',
    en: 'This shows the earlier repairs on this same item. If it keeps breaking, let the supervisor know.',
  },
  profile: {
    hi: 'ये आपकी जानकारी है। आपकी शिफ़्ट, आपके भवन, और भाषा। यहाँ से भाषा बदल सकते हैं, और आवाज़ अपने आप बजने वाली सेटिंग चालू कर सकते हैं।',
    en: 'This is your profile: your shift, your Bhawans and your language. You can change the language here, and turn on voice help that plays by itself on every screen.',
  },
  offline: {
    hi: 'अभी इंटरनेट नहीं है। घबराइए मत, आपका काम फ़ोन में सुरक्षित है। नेट आते ही सब अपने आप भेज दिया जाएगा।',
    en: 'There is no internet right now. Do not worry, your work is saved on the phone. Everything is sent by itself when the internet comes back.',
  },
  server: {
    hi: 'हमारी तरफ़ से कुछ गड़बड़ हो गई है। आपकी कोई ग़लती नहीं है। थोड़ी देर बाद फिर कोशिश कीजिए।',
    en: 'Something went wrong on our side. It is not your fault. Please try again in a little while.',
  },
}

/* ---------- player ---------- */
let current: HTMLAudioElement | null = null
const subs = new Set<(k: string | null) => void>()
let playing: string | null = null
const emit = (k: string | null) => { playing = k; subs.forEach(f => f(k)) }

export function stopVoice() {
  if (current) { current.pause(); current = null }
  if ('speechSynthesis' in window) speechSynthesis.cancel()
  emit(null)
}

function speakFallback(text: string, lang: 'hi' | 'en', id: string) {
  if (!('speechSynthesis' in window)) { emit(null); return }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; u.rate = 0.95
  const v = speechSynthesis.getVoices().find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en-IN')) || speechSynthesis.getVoices().find(v => v.lang.startsWith(lang))
  if (v) u.voice = v
  u.onend = () => playing === id && emit(null); u.onerror = () => emit(null)
  speechSynthesis.speak(u)
}

export function playVoice(key: VoiceKey, lang: 'hi' | 'en') {
  const id = `${lang}:${key}`
  if (playing === id) { stopVoice(); return }
  stopVoice(); emit(id)
  const a = new Audio(`${import.meta.env.BASE_URL}voice/${lang}/${key}.mp3`)
  current = a
  a.onended = () => { if (current === a) { current = null; emit(null) } }
  a.onerror = () => { if (current === a) { current = null; speakFallback(SCRIPTS[key][lang], lang, id) } }
  a.play().catch(() => { if (current === a) { current = null; speakFallback(SCRIPTS[key][lang], lang, id) } })
}

export function useVoicePlaying() {
  const [p, setP] = useState<string | null>(playing)
  useEffect(() => { subs.add(setP); return () => { subs.delete(setP) } }, [])
  return p
}
