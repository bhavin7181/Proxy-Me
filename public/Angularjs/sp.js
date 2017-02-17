
var sp = angular.module('sp', []);


sp.controller('sp', function($scope, $http,$rootScope) {
	$scope.hideaddservice = true;
	$scope.hidedesc = true;
	$scope.hiderequest = true;
	$scope.showService = function(results,x){
		$rootScope.servid = results.services[x].serviceid;
		$scope.hidedesc = false;
		$scope.index = x;
		$scope.desc = results;
	}
	
	$scope.initrequests = function(){
		$http({
			method : "GET",
			url : '/viewCustomerRequests',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				$scope.requests = data.results;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}	
	
	$scope.accept = function(results){
		$http({
			method : "POST",
			url : '/approveRequest',
			data:{
				requestId:results._id,
				status:"accept",
				spmou:document.getElementById("hiddenpdf").value
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				$scope.initrequests();
				$scope.hiderequest = true;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	$scope.showAddService = function(){
		$scope.hideaddservice = false;
	}
	
	$scope.addservice = function(){
	
		$http({
			method : "POST",
			url : '/addService',
		
			data:{
				serviceCategory:$scope.servicetype,
				serviceType:$scope.skills,
				description:$scope.description
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				$scope.hideaddservice = true;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	
    $scope.reject = function(results){
    	$http({
			method : "POST",
			url : '/approveRequest',
		
			data:{
				requestId:results._id,
				status:"reject",
				spmou:document.getElementById("hiddenpdf").value
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
				$scope.initrequests();
				$scope.hiderequest = true;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	
	$scope.showRequest = function(results){
		$scope.hiderequest = false;
		$scope.req = results;
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
				alert('Unexpected error');
			} else
				{
				
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}	
});

