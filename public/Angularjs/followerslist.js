
var followerslist = angular.module('followerslist', ['ng-fusioncharts']);


followerslist.controller('profile', function($scope, $http,$rootScope) {
	$scope.hidedesc = true;
	$scope.showService = function(results,x){
		$rootScope.servid = results.services[x].serviceid;
		$scope.hidedesc = false;
		$scope.index = x;
		$scope.desc = results;
		
		$http({
			method : "POST",
			url : '/fetchService',
			data:{
				"serviceId":results.services[x].serviceid,
				"spId":results._id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	$scope.showg = function(){
		$rootScope.init();
	}
	$scope.requestservice = function(results,x){
		$scope.hidedesc = true;

		$http({
			method : "POST",
			url : '/requestSP',
			data:{
				"spId":results._id,
				"name":results.name,
				"serviceId":results.services[x].serviceid,
				"serviceType":results.services[x].servicetype,
				"mouCustomer":document.getElementById("hiddenpdf").value
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Please login to request the Service.");
				window.location.assign('/login1');
			} else
				{
				
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	function daydiff(first, second) {
	    return Math.round((second.getTime() - first.getTime())/(1000*60*60*24));
	}
	
});

followerslist.controller('chart', function($scope, $http,$rootScope) {
	$rootScope.myDataSrc = {};
	$rootScope.init = function()
	{	
	
	var spId = document.getElementById("hiddenspid").value;

	$http({
		method : "POST",
		url : '/fetchCommonGraphParameters',
		data:{
			"spId":spId
		}
	}).success(function(data) {
		//checking the response data for statusCode
		if (data.statusCode == 401) {
			alert('Unexpected error');
		} else
			{
			
			$rootScope.myDataSrc = data.results;
			}
	}).error(function(error) {
		alert('Unexpected error');
	});

		
	}
	
	
	$scope.servicegraph = function()
	{
		var from =document.getElementById("inputtodate").value;
		var to =document.getElementById("inputfromdate").value;
		var d2 = new Date(from);
		var d1 = new Date(to);
		$scope.showRevenue = false;	
		$scope.smd = true;
		$scope.showMap = true;
		
		if(daydiff(d2, d1)!=7){
			alert("Please enter proper dates!")
			return false;
		}
		var spId = document.getElementById("hiddenspid").value;
		//var spId = document.getElementById("hiddenspid").value;
		if(typeof $rootScope.servid != "undefined")
			{
		$http({
			method : "POST",
			url : '/fetchServiceWiseGraphParameters',
			data:{
				"spId":spId,
				"serviceId": $rootScope.servid,
				"from":from,
				"to":to
				
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				$rootScope.myDataSrc = data.results;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
			}
		
	}
	


	function daydiff(first, second) {
	    return Math.round((second.getTime() - first.getTime())/(1000*60*60*24));
	}
});

