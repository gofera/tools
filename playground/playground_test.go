package playground

import "testing"

func TestGetRepo(t *testing.T)  {
	v := getRepo("users/weliu/repos/go_talks/browse/")
	if v != "users/weliu/repos/go_talks/browse" {
		t.Error(v)
	}
	v = getRepo("users/weliu/repos/go_talks/")
	if v != "users/weliu/repos/go_talks/browse" {
		t.Error(v)
	}
	v = getRepo("users/weliu/repos/go_talks")
	if v != "users/weliu/repos/go_talks/browse" {
		t.Error(v)
	}
	v = getRepo("users/weliu/repos/")
	if v != "" {
		t.Error(v)
	}
	v = getRepo("xxx")
	if v != "" {
		t.Error(v)
	}
}
