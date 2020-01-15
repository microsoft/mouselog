package trace

type Website struct {
	Id   string `xorm:"varchar(100) notnull pk" json:"id"`
	Name string `xorm:"varchar(100)" json:"name"`
}

func GetWebsites() []*Website {
	websites := []*Website{}
	err := ormManager.engine.Asc("id").Find(&websites)
	if err != nil {
		panic(err)
	}

	return websites
}

func createWebsiteTable() error {
	return ormManager.engine.Sync2(new(Website))
}

func dropWebsiteTable() error {
	return ormManager.engine.DropTables(new(Website))
}

func UpdateWebsites(websites []*Website) bool {
	err := dropWebsiteTable()
	if err != nil {
		panic(err)
	}

	err = createWebsiteTable()
	if err != nil {
		panic(err)
	}

	affected, err := ormManager.engine.Insert(&websites)
	if err != nil {
		panic(err)
	}

	return affected != 0
}
