/**
 * 
 */
var app = angular.module('myApp', ['ajoslin.promise-tracker'])
  .controller('giftChecker', function ($scope, $http) {
    
	$scope.response = [];
	
	$scope.getData = function() {
        
        
        $http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero")
        .success(function(data) {
			$scope.data = data;
			$scope.name = data.name;
			$scope.salutation = data.salutation;
			$scope.greeting = data.greeting;
			
		  })
		  .error(function (data) {
			$scope.data = "Request failed";
		  });
    };

		$scope.code = "";
		$scope.clear = 0;

	$scope.reset = function() {
		$scope.code = "";
		$scope.message = "";
		$scope.clear = 0;
	}

	var dateToCheck = new Date(2015,5,23,5,54,00,00);
    var alreadyWon = 0;
	var clearMessage;
	
    // Form submit handler.
    $scope.submit = function() {
     	var foundPrize = 0;
	 	var prizes;
		var timenow = Date.now();

		$http.get("../php/getprizes.php")
			.success(function(data) {

				prizes = data;

				for(var i = 0; i < prizes.length; i++) {
					if(new Date(prizes[i].date) < timenow && prizes[i].prizes>0){
						won(prizes[i]);
						foundPrize = 1;
						break;
					}
					}

					if(foundPrize == 0) won();
				})
			.error(function (data) {
				$scope.data = "Request failed";
			});
    };



	var won = function(prize) {
		if(prize!=null){
			console.log(prize);
			$scope.message = prize.message;

			var req = {
				method: 'POST',
				url: '../php/updateprizes.php ',
				headers: {
					"Content-Type": "application/json"
				},
				data: { id: prize.id }
			}

			$http(req).
				success(function(data, status, headers, config) {
					console.log(data);
				}).
				error(function(data, status, headers, config) {
					console.log(data);
				});



		}else
			$scope.message = "Κερδίσατε ένα γλυφιτζούρι!";

		$scope.clear = 1;
		};


  });
  
  
  
