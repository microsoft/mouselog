/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {message} from "antd";
import { v4 as uuid } from 'uuid';

export let ServerUrl = '';
export let ImpressionId = uuid();

export function initServerUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    ServerUrl = `http://${hostname}:9000`;
  }
}

export function getWebsiteId() {
  // const websiteId = window.location.host;
  const websiteId = "mouselog";
  return websiteId;
}

export function getImpressionId() {
  return ImpressionId;
}
export function openLink(link) {
  const w = window.open('about:blank');
  w.location.href = link;
}

export function showMessage(type, text) {
  if (type === "") {
    return;
  } else if (type === "success") {
    message.success(text);
  } else if (type === "error") {
    message.error(text);
  }
}

export function deepCopy(obj) {
  return Object.assign({}, obj);
}

export function myParseInt(i) {
  const res = parseInt(i);
  return isNaN(res) ? 0 : res;
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

export function addRow(array, row) {
  return [...array, row];
}

export function deleteRow(array, i) {
  return [...array.slice(0, i), ...array.slice(i + 1)];
}

export function swapRow(array, i, j) {
  return [...array.slice(0, i), array[j], ...array.slice(i + 1, j), array[i], ...array.slice(j + 1)];
}
