// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import "github.com/microsoft/mouselog/object"

func addWebsite(websiteId string) {
	w := &object.Website{
		Id:           websiteId,
		Name:         websiteId,
		Url:          "",
		TrackConfig:  "{}",
		State:        "active",
	}

	if object.GetWebsite(websiteId) == nil {
		object.AddWebsite(w)
	}
}

func addSession(sessions *[]*object.Session, sessionMap *map[string]*object.Session, id string, websiteId string, createdTime string, userAgent string, clientIp string) {
	s := &object.Session{Id: id, WebsiteId: websiteId, CreatedTime: createdTime, UserAgent: userAgent, ClientIp: clientIp}
	if _, ok := (*sessionMap)[id]; !ok {
		*sessions = append(*sessions, s)
		(*sessionMap)[id] = s
	}
}

func addImpression(impressions *[]*object.Impression, impressionMap *map[string]*object.Impression, id string, sessionId string, websiteId string, createdTime string, urlPath string, userAgent string, clientIp string) {
	im := &object.Impression{Id: id, SessionId: sessionId, WebsiteId: websiteId, CreatedTime: createdTime, UrlPath: urlPath, UserAgent: userAgent, ClientIp: clientIp, Events: []*object.Event{}}
	if _, ok := (*impressionMap)[id]; !ok {
		*impressions = append(*impressions, im)
		(*impressionMap)[id] = im
	}
}

func appendTraceToImpression(impressionMap *map[string]*object.Impression, id string, trace *object.Trace) {
	impression := (*impressionMap)[id]

	impression.Width = trace.Width
	impression.Height = trace.Height
	impression.PageLoadTime = trace.PageLoadTime
	impression.Label = trace.Label

	impression.Events = trace.Events
}
