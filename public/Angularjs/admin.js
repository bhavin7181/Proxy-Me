//loading the 'login' angularJS module
var admin = angular.module('admin', []);
// defining the login controller

admin.controller('admin', function($scope, $http) {
	
	$scope.initApprovals = function(){
		
		$http({
			method : "GET",
			url : '/getPendingRequest',
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.listSPApprovals = data.results;
			}
		}).error(function(error) {
			
		});
	}
	$scope.approveSP = function(x){
alert("approve")
		$http({
			method : "POST",
			url : '/approveSP',
			data:{
				"spId":x
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.initApprovals();
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.rejectSP = function(){
		alert("reject")
		$http({
			method : "POST",
			url : '/rejectSP',
			data:{
				"spId":x
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.none = false;
			} else{
				$scope.initApprovals();
			}
		}).error(function(error) {
			
		});
	}
		
})
