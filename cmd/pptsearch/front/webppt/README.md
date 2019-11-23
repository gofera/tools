# atlas

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# dev note
## element UI 表格 当有多个v-if 显示隐藏列的时候表格布局会飞
fix solution: https://segmentfault.com/q/1010000012432195/a-1020000012435344

问题已解决在每一个el-table-column 加一个:key="Math.random()"
牵扯到动态显示隐藏的，建议给 el-table-column 或 el-table 加上 key："Math.random()"
Math.random() 只是为了说明效果，实际使用任何唯一性的值都行。

Math.random() 有问题，每次编辑 text field （Key page的搜索框），都会重绘 table。
