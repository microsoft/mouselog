// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Refer to https://github.com/EagleChen/mapmutex
package trace

import (
	"math/rand"
	"sync"
	"time"
)

var impressionMapMutex *MapMutex

// Mutex is the mutex with synchronized map
// it's for reducing unnecessary locks among different keys
type MapMutex struct {
	locks     map[string]bool
	m         *sync.Mutex
	maxRetry  int
	maxDelay  float64 // in nanosend
	baseDelay float64 // in nanosecond
	factor    float64
	jitter    float64
}

// TryLock tries to aquire the lock.
func (m *MapMutex) TryLock(key string) (gotLock bool) {
	for i := 0; ; i++ {
		m.m.Lock()
		if _, ok := m.locks[key]; ok { // if locked (key is in m.locks)
			m.m.Unlock()
			time.Sleep(m.backoff(i))
		} else { // if unlock (key is not in m.locks), lock it
			m.locks[key] = true
			m.m.Unlock()
			return true
		}
	}
}

// Unlock unlocks for the key
// please call Unlock only after having aquired the lock
func (m *MapMutex) Unlock(key string) {
	m.m.Lock()
	delete(m.locks, key)
	m.m.Unlock()
}

// borrowed from grpc
func (m *MapMutex) backoff(retries int) time.Duration {
	if retries == 0 {
		return time.Duration(m.baseDelay) * time.Nanosecond
	}
	backoff, max := m.baseDelay, m.maxDelay
	for backoff < max && retries > 0 {
		backoff *= m.factor
		retries--
	}
	if backoff > max {
		backoff = max
	}
	backoff *= 1 + m.jitter*(rand.Float64()*2-1)
	if backoff < 0 {
		return 0
	}
	return time.Duration(backoff) * time.Nanosecond
}

// NewMapMutex returns a mapmutex with default configs
func NewMapMutex() *MapMutex {
	return &MapMutex{
		locks:     make(map[string]bool),
		m:         &sync.Mutex{},
		maxRetry:  200,
		maxDelay:  100000000, // 0.1 second
		baseDelay: 10,        // 10 nanosecond
		factor:    1.1,
		jitter:    0.2,
	}
}

func InitMapMutexes() {
	impressionMapMutex = NewMapMutex()
}
