import * as Setting from "../Setting";

function decodeJsonForWebsite(website) {
  if (typeof website.trackConfig === "string") {
    if (website.trackConfig !== "") {
      website.trackConfig = JSON.parse(website.trackConfig);
    } else {
      delete website.trackConfig;
    }
  }

  return website;
}

export function getWebsites() {
  return fetch(`${Setting.ServerUrl}/api/get-websites`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json())
    .then(websites => websites.map(website => decodeJsonForWebsite(website)));
}

export function getWebsite(id) {
  return fetch(`${Setting.ServerUrl}/api/get-website?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json())
    .then(website => decodeJsonForWebsite(website));
}

export function updateWebsite(id, website) {
  let newWebsite = Setting.deepCopy(website);
  newWebsite.trackConfig = JSON.stringify(newWebsite.trackConfig);
  return fetch(`${Setting.ServerUrl}/api/update-website?id=${id}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newWebsite),
  }).then(res => res.json());
}

export function addWebsite(website) {
  let newWebsite = Setting.deepCopy(website);
  newWebsite.trackConfig = JSON.stringify(newWebsite.trackConfig);
  return fetch(`${Setting.ServerUrl}/api/add-website`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newWebsite),
  }).then(res => res.json());
}

export function deleteWebsite(id) {
  return fetch(`${Setting.ServerUrl}/api/delete-website?id=${id}`, {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}
