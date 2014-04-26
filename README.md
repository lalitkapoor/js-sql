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
