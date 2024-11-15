var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit : 10,
    host            :"classmysql.engr.oregonstate.edu",
    user            : "cs340_zhengzho",
    password        : "8471",
    database        : "cs340_zhengzho"
});

module.exports.pool = pool;