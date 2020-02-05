package trace

type Impression struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	SessionId   string `xorm:"varchar(100)" json:"sessionId"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	UrlPath     string `xorm:"varchar(500)" json:"urlPath"`

	Width        int    `json:"width"`
	Height       int    `json:"height"`
	PageLoadTime string `xorm:"varchar(100)" json:"pageLoadTime"`

	Events []Event `xorm:"mediumtext" json:"events"`
}

func GetImpressions(sessionId string) []*Impression {
	impressions := []*Impression{}
	err := ormManager.engine.Where("session_id = ?", sessionId).Asc("created_time").Find(&impressions)
	if err != nil {
		panic(err)
	}

	return impressions
}

func GetImpression(id string) *Impression {
	s := Impression{Id: id}
	existed, err := ormManager.engine.Get(&s)
	if err != nil {
		panic(err)
	}

	if existed {
		return &s
	} else {
		return nil
	}
}

func HasImpression(id string) bool {
	return GetImpression(id) != nil
}

func updateImpression(id string, impression *Impression) bool {
	if GetImpression(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(impression)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddImpression(id string, sessionId string, urlPath string) bool {
	s := Impression{Id: id, SessionId: sessionId, CreatedTime: getCurrentTime(), UrlPath: urlPath, Events: []Event{}}
	affected, err := ormManager.engine.Insert(s)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func StartImpression(id string, sessionId string, urlPath string) {
	if !HasImpression(id) {
		AddImpression(id, sessionId, urlPath)
	}
}

func DeleteImpression(id string) bool {
	affected, err := ormManager.engine.Id(id).Delete(&Impression{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func AppendTraceToImpression(id string, trace *Trace) {
	impression := GetImpression(id)

	impression.Width = trace.Width
	impression.Height = trace.Height
	impression.PageLoadTime = trace.PageLoadTime
	impression.Events = append(impression.Events, trace.Events...)

	updateImpression(id, impression)
}
