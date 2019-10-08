# WebPPT

## build and start server
```
-bash-4.1$ pwd
/h/user/weliu/ppt
-bash-4.1$ ls
dark_side_go_runtime  scm  talks  users
-bash-4.1$ go install golang.org/x/tools/cmd/present
-bash-4.1$ present -nacl -play -use_playground
```

## Build Previewer

```
cd cmd/present/preview/package
go generate main.go
ls output/
```