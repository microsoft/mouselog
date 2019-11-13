package util

import "sort"

type KvByKey struct {
	Key   interface{}
	Value string
}

func SortMapsByKey(m *map[string]interface{}) *[]KvByKey {
	var sm []KvByKey
	for k, v := range *m {
		sm = append(sm, KvByKey{v, k})
	}

	sort.Slice(sm, func(i, j int) bool {
		return sm[i].Value < sm[j].Value
	})

	return &sm
}
