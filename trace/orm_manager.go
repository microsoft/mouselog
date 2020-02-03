package trace

import (
	"runtime"

	"github.com/astaxie/beego"
	_ "github.com/go-sql-driver/mysql"
	"xorm.io/xorm"
)

var ormManager *OrmManager

func InitOrmManager() {
	ormManager = NewOrmManager("mysql", beego.AppConfig.String("dataSourceName"))
}

// OrmManager represents the MySQL ormManager for policy storage.
type OrmManager struct {
	driverName     string
	dataSourceName string
	engine         *xorm.Engine
}

// finalizer is the destructor for OrmManager.
func finalizer(a *OrmManager) {
	err := a.engine.Close()
	if err != nil {
		panic(err)
	}
}

// NewOrmManager is the constructor for OrmManager.
func NewOrmManager(driverName string, dataSourceName string) *OrmManager {
	a := &OrmManager{}
	a.driverName = driverName
	a.dataSourceName = dataSourceName

	// Open the DB, create it if not existed.
	a.open()

	// Call the destructor when the object is released.
	runtime.SetFinalizer(a, finalizer)

	return a
}

func (a *OrmManager) createDatabase() error {
	engine, err := xorm.NewEngine(a.driverName, a.dataSourceName)
	if err != nil {
		return err
	}
	defer engine.Close()

	_, err = engine.Exec("CREATE DATABASE IF NOT EXISTS mouselog default charset utf8 COLLATE utf8_general_ci")
	return err
}

func (a *OrmManager) open() {
	if err := a.createDatabase(); err != nil {
		panic(err)
	}

	engine, err := xorm.NewEngine(a.driverName, a.dataSourceName+"mouselog")
	if err != nil {
		panic(err)
	}

	a.engine = engine
	a.createTables()
}

func (a *OrmManager) close() {
	a.engine.Close()
	a.engine = nil
}

func (a *OrmManager) createTables() {
	err := a.engine.Sync2(new(Website))
	if err != nil {
		panic(err)
	}

	err = a.engine.Sync2(new(Session))
	if err != nil {
		panic(err)
	}
}
