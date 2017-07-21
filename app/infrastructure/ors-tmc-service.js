angular.module('orsApp.tmc-service', []).factory('orsTmcService', ['$q', '$http', 'orsUtilsService', 'orsObjectsFactory', 'orsMapFactory', 'lists', 'orsNamespaces', 'ENV', ($q, $http, orsUtilsService, orsObjectsFactory, orsMapFactory, lists, orsNamespaces, ENV) => {
    
    let orsTmcService = {}; 

    orsTmcService.fetchTmc = (requestData) => {
        var url = ENV.routing;
        var canceller = $q.defer();
        var cancel = function(reason) {
            canceller.resolve(reason);
        };
        var promise = $http.get(url, {
            timeout: canceller.promise,
            params: requestData
        }).then(function(response) {
            return response.data;
        });
        return {
            promise: promise,
            cancel: cancel
        };
    };    
    
      
    
    return orsTmcService;
}]);
