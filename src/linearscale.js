import './scss/linearscale.scss'

export default class LinearScale {
  constructor (container) {
    container.append('<div id="linearscale"></div>')
    for (let i = -50; i <= 50; i++) {
      $('#linearscale').append('<span id="tick_' + i + '" class="tick"></span>')
    }
  }

  // set a value in the range [-50, +50]
  set(value) {
    $('#linearscale>.tick').each((i, e) => {
      $(e).css('opacity', '0.25')
    })

    const value_ = Math.round(value)

    if (value_ > 0) {
      for (let i = 0; i <= value_; i++) {
        $('#linearscale>#tick_' + i).css('opacity', '1')
      }
    } else if (value_ < 0) {
      for (let i = value_; i <= 0; i++) {
        $('#linearscale>#tick_' + i).css('opacity', '1')
      }
    } else {
      $('#linearscale>#tick_0').css('opacity', '1')
    }
  }
}
