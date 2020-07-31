import './scss/gaugescale.scss'

export default class GaugeScale {
  constructor (container) {
    container.append('<div id="gauge"></div>')
    // for (let i = -50; i <= 50; i++) {
    //   $('#gauge').append('<span id="tick_' + i + '" class="tick"></span>')
    // }

    const angle = 45
    for (let i = -angle; i <= angle; i++) {
      let span = $('<span />')
        .addClass('tick')
        .attr('id', 'tick_' + i )
        .css('transform', 'rotate(' + i + 'deg)')

      $('#gauge').append(span)
    }
  }

  // set a value in the range [-50, +50]
  set(value) {
    $('#gauge>.tick').each((i, e) => {
      $(e).css('opacity', '0.25')
    })

    const value_ = Math.round(value)

    if (value_ > 0) {
      for (let i = 0; i <= value_; i++) {
        $('#gauge>#tick_' + i).css('opacity', '1')
      }
    } else if (value_ < 0) {
      for (let i = value_; i <= 0; i++) {
        $('#gauge>#tick_' + i).css('opacity', '1')
      }
    } else {
      $('#gauge>#tick_0').css('opacity', '1')
    }
  }
}
