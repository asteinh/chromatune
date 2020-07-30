import tunings from './tunings.json'

export default class PitchDetector {
  constructor (audioCtx, stream, interval, cb) {
    this.activeTuning = 'Standard'
    this.detector = ml5.pitchDetection('./assets/crepe_model', audioCtx, stream, null)

    // fixed interval for pitch detection
    setInterval(() => {
      this.detector.getPitch((err, frequency) => {
        if (err) console.log(err)
        if (frequency) {
          const ref = this.findReference(frequency)
          const cents = 1200 * Math.log2(frequency / ref.frequency)
          cb(frequency, cents, ref)
        }
      })
    }, interval)
  }

  // set tuning according to string argument
  setTuning (tuning) {

  }

  // find reference string (from currently set tuning) closest to identified pitch
  findReference (frequency) {
    const tuning = tunings[this.activeTuning]
    tuning.sort((a, b) => {
      return Math.abs(frequency - a.frequency) - Math.abs(frequency - b.frequency)
    })
    return tuning[0]
  }
}
