var ejs = require("ejs");
var bcrypt = require('bcryptjs');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/Proxyme";
var mongo1 = require('mongodb');


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}


function addCountEntryInSearch(countType,email,serviceId)
{
	var sp_col = mongo.collection('serviceproviders');
	//var o_id = new mongo1.ObjectID(spId);
	
	var requestName = countType+serviceId;
	var requestTitle = countType+serviceId+'.date';
	var requestQuery = {};
	var cdate = new Date();
	requestQuery[requestTitle]=formatDate(cdate);
	//console.log(requestQuery);
	
	var query3Left = countType+serviceId+'.$.count';
	var query3 = {};
	query3[query3Left]=1;
	//console.log("query3 "+query3);
	
	
	var queryArr = new Array();
	//queryArr.push({'_id':o_id});
	queryArr.push({'_id':email});
	//console.log(queryArr[0]);
 	queryArr.push(requestQuery);
 	
 	var newElement = { $addToSet: {} };
 	newElement.$addToSet[requestName] = { date:formatDate(cdate),count:1 };
 	
	sp_col.update({$and:queryArr},{"$inc": query3},function(err,doc){
		//console.log(doc.result);
		if(doc==null || typeof doc=='undefined' || typeof doc.result=='undefined' || doc.result.nModified==0)
		{
			//console.log("doesn't exist");
			//sp_col.update({'_id':o_id}, newElement, function(err, result) {
			sp_col.update({'_id':email}, newElement, function(err, result) {
	        ////console.log("999"+result);
			});
		}
	});
}


function getDateString(date)
{
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}




exports.addService = function(req, res) {

	var username = req.session.username;
	var servicetype = req.param("serviceCategory");
	var skills = req.param("serviceType");
	var description = req.param("description");
	// from db:5720631961591668dbfa8f61
	
	var json_responses;
	mongo.connect(mongoURL, function() {
		var coll_counters = mongo.collection('counters');
		var seq = null;
		coll_counters.findOne({email : req.session.username},function(err,results)
				{
					if(results)
						{
						//console.log("results parr of seq:"+results.seq);
						seq = Number(results.seq)+1;
						//console.log("seq set to :"+seq);
						coll_counters.update(
								   { email: req.session.username },
								   { $set : {"seq": seq}});
						var sseq =  '' + seq;
						var coll_serviceproviders = mongo.collection('serviceproviders');
						coll_serviceproviders.updateOne({
							email : req.session.username
						}, {
							$push : {
								"services" : {
									"serviceid" : sseq,
									"servicetype" : servicetype,
									"skills" : skills,
									"description":description
								}
							}
						}, function(err, results) {

							if (err) {
								res.render("failure", {

									statusMessage : "Unexpected error occured",
									statusCode : 401
								});

							} else if (results) {

								res.send( {

									statusMessage : "Service updated successfully",
									statusCode : 200
								});

							}

						});
						}
					else
						{
						//console.log("in else part of sequence");
						coll_counters.insert({email:req.session.username,seq:1});
							
						
					var coll_serviceproviders = mongo.collection('serviceproviders');
					coll_serviceproviders.updateOne({
						email : req.session.username
					}, {
						$push : {
							"services" : {
								"serviceid" : "1",	
								"servicetype" : servicetype,
								"skills" : skills,
								"description":description
							}
						}
					}, function(err, results) {

						if (err) {
							res.render("failure", {

								statusMessage : "Unexpected error occured",
								statusCode : 401
							});

						} else if (results) {

							res.send({

								statusMessage : "Service updated successfully",
								statusCode : 200
							});

						}

					});
				}
				}
		
		);
	
	});
};
	
	exports.fetchService = function(req, res) {
		var spId =  req.param("spId");
		var o_id = new mongo1.ObjectID(spId);
		//console.log("Spid"+o_id)
		//var email = req.session.email;
		var serviceId = req.param("serviceId");
		var countType = "search";
		mongo.connect(mongoURL, function() {
			var coll_serviceproviders = mongo.collection('serviceproviders');
			//console.log("before function calling"+o_id+serviceId+countType);
			addCountEntryInSearch(countType,o_id,serviceId);
			
			
		
			coll_serviceproviders.findOne({"_id":o_id},
					function(err, results) {

				if (err) {
					res.render("failure", {

						statusMessage : "Unexpected error occured",
						statusCode : 401
					});

				} else if (results) {
					
					//console.log("results from fetchServices");

					res.send( {
						statusMessage : "Service updated successfully",
						statusCode : 200
					});

				}

			});
		
			
		});
		
		
	};
exports.getPendingRequest = function(req, res) {
	mongo.connect(mongoURL, function() {

		var coll_serviceproviders = mongo.collection('serviceproviders');

		coll_serviceproviders.find({"approved":0}).toArray( function(err, results) {

			if (err) {
				res.send({
					statusMessage : "Unexpected error occured",
					statusCode : 401
				});

			} else if (results) {

				//console.log(results);

				res.send({
					results : results,
					statusMessage : "Serviceproviders fetched successfully",
					statusCode : 200
				});

			}

		});

	});

};

exports.approveSP = function(req, res) {
	var spId =  req.param("spId");
	var o_id = new mongo1.ObjectID(spId);
	//var email = "bahubali@gmail.com";
	
	mongo.connect(mongoURL, function() {

		var coll_serviceproviders = mongo.collection('serviceproviders');

		coll_serviceproviders.updateOne({_id:o_id},{
			$set : {
				"approved" : 1
			}
		}, function(err, results) {

			if (err) {
				res.render("failure", {
					statusMessage : "Unexpected error occured",
					statusCode : 401
				});

			} else if (results) {

				//console.log(results);

				res.send({
					results : results,
					statusMessage : "Service Provider approved successfully",
					statusCode : 200
				});
			}
		});
});
};
exports.rejectSP = function(req, res) {
	var spId =  req.param("spId");
	var o_id = new mongo1.ObjectID(spId);
	//var email = "bahubali@gmail.com";
	
	mongo.connect(mongoURL, function() {

		var coll_serviceproviders = mongo.collection('serviceproviders');

		coll_serviceproviders.updateOne({_id:o_id},{
			$set : {
				"approved" : 2
			}
		}, function(err, results) {

			if (err) {
				res.render("failure", {

					statusMessage : "Unexpected error occured",
					statusCode : 401
				});

			} else if (results) {

				//console.log(results);

				res.render("adminhome", {
					results : results,
					statusMessage : "Serviceproviders rejected successfully",
					statusCode : 200
				});

			}

	

		});

});
};
