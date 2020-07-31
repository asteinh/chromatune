import './scss/stringindicator.scss'
import tunings from './tunings.json'

export default class StringIndicator {
  constructor (container) {
    this.activeTuning = 'Standard'
    container.append('<div id="stringindicator"></div>')
    for (let i = 0; i < 6; i++) {
      $('#stringindicator').append('<span id="string_' + i + '" class="string uk-padding-small uk-tile-muted"></span>')
    }
    this.setTuning('Standard')
  }

  // set tuning according to string argument
  setTuning (tuning) {
    this.activeTuning = tuning
    let tuning_ = tunings[tuning]
    tuning_.sort((a, b) => {
      return a.frequency - b.frequency
    })
    for (let i = 0; i < 6; i++) {
      $('#string_' + i).text(tuning_[i].name)
    }
  }

  // set the active string by its name
  setActive (name) {
    $('#stringindicator>.string').each((i, e) => {
      $(e).removeClass('uk-tile-primary').addClass('uk-tile-muted')
    })
    let tuning = tunings[this.activeTuning]
    let i = tuning.findIndex((e) => e.name === name)
    $('#stringindicator>#string_' + i).removeClass('uk-tile-muted').addClass('uk-tile-primary')
  }
}
