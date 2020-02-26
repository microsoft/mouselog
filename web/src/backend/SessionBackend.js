/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "../Setting";
import {humpToLine} from "../utils";

export function getSessions(websiteId, resultCount, offset, sortField, sortOrder) {
  let requestParams = [
    `websiteId=${websiteId}`,
    `resultCount=${resultCount}`,
    `offset=${offset}`,
    `sortField=${humpToLine(sortField)}`,
    `sortOrder=${sortOrder}`
  ].join('&');
  return fetch(`${Setting.ServerUrl}/api/get-sessions?${requestParams}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getSession(id, websiteId) {
  return fetch(`${Setting.ServerUrl}/api/get-session?id=${id}&websiteId=${websiteId}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function deleteSession(id, websiteId) {
  return fetch(`${Setting.ServerUrl}/api/delete-session?id=${id}&websiteId=${websiteId}`, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}
