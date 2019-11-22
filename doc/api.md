# API DOC

## Search

#### Request

    /api/search?keyword=<keyword>
    
#### Response

**Format**: JSON

**Structure**:

- `Array`, each element is result set of a file
  - Path, `string`, the path in server. `server-url/path` could be the link to slide.
  - Lines, `Array`, search result in this file
    - Line, `int`, line number from 0
    - Section, `int`, section number from 0, 0 means the home page
    - Text, `string` the line's text

**Sample**:

```json
[{
    "Path": "users/dxu/repos/knowledge-sharing/browse/doc/machine/GA/ga.slide",
    "Lines": [
        {
            "Line": 0,
            "Section": 0,
            "Text": "Genetic Algorithm\r"
        },
        {
            "Line": 213,
            "Section": 29,
            "Text": "- GA may can't find the best solution but a good answer\r"
        }
    ]
}]
```
