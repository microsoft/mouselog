/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "../Setting";

export function getCaptors() {
  return fetch(`${Setting.ServerUrl}/api/get-captors`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getCaptor(id) {
  return fetch(`${Setting.ServerUrl}/api/get-captor?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateCaptor(id, captor) {
  return fetch(`${Setting.ServerUrl}/api/update-captor?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(captor),
  }).then(res => res.json());
}

export function addCaptor(captor) {
  return fetch(`${Setting.ServerUrl}/api/add-captor`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(captor),
  }).then(res => res.json());
}

export function deleteCaptor(captor) {
  return fetch(`${Setting.ServerUrl}/api/delete-captor`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(captor),
  }).then(res => res.json());
}
