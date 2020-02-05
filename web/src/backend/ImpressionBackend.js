import * as Setting from "../Setting";

export function getImpressions(sessionId) {
  return fetch(`${Setting.ServerUrl}/api/get-impressions?sessionId=${sessionId}`, {
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
