angular.module('orsApp.ors-error', []).component('orsError', {
    templateUrl: 'components/ors-error/ors-error.html',
    controller: ['$translate', 'orsMessagingService', function($translate, orsMessagingService) {
        let ctrl = this;
        ctrl.show = false;
        ctrl.$onInit = () => {};
        orsMessagingService.subscribeToMessage(function onNext(message) {
            console.info(message)
            if (message.color >= -1) {
                ctrl.show = true;
                ctrl.message = {};
                ctrl.message.translate = message.translate;
                switch (message.color) {
                    case -1:
                        ctrl.message.color = 'red';
                        break;
                    case 0:
                        ctrl.message.color = 'orange';
                        break;
                    case 1:
                        ctrl.message.color = 'blue';
                        break;
                    case 2:
                        ctrl.message.color = 'green';
                        break;
                    default:
                        break;
                }
            }
        });
    }],
    bindings: {}
});