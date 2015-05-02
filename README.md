# architect [![wercker status](https://app.wercker.com/status/7a2d09813ba0f2f5873d2fa9b120230f/s "wercker status")](https://app.wercker.com/project/bykey/7a2d09813ba0f2f5873d2fa9b120230f)
A library to convert API Blueprint AST to Markdown built in js

## Usage:
Architect only exposes one method `parse`, and it only takes one
argument, your API Blueprint AST json.

`parse` will return a string containing the generated markdown.

```js
var architect = require('architect');
markdown = architect.parse(apiAST)
```
