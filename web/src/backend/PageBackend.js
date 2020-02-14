/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "../Setting";

export function getPages(websiteId) {
  return fetch(`${Setting.ServerUrl}/api/get-pages?websiteId=${websiteId}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getPage(id) {
  return fetch(`${Setting.ServerUrl}/api/get-page?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updatePage(id, page) {
  return fetch(`${Setting.ServerUrl}/api/update-page?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(page),
  }).then(res => res.json());
}

export function addPage(page) {
  return fetch(`${Setting.ServerUrl}/api/add-page`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(page),
  }).then(res => res.json());
}

export function deletePage(id) {
  return fetch(`${Setting.ServerUrl}/api/delete-page?id=${id}`, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}
