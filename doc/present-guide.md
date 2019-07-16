# Go Slide Present

## Feature

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
