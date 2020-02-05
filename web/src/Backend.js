import React from "react";
import * as Setting from "./Setting";

export function uploadTrace(action, websiteId, impressionId, data) {
  return fetch(`${Setting.ServerUrl}/api/${action}-trace?websiteId=${websiteId}&impressionId=${impressionId}`, {
    method: "POST",
    credentials: "include",
    body: data
  }).then(res => res.json());
}

export function getSessionId(websiteId) {
  return fetch(`${Setting.ServerUrl}/api/get-session-id?websiteId=${websiteId}`, {
    method: 'GET',
    credentials: "include"
  }).then(res => res.json());
}

export function listTrace(fileId, perPage = null, page = null) {
  return fetch(`${Setting.ServerUrl}/api/list-traces?fileId=${fileId}&perPage=${perPage ? perPage : 10000000}&page=${page ? page : 0}`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json());
}

export function getTrace(fileId, traceId) {
  return fetch(`${Setting.ServerUrl}/api/get-trace?fileId=${fileId}&traceId=${traceId}`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json());
}

export function listSessions() {
  return fetch(`${Setting.ServerUrl}/api/list-sessions`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json());
}

export function listRules() {
  return fetch(`${Setting.ServerUrl}/api/list-rules`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json());
}
