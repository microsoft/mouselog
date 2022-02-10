/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "./Setting";

export function uploadTrace(action, websiteId, impressionId, data) {
  return fetch(
    `${Setting.ServerUrl}/api/${action}-trace?websiteId=${websiteId}&impressionId=${impressionId}`,
    {
      method: "POST",
      credentials: "include",
      body: data,
    }
  ).then((res) => res.json());
}

export function getSessionId(websiteId, userId = "") {
  return fetch(
    `${Setting.ServerUrl}/api/get-session-id?websiteId=${websiteId}&userId=${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  ).then((res) => res.json());
}

export function listDatasets() {
  return fetch(`${Setting.ServerUrl}/api/list-datasets`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}

export function listRules() {
  return fetch(`${Setting.ServerUrl}/api/list-rules`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}
