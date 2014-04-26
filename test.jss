function car() {
  var x = <sql>
    SELECT * FROM user
    WHERE name = $1 AND id = $2
  </sql>;

  return x;
};

console.log(car());