MICEapp.service("myProject",["$rootScope","dataService",function($rootScope,dataService){
       
       var myProject={};
       myProject.log=[];
     
        //GET BENCHMARKS, PROFILES AND STATIC DATA LISTS, INCLUDING CONFIG.
        dataService.getBenchmarks().then(function(d){ 
        	myProject.log.push("service:benchmarks loaded");
        	myProject.Benchmarks=d;
        	$rootScope.$broadcast("myProject.benchmarks.updated")});
        ;
        dataService.getProfiles().then(function(d){
        	myProject.log.push("service:profiles loaded");
        	myProject.Profiles=d;
        	$rootScope.$broadcast("myProject.profiles.updated")});
       
       this.log = function(message){myProject.log.push(message);console.log("Log:" +message)}

       this.all = function(){return myProject};

       this.put = function(key,value){
			var oldValue = this.get(key);
       		 myProject[key] = value;
		        $rootScope.$broadcast(
		        "myProject.item.updated",
		            { key: key, newValue: value, oldValue: oldValue });
		       };

       this.remove = function(key){
        var value = this.get(key);
        delete myProject[key];
		        $rootScope.$broadcast(
		            "myProject.item.removed", { key: key, value: value });
			    };

	    this.get = function(key){
	      return myProject[key] || null;
	    };
}]);

MICEapp.factory("dataService",['$http',function($http){

			var service = {
				benchmarks:[],
				getBenchmarks:getBenchmarks,
				getProfiles:getProfiles
			};
			
			return service;
    
		    function getBenchmarks(){
					return $http.get('../data/benchmarks.json').then(function(response){
					      return response.data;
								    });
			};

			function getProfiles(){
				return $http.get('../data/occ_profiles.json').then(function(response){
					      return response.data;
								    });
			};


}]);

	
	



