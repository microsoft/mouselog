import React from "react";
import * as Setting from "./Setting";

export function trace(action, sessionId, data)
{
    return fetch(`${Setting.ServerUrl}/api/${action}-trace?sessionId=${sessionId}`, {
        method: "POST",
        credentials: "include",
        body: data
    }); // Return a Promise
}

export function getSessionId() {
    return fetch(`${Setting.ServerUrl}/api/get-session-id`, {
        method: 'GET',
        credentials: "include"
    });
}

export function listTrace(fileId, perPage = null, page = null) {
    return fetch(`${Setting.ServerUrl}/api/list-traces?fileId=${fileId}&perPage=${perPage ? perPage : 10000000 }&page=${page ? page : 0}`, {
        method: 'GET',
        credentials: 'include'
    });
}

export function listSessions() {
    return fetch(`${Setting.ServerUrl}/api/list-sessions`, {
       method: 'GET',
       credentials: 'include' 
    });
}
