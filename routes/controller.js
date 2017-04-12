var bodyParser = require("body-parser");
var mysql      =   require('mysql');
var multiparty = require('multiparty')
var connection =   mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: 'admin'
});
var bcrypt = require('bcrypt');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var data = 'data';//already created database
connection.query('use mobileapp');
//controller action
exports.hello = function(req, res){
  bcrypt.genSalt(10, function(err, salt){
  console.log(req.body.password);
    bcrypt.hash(req.body.password, salt, function(err, hash){
       console.log(hash);
    });
  });
  res.send("controller action is working fine");
};
//the database  existence check
exports.test = function(req, res){
 connection.query('select * from users', function(err, rows) {
  if(err) throw error;
     res.render("test",{
      //rows is a call back of the query
     users: rows
   });
 });
};
//meant for creating users==>signup
exports.register = function(req, res){
  //hash the pasword
  console.log("inside controller");
   var salt = bcrypt.genSaltSync(10);
   var password = req.body.password;
    //encrypt password
  var hash = bcrypt.hashSync(password, salt);
   //meant for call callback
   var create =
       'insert into users (firstname, lastname, email, mobile, password) VALUES ("'+req.body.firstname+'", "'+req.body.lastname+'", "'+req.body.email+'", "'+req.body.mobile+'", "'+hash+'")';
   console.log(create);
   connection.query(create, function (err, rows) {
    if(err) throw error;
            res.json(rows);
             //res.redirect('/test');
   });
};
exports.login = function(req, res){
    //sql query used for take from total data base
   var password =  req.headers.password;
    var email    =  req.headers.email;
    console.log(email);
     var query = 'select * from users where email = "'+email+'"';
        connection.query(query, function(err, rows){
          console.log(rows);
          if(err) throw error;
                  var salt  =  bcrypt.genSaltSync(10);
                  var hash  =  bcrypt.hashSync(password, salt);
                  bcrypt.compare(password, hash, function (err, callback){
                    console.log(callback);//callback
                     if(err) throw err;
                      console.log("mailid==>", email);
                          console.log(rows[0].firstname);
                             if(rows[0].email === email && callback){
                                console.log("logged in");
                                }
                        else{console.log("not logged in");}
                  });
      res.send(rows);
       });
};
