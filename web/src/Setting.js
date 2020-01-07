import React from "react";

export let ServerUrl = '';

export function initServerUrl() {
  const hostname = window.location.hostname;
  ServerUrl = `http://${hostname}:9000`;
}

export let component = null;

export function mouseHandler(type, e) {
  if (component === null) {
    return
  }
  component.mouseHandler(type, e);
}

export function setMouseHandler(comp) {
  component = comp;
}

export let localEnablePlayerFastForward = true;

export function getEnablePlayerFastForward() {
  return localEnablePlayerFastForward;
}

export function setEnablePlayerFastForward(enablePlayerFastForward) {
  localEnablePlayerFastForward = enablePlayerFastForward;
}

export function wrapClientIp(s) {
  return <a target="_blank" href={`https://db-ip.com/${s}`}>{s}</a>
}

export function wrapUserAgent(s) {
  return <a target="_blank" href={`https://www.google.com/search?q=${s}`}>{s}</a>
}

export function wrapUrl(s) {
  return <a target="_blank" href={`${s}`}>{s}</a>
}

// https://stackoverflow.com/questions/14819058/mixing-two-colors-naturally-in-javascript
//colorChannelA and colorChannelB are ints ranging from 0 to 255
function mixChannel(colorChannelA, colorChannelB, amountToMix) {
  var channelA = colorChannelA * amountToMix;
  var channelB = colorChannelB * (1 - amountToMix);
  return parseInt(channelA + channelB);
}

//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
export function mixColor(rgbA, rgbB, amountToMix) {
  var r = mixChannel(rgbA[0], rgbB[0], amountToMix);
  var g = mixChannel(rgbA[1], rgbB[1], amountToMix);
  var b = mixChannel(rgbA[2], rgbB[2], amountToMix);
  return "rgb(" + r + "," + g + "," + b + ")";
}
