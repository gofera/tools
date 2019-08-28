# Go Slide Present

## Feature

### Theme

Add theme in header block (before or after authors)

```
.theme <theme-name>
```

Now available themes are

- `asml`

### Agenda

Add `.agenda` in header block

### Play Code

#### Java

`.play <your-java-file.java>`

Java file must has no package and define a `Main` class with `main` method.

A minimize hello world could be

_hello.java_

```java
class Main{
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```

### Latex

**Inline**

Use `$` to wrap your formula

```
$a_b^c$
```

**External**

Use `.latex` command to import external file that contains latex formula

`.latex <file-path> [<formula-id>]`

If `<formula-id>` is not given, the file's whole content will be treated as a formula

If `<formula-id>` is given, the file must have following section

```
$$<formula-id>
// your formula here
$$
```

### PlantUML

`.uml [-scroll] [-width <integer unit px>] [-height <integer unit px>] [-style <css string without space>] <file-path>`

if `-style` is specified, `-scroll`, `-width` and `-height` will be skipped.

### ECharts

`.echarts <file-path> [<height> <width>]`

The file is a js script that defined a ECharts option named `option`