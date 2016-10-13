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

      MICEapp.controller('buildingController', function($scope, $http, project,dataService) {
      	 // create a message to display in our view
	    $scope.message = 'building list';
	   
	    $scope.project=project;
	    $scope.benchmarks=[];
	    $scope.profiles=[];
	    $scope.b ='sde';

	    dataService.getBenchmarks().then(
	    	function(d){$scope.benchmarks=d});

	    dataService.getProfiles().then(
	    	function(d){$scope.profiles=d});
	    
	   
	    


	    // bench.getBenchmarks= function(){
	    // 	benchmarksService.getBenchmarks()
	    // 	.success (function(benchmarks){
	    // 		 $scope.benchmarks = benchmarks
	    // 	})
	    // }

	    // bench.getBenchmarks()
	    
	    
	    //console.log($scope.project);
	    
	    $scope.project.buildings=[];
	    $http.get("../data/input_data.json")
	    .success(function(response) {
	        $scope.project.buildings = response;
			//console.log( $scope.project.buildings);
	    });
	   


      });

      MICEapp.controller('clusterController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'cluster list';
      });


      MICEapp.controller('archetypeController', function($scope, $http, project,dataService) {
      	 // create a message to display in our view
      	
    	$scope.message = 'archetype list';
	   


	  

	    var template_archetype =
					{   "id":"",
						"name":"",
						"new":true,
						"benchmark_group":"",
						"occ_profile":"",
						"GIA":"",
						"PV":"",
						"pitch":""
					};	

        console.log(project)
		$scope.project=project			
        $scope.project.archetypes=[];
	   	$scope.benchmarks=[];
	    $scope.profiles=[];
	  

    	$scope.addArchetype = function(){
    		template_archetype.id=Date.now();
    		$scope.project.archetypes.push(angular.copy(template_archetype));
    	}
		$scope.removeArchetype = function(index){$scope.project.archetypes.splice(index, 1)};

	    dataService.getBenchmarks().then(
	    	function(d){$scope.benchmarks=d});

	    dataService.getProfiles().then(
	    	function(d){$scope.profiles=d});
	    
	   
	    $scope.message = 'archetype list';


	     $scope.$on("$locationChangeStart", function(event, next, current) { 
        project.archetypes = $scope.project.archetypes //console.log("location changing to:" + next); 
        console.log(project)
      });





      });


      MICEapp.controller('profileController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'profile list';
      });


