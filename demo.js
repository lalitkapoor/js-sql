var noop = function(){}
var client = noop
client.query = noop

var hash = function(value) {
  return "hashed-value"
}

var getUser = function(email, password) {
  var sql = <sql>
    SELECT id FROM users
    WHERE email = '{email}' AND password = '{hash(password)}'
  </sql>

  //really you should use a parameterized query

  console.log(sql)
  
  client.query(sql, function(error, result) {
    // do your work
  })
}

getUser('lalitkapoor@gmail.com', 'secret')
