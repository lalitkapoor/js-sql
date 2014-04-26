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

function test6(table, name) {
  var x = <sql>SELECT * FROM {table}
    WHERE id = $1 AND name = '{name}'</sql>;

  return x;
};

function test7(name) {
  var x = <sql>
    SELECT * FROM
    user,
    session
    WHERE id = $1 AND name = '{name}'
  </sql>;

  return x;
};

function test8(name) {
  var x = <sql>SELECT * FROM user, session WHERE id = $1 AND name = '{name}'</sql>;

  return x;
};

function test9(name) {
  var x = <sql>
    SELECT $1 FROM user
    WHERE id = {5+3} AND name = '{name}'
  </sql>;

  return x;
};

function test10(name) {
  var x = <sql>
    SELECT $1 FROM user
    WHERE id = {"5"+"3"} AND name = '{name}'
  </sql>;

  return x;
};

console.log(test1("Brian"));
console.log(test2("user", "Brian"));
console.log(test3("user", "Brian"));
console.log(test4("user", "Brian"));
console.log(test5("user", "Brian"));
console.log(test6("user", "Brian"));
console.log(test7("Brian"));
console.log(test8("Brian"));
console.log(test9("Brian"));
console.log(test10("Brian"));