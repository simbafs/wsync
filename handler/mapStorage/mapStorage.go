// mapstorage implement Storage interface, use map to store state only in memory
package mapstorage

import "errors"

var ErrorKeyNotFound = errors.New("key not found")

type MapStorage struct {
	data map[string]any
}

func New() MapStorage {
	m := MapStorage{}
	m.data = make(map[string]any)

	return m
}

func (m MapStorage) Set(key string, value any) error {
	m.data[key] = value
	return nil
}

func (m MapStorage) Get(key string) (any, error) {
	value, ok := m.data[key]
	if !ok {
		return "", ErrorKeyNotFound
	}
	return value, nil
}

func (m MapStorage) Remove(key string) error {
	delete(m.data, key)
	return nil
}

func (m MapStorage) Key() ([]string, error) {
	keys := []string{}
	for k := range m.data {
		keys = append(keys, k)
	}
	return keys, nil
}
