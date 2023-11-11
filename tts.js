/* global SpeechSynthesisUtterance, speechSynthesis */
/* exported tts */

class TTS {
  #voices
  #onReady
  #ready
  #whenSinthReady
  #accent
  #variant
  constructor() {
    this.#voices = {}
    this.#onReady = []
    this.#ready = false
    this.#accent = ''
    this.#variant = ''

    this.#whenSinthReady = () => {
      speechSynthesis.getVoices().forEach((voice) => {
        const { lang } = voice
        if (lang.length === 5) {
          (this.#voices[lang]
            ? (this.#voices[lang] += 1)
            : (this.#voices[lang] = 1))
        }
        this.#ready = true
        this.#onReady.forEach((cb) => { cb(this.#voices) })
        speechSynthesis.removeEventListener('voiceschanged', this.#whenSinthReady)
      })
    }
    speechSynthesis.addEventListener('voiceschanged', this.#whenSinthReady)
  }

  speak(msj, pAccent, pVariant, pCallback) {
    const toSpeak = new SpeechSynthesisUtterance(msj)
    toSpeak.voice = this.#voices[pAccent]
      ? pVariant <= this.#voices[pAccent]
        ? speechSynthesis.getVoices().filter(
          (voice) => voice.lang === pAccent
        )[pVariant - 1]
        : speechSynthesis.getVoices().filter(
          (voice) => voice.lang === pAccent
        )[0]
      : speechSynthesis.getVoices()[0]
    if (pCallback !== undefined) {
      toSpeak.addEventListener("end", (event) => { pCallback() });
    }
    speechSynthesis.speak(toSpeak)
  }

  getVoices() {
    return structuredClone(this.#voices)
  }
  setVoice(pAccent, pVariant) {
    this.#accent = pAccent
    this.#variant = pVariant
    console.log(this.#accent);
  }
  whenReady(cb) {
    this.#ready ? cb(this.#voices) : this.#onReady.push(cb)
  }
}

const tts = new TTS()

export default tts
