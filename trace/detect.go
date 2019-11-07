package trace

func (es *Events) Detect() (bool, string) {
	if len(es.Data) > 100 {
		return true, "too many points, > 100"
	}

	return false, ""
}
