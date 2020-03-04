/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import * as Setting from "../Setting";
import {humpToLine} from "../utils";

export function getImpressions(websiteId, sessionId, resultCount, offset, sortField, sortOrder) {
  let requestParams = [
    `websiteId=${websiteId}`,
    `sessionId=${sessionId}`,
    `resultCount=${resultCount}`,
    `offset=${offset}`,
    `sortField=${humpToLine(sortField)}`,
    `sortOrder=${sortOrder}`
  ].join('&');
  return fetch(`${Setting.ServerUrl}/api/get-impressions?${requestParams}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getImpressionsAll(websiteId, resultCount, offset, sortField, sortOrder) {
  let requestParams = [
    `websiteId=${websiteId}`,
    `resultCount=${resultCount}`,
    `offset=${offset}`,
    `sortField=${humpToLine(sortField)}`,
    `sortOrder=${sortOrder}`
  ].join('&');
  return fetch(`${Setting.ServerUrl}/api/get-impressions-all?${requestParams}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getImpression(id) {
  return fetch(`${Setting.ServerUrl}/api/get-impression?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function deleteImpression(id) {
  return fetch(`${Setting.ServerUrl}/api/delete-impression?id=${id}`, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}
