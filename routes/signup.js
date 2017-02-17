
/*
 * GET home page.
 */

var ejs = require("ejs");
var bcrypt = require('bcryptjs');
var mangoose = require('./model');
var models = require('./model');
	
exports.redirecttoSPSignup = function(req, res){
	  res.render('signupsp.ejs');
	};
	
exports.redirecttoCustomerSignup = function(req, res){
	  res.render('signupcustomer.ejs');
	};
exports.redirecttoAdminSignup = function(req, res){
	  res.render('adminlogin',{title:'ProxyMe!! Who can substitute me?'});
	};
	
exports.addServiceProvider =function(req, res) {
		//console.log("Inside insert data");
		var name = req.param("name");
		var email = req.param("email");
		var password =req.param("password");
		var contactNo = req.param("contactNo");
		var street = req.param("street");
		var city =  req.param("city");
		var state =  req.param("state");
		var zipCode =  req.param("zipCode");
		var country =  req.param("country");
		var category =req.param("category");
		var experience = req.param("experience");
		var image = req.param("image");
		var reviews = [];
		
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				  var serviceProvider = new models.ServiceProviders();
				  serviceProvider.name = name;
				  serviceProvider.email = email;
				  serviceProvider.password = hash;
				  serviceProvider.contactNo = parseInt(contactNo);
				  serviceProvider.street = street;
				  serviceProvider.city = city;
				  serviceProvider.state = state;
				  serviceProvider.zipCode = parseInt(zipCode);
				  serviceProvider.country = country;
				  serviceProvider.category = category;
				  serviceProvider.experience = parseInt(experience);
				  serviceProvider.image = image;
				  serviceProvider.approved = 0;
				  serviceProvider.reviews = reviews;
				  
				  //console.log("serviceProvider Data:"+serviceProvider.reviews);
				  
				  serviceProvider.save(function(err, results) {
						if (err) {
							res.render("failure", {
								
								statusMessage : "Invalid Parameters",
									statusCode:401
							});
						} else {
							//console.log("Inside insert data");
						//	//console.log("Final Results:"+results);
								ejs.renderFile('./views/pendingconfirmation.ejs', {
									results : results,
									statusCode:200,
									statusMessage:"Service provider request sent for approval "
								}, function(err, result) {
									// render on success
									if (!err) {
										res.end(result);
									}
									// render or error
									else {
										res.end('An error occurred');
										//console.log(err);
									}
								});
							} 
							
						
					});
			});
		});
		
		                                                           
		
	};
	exports.addCustomer =function(req, res) {
		//console.log("Inside insert data");
		var name = req.param("name");
		var email =  req.param("email");
		var password = req.param("password");
		var contactNumber = req.param("contactNo");
		var street =  req.param("street");
		var city =  req.param("city");
		var state =  req.param("state");
		var zipCode =  req.param("zipCode");
		var country =  req.param("country");
		var category =req.param("category");
		var fieldOfInterest = req.param("fieldOfInterest");
		var image = req.param("image");
		
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				  var user = new models.Users();
				  user.name = name;
				  user.email = email;
				  user.password = hash;
				  user.contactNo = contactNumber;
				  user.street = street;
				  user.city = city;
				  user.state = state;
				  user.zipCode = zipCode;
				  user.country = country;
				  user.category = category;
				  user.fieldOfInterest = fieldOfInterest;
				  user.image = image;
				  //console.log("Customer Data:"+user);
				  
				  user.save(function(err, results) {
						if (err) {
							res.render("failure", {
								
								statusMessage : "Invalid Parameters",
									statusCode:401
							});
						} else {
							//console.log("Inside insert data");
							//console.log("Final Results:"+results);
							res.render("customerhome", {
								results : results,
								statusCode:200,
								statusMessage:"Customer added successfully"
							});
						}
							
						
					
			});
		});
		
		                                                           
		
	});
		
	};
