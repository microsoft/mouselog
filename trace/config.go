// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package trace

import "encoding/json"

type TrackConfig struct {
	EndpointType   string `json:"endpointType"`
	UploadEndpoint string `json:"uploadEndpoint"`
	ResendInterval int    `json:"resendInterval"`

	UploadMode   string `json:"uploadMode"`
	UploadTimes  int    `json:"uploadTimes"`
	UploadPeriod int    `json:"uploadPeriod"`
	Frequency    int    `json:"frequency"`

	SizeLimit int    `json:"sizeLimit"`
	Scope     string `json:"scope"`
	EnableGet bool   `json:"enableGet"`
	Version   string `json:"version"`

	Encoder            string `json:"encoder"`
	EnableServerConfig bool   `json:"enableServerConfig"`
	DisableSession     bool   `json:"disableSession"`
}

func ParseTrackConfig(s string) TrackConfig {
	var config TrackConfig
	err := json.Unmarshal([]byte(s), &config)
	if err != nil {
		panic(err)
	}

	return config
}
