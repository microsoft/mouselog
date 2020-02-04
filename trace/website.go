package trace

type Website struct {
	Id   string `xorm:"varchar(100) notnull pk" json:"id"`
	Name string `xorm:"varchar(100)" json:"name"`

	State string `xorm:"varchar(100)" json:"state"`
}

func GetWebsites() []*Website {
	websites := []*Website{}
	err := ormManager.engine.Asc("id").Find(&websites)
	if err != nil {
		panic(err)
	}

	return websites
}

func GetWebsite(id string) *Website {
	website := Website{Id: id}
	existed, err := ormManager.engine.Get(&website)
	if err != nil {
		panic(err)
	}

	if existed {
		return &website
	} else {
		return nil
	}
}

func UpdateWebsite(id string, website *Website) bool {
	if GetWebsite(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(website)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddWebsite(website *Website) bool {
	affected, err := ormManager.engine.Insert(website)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteWebsite(id string) bool {
	affected, err := ormManager.engine.Id(id).Delete(&Website{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
