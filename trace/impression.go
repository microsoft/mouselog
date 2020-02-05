package trace

type Impression struct {
	Id          string `xorm:"varchar(100) notnull pk" json:"id"`
	SessionId   string `xorm:"varchar(100)" json:"sessionId"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	UrlPath     string `xorm:"varchar(500)" json:"urlPath"`
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

func AddImpression(id string, sessionId string, urlPath string) bool {
	s := Impression{Id: id, SessionId: sessionId, CreatedTime: getCurrentTime(), UrlPath: urlPath}
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
