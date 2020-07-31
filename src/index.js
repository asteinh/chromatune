import './scss/style.scss'

import config from '../package.json'

import PitchDetector from './ml5pitch.js'
import LinearScale from './linearscale.js'
// import GaugeScale from './gaugescale.js'
import StringIndicator from './stringindicator.js'
import tunings from './tunings.json'

let inputDevices = null
let activeDevice = null

let audioCtx = null
let pitchDetector = null

let stringIndicator = new StringIndicator($('#visual'))
let linearScale = new LinearScale($('#visual'))
// let gaugeScale = new GaugeScale($('#scale'))

navigator.mediaDevices.getUserMedia({ audio: true, video: false })

function pitchDetectorCallback (frequency, cents, ref) {
  linearScale.set(cents)
  // gaugeScale.set(cents)

  stringIndicator.setActive(ref.name)
  $('#frequency').text(frequency.toFixed(2))
  $('#cents').text(cents.toFixed(2))
  $('#note').text(ref.name)
}

// callback of input device selector
$('#select-device').change(function () {
  // create audio context on first user interaction
  audioCtx = null
  audioCtx = new window.AudioContext()

  activeDevice = inputDevices.filter((d) => { return d.deviceId === $(this).val() })[0]

  console.log('Selected input device: ' + activeDevice.label)

  navigator.mediaDevices.getUserMedia({
    audio: { deviceId: { exact: activeDevice.deviceId } }
  }).then((stream) => {
    if (pitchDetector) {
      pitchDetector = null
    }
    pitchDetector = new PitchDetector(audioCtx, stream, 100, pitchDetectorCallback)
    pitchDetector.setTuning('Standard')
    $('#select-mode').prop('disabled', false)
    $('#select-mode').change()
  })
})

// callback for mode selector
$('#select-mode').change(function () {
  $('#setting-mode-divider').attr('hidden', false)
  if ($(this).val() === "0") {
    $('#mode-normal').attr('hidden', false)
    $('#mode-custom').attr('hidden', true)
  } else {
    $('#mode-normal').attr('hidden', true)
    $('#mode-custom').attr('hidden', false)
  }
})

// callback of tuning selector
$('#select-tuning').change(function () {
  let tuning = $(this).val()
  console.log('Setting tuning to ' + tuning)
  if (typeof tunings[tuning] === 'undefined') {
    console.log('Requested tuning not found.')
  } else {
    pitchDetector.setTuning(tuning)
    stringIndicator.setTuning(tuning)
  }
})

// pause capture when tab is not active
document.addEventListener('visibilitychange', () => {
  if (audioCtx) {
    if (document.hidden) audioCtx.suspend()
    else audioCtx.resume()
  }
})

$(document).ready(() => {
  // fill values loaded from package.json
  $('.config-name').text(config.name)
  $('.config-version').text('v' + config.version)
  $('.config-description').text(config.description)
  $('.config-repository').text(config.repository.url)

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    inputDevices = devices.filter((d) => { return d.kind === 'audioinput' })
  }).then(() => {
    // input devices select
    $.each(inputDevices, (index, device) => {
      $('#select-device').append('<option value="' + device.deviceId + '">' + device.label + '</option>')
    })

    // tuning select
    $.each(tunings, (name, tuning) => {
      if (name === 'Standard') {
        $('#select-tuning').append('<option value="' + name + '" selected>' + name + '</option>')
      } else {
        $('#select-tuning').append('<option value="' + name + '">' + name + '</option>')
      }
    })
  })
})
