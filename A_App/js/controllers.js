  
    // create the controller and inject Angular's $scope
    MICEapp.controller('mainController', ["$rootScope","$scope","myProject", function($rootScope,$scope,myProject) {

        // create a message to display in our view
	    $scope.message = 'Everyone come and see how good I look!';
	   
    }]);

      MICEapp.controller('buildingController', ["$rootScope","$scope", "myProject", function($rootScope,$scope, myProject) {
      	 // create a message to display in our view
	    $scope.message = 'building list';
	   	var template_building =
					{   "id":"",
						"name":"",
						"cluster":"",
						"quantity":0,
						"benchmark":"",
						"fuel":"",
						"generation":""
					};	


	   (!myProject.get("archetypes") ? $scope.archetypes=[]  : $scope.clusters=myProject.get("archetypes"));
	   (!myProject.get("clusters") ? $scope.clusters=[]  : $scope.clusters=myProject.get("clusters"));
	   (!myProject.get("buildings") ? $scope.buildings=[]  : $scope.buildings=myProject.get("buildings"));
	

		$scope.addBuilding = function(){
			template_building.id=Date.now();
			$scope.buildings.push(angular.copy(template_building));
    	}
		$scope.removebuilding = function(index){$scope.buildings.splice(index, 1)};


		$scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("buildings",$scope.buildings) //console.log("location changing to:" + next); 
        });

	  
      }]);

      
      MICEapp.controller('logController', ['$scope','myProject',function($scope,myProject) {
	    $scope.message = myProject.get("log");
	    console.log(myProject.all())
      }]);


      MICEapp.controller('clusterController', ["$scope","myProject",function($scope, myProject) {
      	var template_cluster =
					{   "id":"",
						"name":"",
						"postcode":"",
						"active":true,
						"dh_length":"",
						"PV":"",
						"EV":"",
						"Battery":""
					};	
	    $scope.message = 'cluster list';
		(!myProject.get("clusters") ? $scope.clusters=[]  : $scope.clusters=myProject.get("clusters"));

		//$scope.clusters=[];


	    $scope.addCluster = function(){
			template_cluster.id=Date.now();
			$scope.clusters.push(angular.copy(template_cluster));
    	}
		$scope.removeCluster = function(index){$scope.archetypes.splice(index, 1)};


		$scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("clusters",$scope.clusters) //console.log("location changing to:" + next); 
        });

      }]);


      MICEapp.controller('archetypeController', ["$scope","$rootScope","myProject","dataService",function($rootScope, $scope, myProject,dataService) {
      	
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

    	$scope.message = 'archetype list';


		(!myProject.get("archetypes") ? $scope.archetypes=[]  : $scope.archetypes=myProject.get("archetypes"))
         
       	//add project wide data.. once it is loaded..
       	
       	$scope.$on('myProject.benchmarks.updated', function(event, args) {
			myProject.log('Benchmarks loaded');
			$scope.benchmarks=myProject.get("Benchmarks")//[];
		});

    	$scope.$on('myProject.profiles.updated', function(event, args) {
			myProject.log('Profiles loaded');
			$scope.profiles=myProject.get("Profiles")//[];;
		});
        

    	$scope.addArchetype = function(){
    		template_archetype.id=Date.now();
    		$scope.archetypes.push(angular.copy(template_archetype));
    	}
		$scope.removeArchetype = function(index){$scope.archetypes.splice(index, 1)};
	   
	    $scope.message = 'archetype list';

	     $scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("archetypes",$scope.archetypes) //console.log("location changing to:" + next); 
        
      });





      }]);


      MICEapp.controller('profileController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'profile list';
      });


       MICEapp.controller('fileController', ['$scope','FileSaver','Blob','myProject', function($scope,FileSaver,Blob,myProject) {
      	 // create a message to display in our view
	    $scope.message = 'file operations list';
	    $scope.data = myProject.all();
	    console.log($scope.data)
	    $scope.saveProject = function (){
           var data = new Blob([angular.toJson($scope.data)], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(data, 'output.json');
	    }

      }]);
