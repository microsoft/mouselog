package screenshot

import "testing"

func TestSrceenshot(t *testing.T) {
	TakeScreenshot("https://mouselog.org", "../static/screenshots/mouselog/mouselog.png")
}
