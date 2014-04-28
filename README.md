js-sql [![Build Status](https://travis-ci.org/lalitkapoor/js-sql.png?branch=master)](https://travis-ci.org/lalitkapoor/js-sql)
======

Write SQL in your JavaScript

**Under development**

### Examples

```javascript
function foo(table) {
  var x = <sql>
    SELECT * FROM {table}
    WHERE name = $1 AND id = {getId()}
  </sql>;

  return x;
};

function getId() {
  return 4;
}

console.log(foo("user")); // SELECT * FROM user WHERE name = $1 AND id = 4
```

**A few simple examples**

```javascript
var sql = <sql>SELECT * FROM users WHERE id = $1</sql>
// SELECT * FROM users WHERE id = $1
```

```javascript
// multi-line support
var sql = <sql>
  SELECT * FROM users
  WHERE id = $1
</sql>
// SELECT * FROM users WHERE id = $1
```

**Examples of JavaScript in your SQL**

```javascript
var sql = <sql>
  SELECT * FROM users
  WHERE id = {3+4}
</sql>
// SELECT * FROM users WHERE id = 7
```

```javascript
var email = 'test@test.test'
var sql = <sql>
  SELECT * FROM users
  WHERE email = '{email}'
</sql>
// SELECT * FROM users WHERE email = 'test@test.test'
```

```javascript
var email = 'test@test.test'
var sql = <sql>
  SELECT * FROM users
  WHERE email = '{"pre-"+email}'
</sql>
// SELECT * FROM users WHERE email = 'pre-test@test.test'
```

```javascript
var getEmail = function() {
  return "test@test.test"
}

var sql = <sql>
  SELECT * FROM users
  WHERE email = '{getEmail()}'
</sql>
// SELECT * FROM users WHERE email = 'test@test.test'
```

### JSS command usage

```
Usage: jss [options] <source directory> <output directory> [<module ID> [<module ID> ...]]

Options:

  -h, --help                               output usage information
  -V, --version                            output the version number
  -c, --config [file]                      JSON configuration file (no file means STDIN)
  -w, --watch                              Continually rebuild
  -x, --extension <js | coffee | ...>      File extension to assume when resolving module identifiers
  --relativize                             Rewrite all module identifiers to be relative
  --follow-requires                        Scan modules for required dependencies
  --cache-dir <directory>                  Alternate directory to use for disk cache
  --no-cache-dir                           Disable the disk cache
  --source-charset <utf8 | win1252 | ...>  Charset of source (default: utf8)
  --output-charset <utf8 | win1252 | ...>  Charset of output (default: utf8)
  --harmony                                Turns on JS transformations such as ES6 Classes etc.
```

### Transpiling example

```bash
jss -x jss src/ build/ # this will transpile all .jss files in the src directory into the build directory
```

**vim plugin support is here:** [vim-js-sql](https://github.com/lalitkapoor/vim-js-sql)

[![Click to view video](http://f.cl.ly/items/2K0c2c2n261Q061I120t/Screenshot%202014-04-27%2000.47.08.png)](https://www.youtube.com/watch?v=x9F9_Lt0Iuw)
