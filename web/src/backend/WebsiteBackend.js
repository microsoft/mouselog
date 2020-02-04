import * as Setting from "../Setting";

export function getWebsites() {
  return fetch(`${Setting.ServerUrl}/api/get-websites`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getWebsite(id) {
  return fetch(`${Setting.ServerUrl}/api/get-website?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateWebsite(id, website) {
  return fetch(`${Setting.ServerUrl}/api/update-website?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(website),
  }).then(res => res.json());
}

export function addWebsite(website) {
  return fetch(`${Setting.ServerUrl}/api/add-website`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(website),
  }).then(res => res.json());
}

export function deleteWebsite(id) {
  return fetch(`${Setting.ServerUrl}/api/delete-website?id=${id}`, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}
