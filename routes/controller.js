//body parser is used to pass the parms in the form-data
var bodyParser = require("body-parser");
var mysql      =   require("mysql");
//uniqid->access_token
var uniqid = require("uniqid");
var connection =   mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: 'admin'
});
var bcrypt = require('bcrypt');
connection.query('use mobileapp');
//controller actions for routes
//the database  existence check it is present in the
exports.test = function(req, res){
 connection.query('select * from users', function(err, rows) {
  if(err) throw error;
     res.render("test",{
      //rows is a call back of the query
     users: rows
   });
 });
};
exports.log = function(){
  //just check the function whether it is working fine with calling
   console.log("log function");
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
          'insert into users (firstname, lastname, email, mobile, password, access_token) VALUES ("'+req.body.firstname+'", "'+req.body.lastname+'", "'+req.body.email+'", "'+req.body.mobile+'", "'+hash+'","'+uniqid()+'")';
             console.log(create);
               connection.query(create, function (err, rows) {
                  //error handled
                  if(err)
                      {
                        res.status(500).json({
                                        error: "true",
                                        err_message: "email already exists"});
                       }
                   res.json({error: false, error_message:"suuccess fully inserted"});
                    //res.redirect('/test');
   });
};

exports.login = function(req, res){
    //sql query used for take from total data base
   var password =  req.body.password;
    var email    =  req.body.email;
     console.log(email);
      var query = 'select firstname,lastname, email, mobile from users where email = "'+email+'"';
           connection.query(query, function(err, rows){
               //encrypt while insert insert into db
                 var salt  =  bcrypt.genSaltSync(10);
                   var hash  =  bcrypt.hashSync(password, salt);
                    console.log(password);
                     bcrypt.compare(password, hash, function(err, callback){
                      console.log(callback);
                     //check whether the call back is true or not
                        //if email is not present [].length===0
                            if(rows.length != 0){
                              console.log("mailid==>", email);
                                if(rows[0].email === email && callback){
                                 console.log("redirect to login page");
                                res.json({error: false, error_message:"suuccess fully login"});
                                }
                            }
                            else{console.log("redirect to home page not valid");
                            res.json(
                                      {error: true,
                                      error_message:"not valid credentials"});
                         }
                  });
       });
};
exports.update = function(req, res){

  //naresh@pyramidions.in
     //update the users to perform the access_token
      // req is access_token if it is equal to the item present in the db
    var token      =  req.headers.token;
    var firstname  =  req.body.firstname;
    var lastname   =   req.body.lastname;
    var query =
        'UPDATE users SET firstname="'+firstname+'", lastname = "'+lastname+'" WHERE access_token = "'+token+'"';
      connection.query(query, function(err, rows){
        console.log(rows);
        console.log(rows.affectedRows);
        console.log("after query");
           if(err){
                res.json("error occured");
              }
          if(rows.affectedRows!= 0){
            res.json("updateed success");
          }
          else{res.json("cannot updated")}
    });
};
