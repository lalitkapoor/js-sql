var assert = require ('assert')

describe('sql', function() {
  describe('inline', function() {
    it('should set the variable to the contents between the tags', function(){
      var sql = <sql>SELECT * FROM users WHERE id = $1</sql>
      assert(sql === "SELECT * FROM users WHERE id = $1")
    })
  })

  describe('multi-line', function() {
    it('should concat multi-line sql', function(){
      var sql = <sql>
        SELECT * FROM users
        WHERE id = $1
      </sql>
      assert(sql === "SELECT * FROM users WHERE id = $1")
    })
  })

  describe('with js - addition', function() {
    it('should perform addition and build sql string', function() {
      var sql = <sql>
        SELECT * FROM users
        WHERE id = {3+4}
      </sql>
      assert(sql === "SELECT * FROM users WHERE id = 7")
    })
  })

  describe('with js - substitution', function() {
    it('should substitute {email} with test@test.test', function() {
      var email = 'test@test.test'
      var sql = <sql>
        SELECT * FROM users
        WHERE email = '{email}'
      </sql>
      assert(sql === "SELECT * FROM users WHERE email = 'test@test.test'")
    })
  })

  describe('with js - string concat', function() {
    it('should substitute {"pre-"+email} with pre-test@test.test', function() {
      var email = 'test@test.test'
      var sql = <sql>
        SELECT * FROM users
        WHERE email = '{"pre-"+email}'
      </sql>
      assert(sql === "SELECT * FROM users WHERE email = 'pre-test@test.test'")
    })
  })

  describe('with js - function call', function() {
    it('should substitute {getEmail()} with test@test.test', function() {
      var getEmail = function() {
        return "test@test.test"
      }

      var sql = <sql>
        SELECT * FROM users
        WHERE email = '{getEmail()}'
      </sql>
      assert(sql === "SELECT * FROM users WHERE email = 'test@test.test'")
    })
  })
})