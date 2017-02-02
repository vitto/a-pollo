# How to test

We are using tap as test suite

#### To test the code run

```
npm test
```

#### To test single file

```
node test/tap/annotations.spec.js
```

#### Test coverage report

```
npm test -- --cov
```

#### HTML page test coverage report

This will generate a full HTML report with every detail on coverage

```
npm test -- --cov --coverage-report=lcov
```

---

## Test fixtures

#### Create JSON data

Save data with this helper, this will generate a `JSON` file with the data you pass as second parameter

```
const saveJson = require('save-json') // test/save-json.js
const exitWhenFinished = true

saveJson('path/to/file.json', {
  title: 'Title of this JSON data'
}, exitWhenFinished)
```

Or simply

```
require('./test/save-json')('test/tap/data/parse-files-2.json', files, true)
```

#### Load JSON data in tests

In the tap tests, load json data with `fixtures` helper, data is expected to be located in `/test/tap/data` path the extension will be automatically added

```
const fixtures = require('../tap-helper').fixtures('json-file')
console.log(fixtures)
```

#### Log fixtures

This will log JSON data as YAML in conosole with colored element names

```
const prettyjson = require('prettyjson')
const decoratedAnnotations = require('../tap-helper').fixtures('decorated-annotations')
console.log(prettyjson.render(decoratedAnnotations))
```
