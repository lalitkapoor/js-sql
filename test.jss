function test1(name) {
  var x = <sql>
    SELECT * FROM user
    WHERE id = $1 AND name = '{name}'
  </sql>;

  return x;
};

function test2(table, name) {
  var x = <sql>
    SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'
  </sql>;

  return x;
};

function test3(table, name) {
  var x = <sql>
    {table} SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'
  </sql>;

  return x;
};

function test4(table, name) {
  var x = <sql>{table} SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'
  </sql>;

  return x;
};

function test5(table, name) {
  var x = <sql>{table} SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'</sql>;

  return x;
};

function test5(table, name) {
  var x = <sql>SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'</sql>;

  return x;
};

console.log(test1("Brian"));
console.log(test2("user", "Brian"));
console.log(test3("user", "Brian"));