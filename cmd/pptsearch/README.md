# build
```
$ go install golang.org/x/tools/cmd/pptsearch
$ cd front/webppt
$ yarn build
```
# start server
```
$ cd ~/ppt  (assume its the folder of web ppt contents)
$ pptsearch -static $GOPATH/src/golang.org/x/tools/cmd/pptsearch/front/webppt/dist
```
