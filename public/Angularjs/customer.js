//loading the 'login' angularJS module
var customer = angular.module('customer', []);
// defining the login controller

customer.controller('customer', function($scope, $http) {
	// Initializing the 'invalid_login' and 'unexpected_error'
	// to be hidden in the UI by setting them true,
	// Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.hideloadrequest = true;
	$scope.unexpected_error = true;
	$scope.showModal = false;
	$scope.signuphome = function() {
		window.location.assign("/signup");
	}
	
	$scope.searchByServices = function(){
		$http({
			method : "POST",
			url : '/fetchSPDetails',
			data : {
				"location" : $scope.searchbyloc,
				"serviceType" : ""
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.spDetails = data.results;
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.showRequestHistory = function(){
		$scope.hideloadrequest = false;
	}
	
	$scope.loadRequestHistory = function(){
		
		$http({
			method : "GET",
			url : '/viewRequestHistory',
			
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				
			} else{
				
				$scope.requesthistory = data.results;
			}
		}).error(function(error) {
			
		});
		
	}
	

	
	$scope.done = function(x,index){
		
		$http({
			method : "POST",
			url : '/addReview',
			data : {
				"requestId" : x._id,
				"serviceId" : x.serviceid,
				"serviceType" : x.servicetype,
				"rating" : document.getElementById("rating_"+x._id).value,
				"comment" :  document.getElementById("comment_"+x._id).value
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
			
			} else{
				$scope.loadRequestHistory();
			}
		}).error(function(error) {
			
		});
				
	}
	
	$scope.searchByLocationAndService = function(){
		$http({
			method : "POST",
			url : '/fetchSPDetails',
			data : {
				"location" : $scope.advanceloc,
				"serviceType" : $scope.advanceservice
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.spDetails = data.results;
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.fetchDefaultSP = function(){
		
		$http({
			method : "POST",
			url : '/fetchSPDetails',
			data : {
				"location" : "San Jose",
				"serviceType" : ""
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.spDetails = data.results;
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.showsearch = function() {
		$scope.hidenormalsearch = false;
		$scope.hideadvancesearch = true;
		$scope.none = true;
		// window.location.assign("/login/login");
	}
	
	$scope.advanceSearch = function() {
		$scope.hidenormalsearch = true;
		$scope.hideadvancesearch = false;
		// window.location.assign("/login/login");
	}
	
	$scope.searchBack = function() {
		$scope.hidenormalsearch = false;
		$scope.hideadvancesearch = true;
		// window.location.assign("/login/login");
	}

	$scope.checklogin = function() {

		$http({
			method : "POST",
			url : '/login/loginnext',
			data : {
				"loginid" : $scope.email,
				"loginpassword" : $scope.password
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			} else
				// Making a get call to the '/redirectToHomepage' API
				window.location.assign("/userhomepage");
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});

	}



					
					
					
				})
