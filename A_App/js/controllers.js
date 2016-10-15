  MICEapp.controller('rootController', function($scope,myProject) {
      	 // create a message to display in our view
	    $scope.rootproject = {};
	    $scope.rootproject.message='MICE';
	    $scope.rootproject.edit=false;
	    myProject.put('ProjectName',$scope.rootproject.message)
	     // set defualt project title
	    $scope.editProjectName = function(){
		    $scope.rootproject.edit =true;
			};
        $scope.saveProjectName = function(){
		    $scope.rootproject.edit =false
		 	myProject.put('ProjectName',$scope.rootproject.message)
			};
      });





    // create the controller and inject Angular's $scope
    MICEapp.controller('mainController', ["$rootScope","$scope","myProject", function($rootScope,$scope,myProject) {
    	$scope.rootproject.message="updated";
        // create a message to display in our view
	    $scope.message = 'Everyone come and see how good I look!';
	  
    }]);

    MICEapp.controller('buildingController', ["$rootScope","$scope", "myProject", function($rootScope,$scope, myProject) {
      	 // create a message to display in our view
	    $scope.message = 'building list'; 
	     $rootScope.globalmessage ="updated this from buidling lsit";
	   	
	   	var template_building =
					{   "id":"",
						"name":"",
						"cluster":"",
						"quantity":0,
						"benchmark_group":"",
						"benchmark":"",
						"fuel":"",
						"generation":""
					};	
		
		
		  // (!myProject.get("Benchmarks") ? $scope.benchmarks=[]  : $scope.benchmakrs=myProject.get("Benchmarks")); 
		  // (!myProject.get("Archetypes") ? $scope.archetypes=[]  : $scope.clusters=myProject.get("Archetypes"));
		   (!myProject.get("Clusters") ? $scope.clusters=[]  : $scope.clusters=myProject.get("Clusters"));
		   (!myProject.get("Buildings") ? $scope.buildings=[]  : $scope.buildings=myProject.get("Buildings"));
			
		   $scope.archetypes=myProject.get("Archetypes");
		   $scope.benchmarks=myProject.get("Benchmarks")
		   $scope.buildings=myProject.get("Buildings")

		   $scope.archetypeslist = _.pluck($scope.archetypes,'name');
		   $scope.clusterslist = _.pluck($scope.clusters,'name');
		   $scope.benchmark_grouplist = _.uniq(_.pluck($scope.benchmarks,'Benchmark'));
			
		
		$scope.addBuilding = function(){
			template_building.id=Date.now();
			$scope.buildings.push(angular.copy(template_building));
    	}
		$scope.removebuilding = function(index){$scope.buildings.splice(index, 1)};

		$scope.DropDownChanged = function(data,selected){alert(data)}

		$scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("Buildings",$scope.buildings) //console.log("location changing to:" + next); 
        	//myProject.put("Benchmarks",$scope.benchmarks)
        });
		
      }]);



      MICEapp.controller('archetypeController', ["$rootScope","$scope","myProject",function($rootScope, $scope, myProject) {
      	
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
	
		
         (!myProject.get("Benchmarks") ? $scope.benchmarks=[]  : $scope.benchmarks=myProject.get("Benchmarks")); 
		 (!myProject.get("Archetypes") ? $scope.archetypes=[]  : $scope.archetypes=myProject.get("Archetypes"));
		 (!myProject.get("Profiles") ? $scope.profiles=[]  : $scope.profiles=myProject.get("Profiles"));

		  $scope.benchmark_grouplist = _.uniq(_.pluck($scope.benchmarks,'Benchmark'));

    	$scope.addArchetype = function(){
    		template_archetype.id=Date.now();
    		$scope.archetypes.push(angular.copy(template_archetype));
    	}
		$scope.removeArchetype = function(index){$scope.archetypes.splice(index, 1)};
	   
	    $scope.message = 'archetype list';

	     $scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("Archetypes",$scope.archetypes) //console.log("location changing to:" + next); 
      		});
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
		(!myProject.get("Clusters") ? $scope.clusters=[]  : $scope.clusters=myProject.get("Clusters"));

		//$scope.clusters=[];

		//  	$scope.$on('myProject.benchmarks.updated', function(event, args) {
		// 	myProject.log('a:Benchmarks loaded');
		// 	$scope.benchmarks=myProject.get("Benchmarks")//[];
		// });

  //   	$scope.$on('myProject.profiles.updated', function(event, args) {
		// 	myProject.log('a:Profiles loaded');
		// 	$scope.profiles=myProject.get("Profiles")//[];;
		// });



	    $scope.addCluster = function(){
			template_cluster.id=Date.now();
			$scope.clusters.push(angular.copy(template_cluster));
    	}
		$scope.removeCluster = function(index){$scope.archetypes.splice(index, 1)};


		$scope.$on("$locationChangeStart", function(event, next, current) { 
        	myProject.put("Clusters",$scope.clusters) //console.log("location changing to:" + next); 
        //	myProject.put("Benchmarks",$scope.benchmarks)

        });

      }]);




       MICEapp.controller('logController', ['$scope','myProject',function($scope,myProject) {
	    $scope.message = myProject.get("log");
	    console.log(myProject.all())
      }]);

      MICEapp.controller('profileController', function($scope, $http) {
      	 // create a message to display in our view
	    $scope.message = 'profile list';
      });


       MICEapp.controller('fileController', ['$scope','FileSaver','Blob','myProject', function($scope,FileSaver,Blob,myProject) {
      	 // create a message to display in our view
	    $scope.message = 'file operations list';
	    
	    $scope.saveProject = function (){
	    	myProject.log('Project saved')
	    	$scope.data = myProject.all();
	    	var savename = prompt("Save file name", "output");
           var data = new Blob([angular.toJson($scope.data)], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(data, savename+'.json');
	    };

	    $scope.uploadFile = function(x){
	    	console.log("hkljlkjl")
	    		 console.log(x);
	    	}

	    $scope.file_changed = function(element) {
		     	$scope.$apply(function(scope) {
		         var photofile = element.files[0];
		         var reader = new FileReader();
		         reader.onload = function(e) {
		            // handle onload
		         
		            $scope.$apply(function(){
		            	 $scope.thisProject = myProject.file(JSON.parse(reader.result));
		            	 $scope.rootproject.message=thisProject.projectName
		            })
		           
		         };
		         reader.readAsText(photofile);
		     });
		};


      }]);




