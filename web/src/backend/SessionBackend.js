import * as Setting from "../Setting";

export function getSessions(websiteId) {
  return fetch(`${Setting.ServerUrl}/api/get-sessions?websiteId=${websiteId}`, {
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
