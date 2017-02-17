var ejs = require("ejs");
var bcrypt = require('bcryptjs');
var mangoose = require('./model');
var models = require('./model');

exports.login = function(req, res) {

	var username = req.param("email");
	var password = req.param("password");
	var category = req.param("category");
	//console.log("Username from request " + username);
	//console.log("Inside handle_login_request");
	var logger = null;
	if (category == "null" || category == "undefined" || category == "customer") {
		logger = models.Users;
	} else {
		//console.log("In service provider part");
		logger = models.ServiceProviders;
	}
	var json_responses;

	logger.findOne({
		email : username
	}, function(err, results1) {
		if (err) {
			throw err;
		} else {
			//console.log("Result.approved:" + results1.approved);
			//console.log("DB Result123 " + results1);
			
			if (results1) {
				bcrypt.compare(password, results1.password, function(err,
						compared) {
					//console.log("Compared :" + compared);
					if (compared) {
						//console.log("valid Login");
						req.session.username = username;
						if (category == "null" || category == "undefined" || category == "customer") {
						req.session.customerId = results1._id;
						req.session.name = results1.name;
						req.session.username = username;
						req.session.email = username;
						
						}
						else
							{
							req.session.spId = results1._id;
							req.session.username = username;
							req.session.email = username;
							}
						//console.log(req.session.id + " is the session");
						json_responses = {
							"statusCode" : 200
						};
						//console.log("category is" + category);
						if (category == "null" || category == "undefined"
								|| category == "customer") {

							res.render("customerhome", {
								results : results1,
								"statusCode" : 200
							});
						} else {
							
							if(results1.approved==1)
								{
							//console.log("123results from login:"+results1.services)
							res.render("sphome", {
								results : results1,
								"statusCode" : 200
							});
						}
						
						
						else
							{

							res.render("failure", {
								
								statusMessage : "Pending Approval from Admin",
									statusCode:403
							});

							} 
					}
					}

					else {
						//console.log("Invalid Login");
						res.render("failure", {
							statusMessage : "Invalid Login credentials",
								statusCode:403
						});


					}

				});
			}
			else{
				res.render("failure", {
					
					statusMessage : "Invalid Login credentials",
						statusCode:403
				});

			}
		}
	});

};
exports.redirecttoAdminLogin = function(req, res) {

	var username = req.param("email");
	var password = req.param("password");

	//console.log("Username from request " + username);
	//console.log("Inside handle_login_request");
	var logger = null;

	logger = models.Admins;

	var json_responses;

	logger.findOne({
		email : username
	}, function(err, results) {
		if (err) {
			throw err;
		} else {
			//console.log("DB Result" + results);
			if (results) {
				bcrypt.compare(password, results.password, function(err,
						compared) {
					//console.log("Compared :" + compared);
					if (compared) {
						//console.log("valid Login");
						req.session.username = username;
						//console.log(req.session.username + " is the session");

						res.render("adminhome", {
							data : results,
							title: 'Proxy Me!! Who can substitute me?',
							status : "Successful login",
							statusCode:200
						});

					}

					else {
						//console.log("Invalid Login");
						
						res.render("failure", {
							
							statusMessage : "Invalid login Credentials",
								statusCode:401
						});

					}

				});
			}
		}
	});

};
