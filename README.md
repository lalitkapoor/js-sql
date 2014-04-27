js-sql
======

Write SQL in your JavaScript

**Under development**

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

**vim plugin support is here:** [vim-js-sql](https://github.com/lalitkapoor/vim-js-sql)

[![Click to view video](http://f.cl.ly/items/2K0c2c2n261Q061I120t/Screenshot%202014-04-27%2000.47.08.png)](https://www.youtube.com/watch?v=x9F9_Lt0Iuw)
