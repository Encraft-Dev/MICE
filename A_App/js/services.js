MICEapp.service("myProject",["$rootScope","dataService","$q",function($rootScope,dataService,$q){
       //inital datalist to load at app start
       


       var myProject={};
	       myProject.log=[];
	       myProject.Benchmarks=[];
	       myProject.Profiles=[];
	       myProject.log.push(Date()+":Project Opened")
	       myProject.status = {"opened":Date()}



     	var qList = []

	     qList.push(dataService.benchmarks);
	     qList.push(dataService.profiles);

     
     
	     //set up data before loading any pages
	    this.promise = function(){
	     	$q.all(qList).then(function(q){
		     	myProject.Benchmarks=q[0];
		     	myProject.Profiles=q[1];
		     	myProject.log.push(Date()+":Baseline Data loaded");
		     	$rootScope.$broadcast("myProject.data.loaded");		
	     	});
		}
    
		       
       this.log = function(message){myProject.log.push(Date()+ ":"+ message);console.log("Log:" +message)}
       //return all data
       this.all = function(){return myProject};
       //replace contents with saved
       this.file = function(data){myProject=data; return myProject};
       //update project with data
       this.put = function(key,value){
			var oldValue = this.get(key);
       		 myProject[key] = value;
		        $rootScope.$broadcast(
		        "myProject.item.updated",
		            { key: key, newValue: value, oldValue: oldValue });
		       };
		//remove data from project
       this.remove = function(key){
        var value = this.get(key);
        delete myProject[key];
		        $rootScope.$broadcast(
		            "myProject.item.removed", { key: key, value: value });
			    };
		//retreive data
	    this.get = function(key){
	      return myProject[key] || [];
	    };
}]);



MICEapp.factory("dataService",['$http',function($http){

			var service = {
				benchmarks:getData('benchmarks'),
				profiles: getData('occ_profiles'),
				getBenchmarks:getBenchmarks,//not needed
				getProfiles:getProfiles // not needed
			};
			
			return service;
    
    		function getData(data){
    				return $http.get('../data/'+data+'.json').then(function(response){
					      		return  response.data;
								    });
    		}


    		// not needed now
		    function getBenchmarks(){
					return $http.get('../data/benchmarks.json').then(function(response){
					      return response.data;
								    });
			};
			// not needed now
			function getProfiles(){
				return $http.get('../data/occ_profiles.json').then(function(response){
					      return response.data;
								    });
			};
}]);

	
	



