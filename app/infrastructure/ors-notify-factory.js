angular.module('orsApp').factory('notifyingFactory', function($rootScope) {
    return {
        subscribePanel: function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event-map', callback);
            //scope.$on('$destroy', handler);
        },
        notifyMap: function() {
            $rootScope.$emit('notifying-service-event-map');
        },
        subscribeMap: function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event-panel', callback);
            //scope.$on('$destroy', handler);
        },
        notifyPanel: function() {
            $rootScope.$emit('notifying-service-event-panel');
        }
    };
});