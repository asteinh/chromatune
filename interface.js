/* global $:false */
let inputDevices = null
let activeDevice = null
let audioCtx = null
let pitch = null

navigator.mediaDevices.getUserMedia({ audio: true, video: false })

$(document).ready(() => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    inputDevices = devices.filter((d) => { return d.kind === 'audioinput' })
    console.log(devices)
  }).then(() => {
    $(inputDevices).each((index, device) => {
      $('#input-device').append('<option value="' + device.deviceId + '">' + device.label + '</option>')
    })
  })

  for (var i = -50; i <= 50; i++) {
    $('#ticks').append('<span id="tick_' + i + '" class="tick"></span>')
  }

  // fixed interval for pitch detection
  setInterval(() => {
    if (pitch) {
      pitch.getPitch((err, frequency) => {
        if (err) console.log(err)
        if (frequency) {
          $('#frequency').text(frequency.toFixed(2))
          const f0 = findReferenceFrequency(frequency)
          const cents = 1200 * Math.log2(frequency / f0)
          $('#cents').text(cents.toFixed(2))
          setTicksTo(cents)
        }
      })
    }
  }, 100)
})

function setTicksTo (cents) {
  $('.tick').each((i, e) => {
    $(e).css('opacity', '0.25')
  })
  const cents_ = Math.round(cents)
  if (cents_ > 0) {
    for (var i = 0; i <= cents_; i++) {
      $('#tick_' + i).css('opacity', '1')
    }
  } else if (cents_ < 0) {
    for (var i = cents_; i <= 0; i++) {
      $('#tick_' + i).css('opacity', '1')
    }
  } else {
    $('#tick_0').css('opacity', '1')
  }
}

// callback of input device selector
function selectInputDevice (value) {
  // create audio context on first user interaction
  if (!audioCtx) audioCtx = new window.AudioContext()

  activeDevice = inputDevices.filter((d) => { return d.deviceId === value })[0]

  console.log('Selected input device: ' + activeDevice.label)

  navigator.mediaDevices.getUserMedia({
    audio: { deviceId: { exact: activeDevice.deviceId } }
  }).then((stream) => {
    pitch = ml5.pitchDetection('./crepe_model/', audioCtx, stream, null)
  })
}

// find frequency (from standard tuning) closest to identified pitch
function findReferenceFrequency (frequency) {
  const tuning = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41]
  tuning.sort((a, b) => {
    return Math.abs(frequency - a) - Math.abs(frequency - b)
  })
  return tuning[0]
}

// pause capture when tab is not active
document.addEventListener('visibilitychange', () => {
  if (audioCtx) {
    if (document.hidden) audioCtx.suspend()
    else audioCtx.resume()
  }
})
