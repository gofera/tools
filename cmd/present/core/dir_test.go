package present_core

import "testing"

func TestRepository(t *testing.T) {
	v := repository("github.com/corylanou/go-mongo-presentation/presentation.slide")
	if v != "github.com/corylanou/go-mongo-presentation" {
		t.Error(v)
	}
	v = repository("github.com/corylanou/go-mongo-presentation")
	if v != "github.com/corylanou/go-mongo-presentation" {
		t.Error(v)
	}
	v = repository("github.com/corylanou/")
	if v != "" {
		t.Error(v)
	}
	v = repository("github.com/corylanou")
	if v != "" {
		t.Error(v)
	}
	v = repository("xxx/corylanou/go-mongo-presentation")
	if v != "" {
		t.Error(v)
	}
}

func TestBitBucketUserRepo(t *testing.T) {
	// https://git-brion-us.asml.com:8443/scm/~weliu/go_talks.git
	// https://git-brion-us.asml.com:8443/users/weliu/repos/go_talks/browse/go_talks.slide
	// https://git-brion-us.asml.com:8443/scm/brion_rnd_sjb/kona.git
	// https://git-brion-us.asml.com:8443/projects/BRION_RND_SJB/repos/kona/browse
	repoPath, dir := userRepository("users/weliu/repos/go_talks/browse/go_talks.slide")
	if repoPath != "scm/~weliu/go_talks.git" {
		t.Error(repoPath)
	}
	if dir != "users/weliu/repos/go_talks/browse" {
		t.Fatal(dir)
	}
}
