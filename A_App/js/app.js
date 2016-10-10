// create the module and name it scotchApp
    var MICEapp = angular.module('MICEapp', ['ngRoute']);
//config services
//
		MICEapp.factory("project",function(){
		        return {};
		});
//config routes

	 MICEapp.config(function($routeProvider) {
	        $routeProvider

	            // route for the home page
	            .when('/', {
	                templateUrl : 'pages/home.html',
	                controller  : 'mainController'
	            })

	            .when('/buildings', {
	                templateUrl : 'pages/buildings.html',
	                controller  : 'buildingController'
	            })

	       
	            .when('/clusters', {
	                templateUrl : 'pages/clusters.html',
	                controller  : 'clusterController'
	            })
	            
	            .when('/archetypes', {
	                templateUrl : 'pages/archetypes.html',
	                controller  : 'archetypeController'
	            })

	            .when('/profiles', {
	                templateUrl : 'pages/profiles.html',
	                controller  : 'profileController'
	            });
	    });




    // create the controller and inject Angular's $scope
    MICEapp.controller('mainController', function($scope, $http) {

        // create a message to display in our view
	    $scope.message = 'Everyone come and see how good I look!';


	    //     	//load data
	    // $http.get("../data/benchmarks.json")
	    // .then(function(response) {
	    //     $scope.benchmarks = response.data;
	    // });

	    // $http.get("../data/profile_data.json")
	    // .then(function(response) {
	    //     $scope.profiles = response.data;
	    // });

	    // $http.get("../data/profile_data.json")
	    // .then(function(response) {
	    //     $scope.profiles = response.data;
	    // });

	   
    });

      MICEapp.controller('buildingController', function($scope, $http, project) {
      	 // create a message to display in our view
	    $scope.message = 'building list';
	    $scope.project=project;
	    $scope.project.buildings=[];
	     $http.get("../data/input_data.json")
	    .success(function(response) {
	        $scope.project.buildings = response;
			console.log( $scope.project.buildings);
	    });
	   


      });

      MICEapp.controller('clusterController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'cluster list';
      });

      MICEapp.controller('archetypeController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'archetype list';
      });

        MICEapp.controller('profileController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'profile list';
      });




    