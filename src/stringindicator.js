import './scss/stringindicator.scss'
import tunings from './tunings.json'

export default class StringIndicator {
  constructor (container) {
    container.append('<div id="stringindicator"></div>')
    for (let i = 0; i < 6; i++) {
      $('#stringindicator').append('<span id="string_' + i + '" class="string uk-padding-small uk-tile-muted"></span>')
    }
  }

  // set the string names and an active string
  set (tuning, active) {
    tuning.sort((a, b) => (a.frequency - b.frequency))
    for (let i = 0; i < tuning.length; i++) {
      $('#stringindicator>#string_' + i)
        .text(tuning[i].name)
        .removeClass('uk-tile-primary')
        .addClass('uk-tile-muted')
    }
    if (active) {
      $('#stringindicator>#string_' + active).removeClass('uk-tile-muted').addClass('uk-tile-primary')
    }
  }
}
