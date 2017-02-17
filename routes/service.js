var mongo = require("./mongo");
var mongo1 = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;

exports.fetchSPDetails = function(req,res) {
	var location = req.param('location');
	var serviceName = req.param('serviceType');
	//console.log(location);
	//console.log(serviceName);
	//location='san';
	
	var sp_col = mongo.collection('serviceproviders');

	var queryArr = [{city:"####"}],isLocationEmpty =true;
	if(location!=null && typeof location !='undefined')
	{
		//location=location.toLowerCase();
		isLocationEmpty = false;
		queryArr.splice(0,1);
		queryArr.push({city:{$regex : ".*"+location+".*",$options:'i'}});
	}
	if(serviceName!=null && typeof serviceName !='undefined')
	{
		if(isLocationEmpty)
			queryArr.splice(0,1);
		queryArr.push({'services':{$elemMatch : {$or:[{'servicetype':{$regex : ".*"+serviceName+".*",$options:'i'}},
		                                              {'skills':{$regex : ".*"+serviceName+".*",$options:'i'}}]}}});
	}
	//console.log("queryArr1 "+JSON.stringify(queryArr));
	var cursor = sp_col.find({$and:queryArr}).sort({"experience":-1,"avgrating":-1});
	var l=0,m=0,spArr=[];
	cursor.count(function(err,ndocs)
	{
		var len = ndocs;
		if(len==0)
		{
			res.send({statusCode:403,statusMessage:"No results found for the Search."});
		}
		else
		{
			cursor.each(function(err,doc)
			{
				if(m==len)
				{
					////console.log("service providers "+spArr);
					res.send({statusCode:200,statusMessage:"Successful",results:spArr});
				}
				m++;
				if(doc!=null && typeof doc!='undefined')
				{
					////console.log("l "+l);
					spArr[l++]=doc;
					////console.log(doc);
				}
			});
		}
	});
}	

exports.showSPDetails = function(req,res)
{
	var spId = req.param('spId');
	
	
	var sp_col = mongo.collection('serviceproviders');
	var o_id = new mongo1.ObjectID(spId);
	//console.log("Id"+o_id)
	sp_col.findOne({_id:o_id},function(err,doc)
	{
		if(err)
		{
			res.render("failure",{statusCode:403,statusMessage:"No Service Providers found"});
		}
		else
		{
			//console.log("123"+JSON.stringify(doc.reviews));
			res.render("spprofile",{"results":doc,statusCode:200,statusMessage:"Successful"});
			//res.r({statusCode:200,statusMessage:"Successful",results:doc});
		}
	});
}

function getCatArrayForRange(startDate, endDate)
{
    var catArray = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
    	catArray.push({"Label":getDateString(currentDate)});
        currentDate = currentDate.addDays(1);
    }
    return catArray;
}

exports.fetchCommonGraphParameters = function(req,res)
{
	var spId = req.param('spId');
	var o_id = new mongo1.ObjectID(spId);
	var catArray = new Array();
	var dataSetArray = new Array();
	var dataSetValues;
	var json={
			    "chart": {
			        "caption": "Searched,Requested & fulfilled",
			        "xaxisname": "Services",
			        "yaxisname": "No of times",
			        "theme": "fint"
			    }
			};
	
	var sp_col = mongo.collection('serviceproviders');
	sp_col.findOne({_id:o_id},function(err,doc)
	{
		if(err)
		{
			res.send({statusCode:403,statusMessage:"No Service Providers found"});
		}
		else
		{
			if(doc!=null)
			{
				var servicesArray = doc.services;
				if(servicesArray.length>0)
				{
					searchDataSetValues = new Array();
					var searchCount,requestCount,doneCount;
					requestDataSetValues = new Array();
					doneDataSetValues = new Array();
					for(var i=0;i<servicesArray.length;i++)
					{
						var service = servicesArray[i];
						var serviceId = service.serviceid;
						var searchCount=0,requestCount=0,doneCount=0;
						catArray.push({"Label":service.servicetype});
						////console.log("789search "+i+" ggg "+serviceId+" ddd "+doc["search"+serviceId]);
						var searchArray = doc["search"+serviceId];
						if(typeof searchArray !='undefined' && searchArray.length>0)
						{
							for(var j=0;j<searchArray.length;j++)
							{
								searchCount=searchCount+searchArray[j].count;
							}
						}
						searchDataSetValues.push({"value":searchCount});
						
						var requestArray = doc["request"+serviceId];
						if(typeof requestArray !='undefined' && requestArray.length>0)
						{
							for(var j=0;j<requestArray.length;j++)
							{
								requestCount=requestCount+requestArray[j].count;
							}
						}
						requestDataSetValues.push({"value":requestCount});
						
						var doneArray = doc["done"+serviceId];
						if(typeof doneArray !='undefined' && doneArray.length>0)
						{
							for(var j=0;j<doneArray.length;j++)
							{
								doneCount=doneCount+doneArray[j].count;
							}
						}
						doneDataSetValues.push({"value":doneCount});
					}
					dataSetArray.push({
			            "seriesname": "searched",
			            "data": searchDataSetValues
			        });
					dataSetArray.push({
			            "seriesname": "requested",
			            "renderas": "line",
			            "showvalues": "0",
			            "data":requestDataSetValues
			        });
					dataSetArray.push({
			            "seriesname": "done",
			            "renderas": "area",
			            "showvalues": "0",
			            "data": doneDataSetValues
			        });
					json.categories=[{"category":catArray}];
					json.dataset=dataSetArray;
				}
				/*if(doc.search.length>0)
				{
					
				}*/
				//if(doc.services!=null && doc.services.length==0)
			}
			res.send({statusCode:200,statusMessage:"Successful",results:json});
			
		}
	});
}
	
exports.fetchServiceWiseGraphParameters = function(req,res)
{
	var spId = req.param('spId');
	var o_id = new mongo1.ObjectID(spId);
	var serviceId = req.param('serviceId');
	var from = req.param('from');
	var to = req.param('to');
	var fromArr = from.split("-");
	var toArr = to.split("-");
	var fromDateObj = new Date(fromArr[0], fromArr[1] - 1, fromArr[2]);
	var toDateObj = new Date(toArr[0], toArr[1] - 1, toArr[2]);
	var searchDataSetValues = new Array();
	var requestDataSetValues = new Array();
	var doneDataSetValues = new Array();
	var dataSetArray = new Array();
	
	
	var queryArr = new Array();
	queryArr.push({'_id':o_id});
	queryArr.push({'services':{$elemMatch : {$or:[{'serviceid':serviceId}]}}});
	
	var json={
		    "chart": {
		        "caption": "Searched,Requested & fulfilled",
		        "xaxisname": "Date Range between "+getDateString(fromDateObj)+" and "+getDateString(toDateObj),
		        "yaxisname": "No of times",
		        "theme": "fint"
		    }
	};
	var catArray = getCatArrayForRange(fromDateObj,toDateObj);
	json.categories=[{"category":catArray}];
	
	var sp_col = mongo.collection('serviceproviders');
	sp_col.findOne({$and:queryArr},function(err,doc)
	{
		if(err)
		{
			res.send({statusCode:403,statusMessage:"No Service Providers found"});
		}
		else
		{
			if(doc!=null)
			{
				var service = doc.services[serviceId-1];
				
				var searchArray = doc["search"+serviceId];
				//var searchArray = service.search;
				searchDataSetValues = getDataSetForServiceSpecific(searchArray,fromDateObj,toDateObj);
				
				var requestArray = doc["request"+serviceId];
				requestDataSetValues = getDataSetForServiceSpecific(requestArray,fromDateObj,toDateObj);
				
				var doneArray = doc["done"+serviceId];
				doneDataSetValues = getDataSetForServiceSpecific(doneArray,fromDateObj,toDateObj);
				
				dataSetArray.push({
		            "seriesname": "searched",
		            "data": searchDataSetValues
		        });
				
				dataSetArray.push({
		            "seriesname": "requested",
		            "renderas": "line",
		            "showvalues": "0",
		            "data":requestDataSetValues
		        });
				dataSetArray.push({
		            "seriesname": "done",
		            "renderas": "area",
		            "showvalues": "0",
		            "data": doneDataSetValues
		        });
				json.dataset=dataSetArray;
				res.send({statusCode:200,statusMessage:"Successful",results:json});
			}
			else
				res.send({statusCode:403,statusMessage:"No such Service found"});
		}
	});
}

function getDateObjectFromMMDDYYYY(dateString)
{
	var from = dateString.split("/");
	return new Date(from[1], from[0] - 1, from[2]);
}

function getDataSetForServiceSpecific(attrArray,fromDateObj,toDateObj)
{
	var dataSetValuesArray = new Array();
	if(typeof attrArray !='undefined' && attrArray.length>0)
	{
		var currentDate = fromDateObj;
		while(currentDate<=toDateObj)
		{
			var isDateFound = false;
			for(var j=0;j<attrArray.length;j++)
			{
				//console.log("777 "+attrArray[j].date+" 777 currentdate"+formatDate(currentDate));
				
				if(attrArray[j].date==formatDate(currentDate))
				{
					isDateFound = true;
					dataSetValuesArray.push({"value":attrArray[j].count});
					break;
				}
			}
			if(!isDateFound)
				dataSetValuesArray.push({"value":0});
			currentDate = currentDate.addDays(1);
		}
		
	}
	else
	{
		var currentDate = fromDateObj;
		while(currentDate<=toDateObj)
		{
			dataSetValuesArray.push({"value":0});
			currentDate = currentDate.addDays(1);
		}
	}
	return dataSetValuesArray;
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDateString(date)
{
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

exports.requestSP = function(req,res)
{
	if(validateSession(req,res))
	{
		var customerId = req.session.customerId;
		var name = req.session.name;
		var spId = req.param("spId");
		var serviceId = req.param("serviceId");
		//console.log("km nu"+req.param("serviceId"));
		var mouCustomer = req.param("mouCustomer");
		var serviceType = req.param('serviceType');
		
		var rd_col = mongo.collection('requestdetails');
		rd_col.insert({spid:spId,customerid:customerId,servicetype:serviceType,name:name,serviceid:serviceId,moucustomer:mouCustomer,status:'pending'},function(err,doc)
		{
		});
		addCountEntryInHistory('request',spId,serviceId);
		res.send({statusCode:200,statusMessage:"Successful"});
	}
}

function addCountEntryInHistory(countType,spId,serviceId)
{
	var sp_col = mongo.collection('serviceproviders');
	var o_id = new mongo1.ObjectID(spId);
	
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
	queryArr.push({'_id':o_id});
	//console.log(queryArr[0]);
 	queryArr.push(requestQuery);
 	
 	var newElement = { $addToSet: {} };
 	newElement.$addToSet[requestName] = { date:formatDate(cdate),count:1 };
 	
	sp_col.update({$and:queryArr},{"$inc": query3},function(err,doc){
		//console.log(doc.result);
		if(doc==null || typeof doc=='undefined' || typeof doc.result=='undefined' || doc.result.nModified==0)
		{
			//console.log("doesn't exist");
			sp_col.update({'_id':o_id}, newElement, function(err, result) {
	        ////console.log("999"+result);
			});
		}
	});
}

exports.viewRequestHistory = function(req,res)
{
	
	if(validateSession(req,res))
	{
		var customerId = req.session.customerId;
		var req_col = mongo.collection('requestdetails');
		var cursor = req_col.find({customerid:customerId});
		var l=0,m=0,requestsArray=[];
		cursor.count(function(err,ndocs)
		{
			var len = ndocs;
			cursor.each(function(err,doc)
			{
				if(m==len)
				{
					////console.log("cursor.length" +cursor.length);
					////console.log("requestsArray "+requestsArray);
					res.send({statusCode:200,statusMessage:'successful',results:requestsArray});
				}
				m++;
				if(doc!=null && typeof doc._id !='undefined' && doc._id!=null)
				{
					////console.log("l "+l);
					requestsArray[l++]=doc;
					////console.log(doc);
				}
			});
		});
	}
}

exports.viewCustomerRequests = function(req,res)
{
	if(validateSession(req,res))
	{
		var spId = req.session.spId;
		//spId='5720631961591668dbfa8f61';
		var o_id = new mongo1.ObjectID(spId);
		//var sp_col = mongo.collection('serviceproviders');
		var req_col = mongo.collection('requestdetails');
		var cursor = req_col.find({spid:spId,status:'pending'});
		var l=0,m=0,requestsArray=[];
		//console.log("Spidddddddddddddd"+o_id)
		cursor.count(function(err,ndocs)
		{
			var len = ndocs;
			cursor.each(function(err,doc)
			{
				if(m==len)
				{
					////console.log("cursor.length" +cursor.length);
					////console.log("requestsArray "+requestsArray);
					res.send({statusCode:200,statusMessage:'successful',results:requestsArray});
				}
				m++;
				if(doc!=null && typeof doc._id !='undefined' && doc._id!=null)
				{
					////console.log("l "+l);
					requestsArray[l++]=doc;
					////console.log(doc);
				}
			});
		});
	}
}

exports.approveRequest = function(req,res)
{
	if(validateSession(req,res))
	{
		var requestId = req.param('requestId');
		var status = req.param('status')=='accept'?'accepted':'rejected';
		var spmou = req.param('spmou');
		var o_id = new mongo1.ObjectID(requestId);
		//console.log("***********"+o_id)
		var req_col = mongo.collection('requestdetails');
		req_col.updateOne({_id:o_id},{$set:{status:status,spmou:spmou}},function(err,doc)
		{
			if(err) res.send({statusCode:401,statusMessage:"Unexpected error"});
			else res.send({statusCode:200,statusMessage:"Successful"});
		});
	}
}

exports.addReview = function(req,res)
{
	if(validateSession(req,res))
	{
		var customerId = req.session.customerId;
		var requestId = req.param('requestId');
		var serviceType = req.param('serviceType');
		//console.log("99999"+serviceType);
		var comment = req.param("comment");
		var rating = req.param("rating");
		var request_o_id = new mongo1.ObjectID(requestId);
		var name = req.session.name;
		
		var review = {
			"customerid": customerId,
            "customername" : name,
            "servicetype" : serviceType,
            "rating" : rating,
            "comment" : comment
        }
		
		var sp_col = mongo.collection("serviceproviders");
		var req_col= mongo.collection("requestdetails");
		
		req_col.findOne({_id:request_o_id},function(err,doc){
			var spId = doc.spid;
			var serviceId = doc.serviceid;
			var sp_o_id = new mongo1.ObjectID(spId);
			
			req_col.updateOne({_id:request_o_id},{'$set':{status:'done'}},function(err,doc)
					{
						if(err)
						{
							res.send({statusCode:401,statusMessage:'Unexpected error occurred'});
						}
						else
						{
							sp_col.updateOne({_id:sp_o_id},{$push:{"reviews":review}},function(err,doc)
							{
								addCountEntryInHistory('done',spId,serviceId);
								updateAvgRating(sp_col,sp_o_id);
								res.send({statusCode:200,statusMessage:"Successful"});
							});
						}
					})
		});
	}
}

function updateAvgRating(sp_col,sp_o_id)
{
	sp_col.findOne({_id:sp_o_id},{'reviews':1},function(err,doc)
	{
		if(err){}
		else
		{
			var arr = doc.reviews,avg=0,sum=0;
			if(arr==null || typeof arr == 'undefined' || arr.length==0)
				avg=0;
			else
			{
				for(var i=0;i<arr.length;i++)
				{
					console.log(JSON.stringify(arr[i]));
					sum = sum+Number(arr[i].rating);
					console.log(sum);
				}
				avg=sum/arr.length;
				avg=avg.toFixed(2);
			}
			sp_col.updateOne({_id:sp_o_id},{$set:{avgrating:avg}},function(err,doc){
				console.log(avg);
			})
		}
		
	});
}

function validateSession(req,res)
{
	console.log("Inside validate session "+req.session.customerId);
	if(req.session.customerId || req.session.spId)
	{
		return true;
	}
	else
	{
		res.send({title:'Proxy Me',statusCode:401});
		return false;
	}
}
