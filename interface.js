/* global $:false */

// fetch all devices
var inputDevices = getInputDevices()
var activeDevice = null

function getInputDevices () {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices)
  }).catch(() => {
    console.log('error')
  })
}

var audioContext = new window.AudioContext()

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
var buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.25, audioContext.sampleRate)

// generate all indicators for the scale
const ticks = []
for (var i = -50; i <= +50; i++) { ticks.push(i) }
const maxTick = Math.max(...ticks.map(a => Math.abs(a)))

$(document).ready(() => {
  $(inputDevices).each((index, device) => {
    if (device.id === activeDevice) {
      $('#input-device').append('<option value="' + device.id + '" selected>' + device.name + '</option>')
    } else {
      $('#input-device').append('<option value="' + device.id + '">' + device.name + '</option>')
    }
  })

  const scaleWidth = $('#scale').width()
  let left = 0
  $(ticks).each((index, tick) => {
    left = (1 + tick / maxTick) * scaleWidth / 2
    if (tick === 0) {
      $('#ticks').append('<span id="tick_' + tick + '" class="tick_zero tick_major" style="left: ' + left + 'px"></span>')
    } else if (tick % 25 === 0) {
      $('#ticks').append('<span id="tick_' + tick + '" class="tick_major" style="left: ' + left + 'px"></span>')
      $('#annotation').append('<span class="entry" style="left: ' + left + 'px">' + tick + '</span>')
    } else if (tick % 10 === 0) {
      $('#ticks').append('<span id="tick_' + tick + '" class="tick_medium" style="left: ' + left + 'px"></span>')
    } else {
      $('#ticks').append('<span id="tick_' + tick + '" class="tick_minor" style="left: ' + left + 'px"></span>')
    }
  })
})
