/* exported stt */

const ManageSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || false

class STT {
  #recognizing
  #recognition
  #callback
  constructor () {
    if (ManageSpeechRecognition) {
      this.#recognition = new ManageSpeechRecognition()
      this.#recognition.continuous = true
      this.#recognition.lang = 'es-AR'
      this.#recognizing = false
      this.#recognition.onend = this.#recognizing

      this.#recognition.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            const respuesta = e.results[i][0].transcript
            if(this.#callback!==undefined){
              this.#callback(respuesta)
            }
          }
        }
      }
    } else {
      console.log('This browser does not support SpeechRecognition or webkitSpeechRecognition.')
    }
  }

  reset () {
    this.#recognizing = false
  }

  switchRecognition () {
    if (this.#recognizing) {
      this.#recognition.stop()
      this.#recognizing = false
    } else {
      this.#recognition.start()
      this.#recognizing = true
    }
  }

  startRecognition () {
    if (!this.#recognizing) {
      this.#recognition.start()
      this.#recognizing = true
    }
  }

  stopRecognition () {
    if (this.#recognizing) {
      this.#recognition.stop()
      this.#recognizing = false
    }
  }

  changeLanguage (lang) {
    if (lang !== '') {
      this.#recognition.lang = lang
    } else {
      this.#recognition.lang = 'es-AR'
    }
  }
  setCallback(clb){
    this.#callback=clb
  }
}

const stt = new STT()

export default stt
