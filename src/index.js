import './scss/style.scss'
import PitchDetector from './ml5pitch.js'
import LinearScale from './linearscale.js'

let inputDevices = null
let activeDevice = null

let audioCtx = null
let pitchDetector = null

let linearScale = new LinearScale($('#scale'))

navigator.mediaDevices.getUserMedia({ audio: true, video: false })

function pitchDetectorCallback (frequency, cents, ref) {
  linearScale.set(cents)
  $('#frequency').text(frequency.toFixed(2))
  $('#cents').text(cents.toFixed(2))
}

// callback of input device selector
$('#input-device').change(function () {
  // create audio context on first user interaction
  if (!audioCtx) audioCtx = new window.AudioContext()

  activeDevice = inputDevices.filter((d) => { return d.deviceId === $(this).val() })[0]

  console.log('Selected input device: ' + activeDevice.label)

  navigator.mediaDevices.getUserMedia({
    audio: { deviceId: { exact: activeDevice.deviceId } }
  }).then((stream) => {
    pitchDetector = new PitchDetector(audioCtx, stream, 100, pitchDetectorCallback)
  })
})

// pause capture when tab is not active
document.addEventListener('visibilitychange', () => {
  if (audioCtx) {
    if (document.hidden) audioCtx.suspend()
    else audioCtx.resume()
  }
})

$(document).ready(() => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    inputDevices = devices.filter((d) => { return d.kind === 'audioinput' })
    // console.log(devices)
  }).then(() => {
    $(inputDevices).each((index, device) => {
      $('#input-device').append('<option value="' + device.deviceId + '">' + device.label + '</option>')
    })
  })
})
