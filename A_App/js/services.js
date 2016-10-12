MICEapp.factory("project",function(){
       var project={}
        return project;
});

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
								}

			function getProfiles(){
				return $http.get('../data/occ_profiles.json').then(function(response){
					      return response.data;
								    });
			}
}]);

	
	



