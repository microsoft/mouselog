// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package object

type Captor struct {
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Title  string `xorm:"varchar(100)" json:"title"`
	Script string `xorm:"mediumtext" json:"script"`
}

func GetCaptors() []*Captor {
	captors := []*Captor{}
	err := ormManager.engine.Desc("created_time").Find(&captors)
	if err != nil {
		panic(err)
	}

	return captors
}

func GetCaptor(id string) *Captor {
	s := Captor{Name: id}
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

func UpdateCaptor(id string, captor *Captor) bool {
	if GetCaptor(id) == nil {
		return false
	}

	_, err := ormManager.engine.Id(id).AllCols().Update(captor)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddCaptor(captor *Captor) bool {
	affected, err := ormManager.engine.Insert(captor)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteCaptor(captor *Captor) bool {
	affected, err := ormManager.engine.Id(captor.Name).Delete(&Captor{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
