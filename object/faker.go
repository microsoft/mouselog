// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package object

type Faker struct {
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Title  string `xorm:"varchar(100)" json:"title"`
	Script string `xorm:"mediumtext" json:"script"`
}

func GetFakers() []*Faker {
	fakers := []*Faker{}
	err := ormManager.engine.Desc("created_time").Find(&fakers)
	if err != nil {
		panic(err)
	}

	return fakers
}

func GetFaker(id string) *Faker {
	s := Faker{Name: id}
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

func UpdateFaker(id string, faker *Faker) bool {
	if GetFaker(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(faker)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddFaker(faker *Faker) bool {
	affected, err := ormManager.engine.Insert(faker)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteFaker(faker *Faker) bool {
	affected, err := ormManager.engine.Id(faker.Name).Delete(&Faker{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
