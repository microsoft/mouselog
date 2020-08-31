/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "../Setting";

export function getFakers() {
  return fetch(`${Setting.ServerUrl}/api/get-fakers`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getFaker(id) {
  return fetch(`${Setting.ServerUrl}/api/get-faker?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateFaker(id, faker) {
  return fetch(`${Setting.ServerUrl}/api/update-faker?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(faker),
  }).then(res => res.json());
}

export function addFaker(faker) {
  return fetch(`${Setting.ServerUrl}/api/add-faker`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(faker),
  }).then(res => res.json());
}

export function deleteFaker(faker) {
  return fetch(`${Setting.ServerUrl}/api/delete-faker`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(faker),
  }).then(res => res.json());
}
