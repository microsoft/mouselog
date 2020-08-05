// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package batch

import "github.com/microsoft/mouselog/trace"

func addWebsite(websiteId string) {
	w := &trace.Website{
		Id:           websiteId,
		Name:         websiteId,
		Url:          "",
		TrackConfig:  "{}",
		State:        "active",
	}

	if trace.GetWebsite(websiteId) == nil {
		trace.AddWebsite(w)
	}
}

func addSession(sessions *[]*trace.Session, sessionMap *map[string]*trace.Session, id string, websiteId string, createdTime string, userAgent string, clientIp string) {
	s := &trace.Session{Id: id, WebsiteId: websiteId, CreatedTime: createdTime, UserAgent: userAgent, ClientIp: clientIp}
	if _, ok := (*sessionMap)[id]; !ok {
		*sessions = append(*sessions, s)
		(*sessionMap)[id] = s
	}
}

func addImpression(impressions *[]*trace.Impression, impressionMap *map[string]*trace.Impression, id string, sessionId string, websiteId string, createdTime string, urlPath string, userAgent string, clientIp string) {
	im := &trace.Impression{Id: id, SessionId: sessionId, WebsiteId: websiteId, CreatedTime: createdTime, UrlPath: urlPath, UserAgent: userAgent, ClientIp: clientIp, Events: []*trace.Event{}}
	if _, ok := (*impressionMap)[id]; !ok {
		*impressions = append(*impressions, im)
		(*impressionMap)[id] = im
	}
}

func appendTraceToImpression(impressionMap *map[string]*trace.Impression, id string, trace *trace.Trace) {
	impression := (*impressionMap)[id]

	impression.Width = trace.Width
	impression.Height = trace.Height
	impression.PageLoadTime = trace.PageLoadTime
	impression.Label = trace.Label

	impression.Events = trace.Events
}
