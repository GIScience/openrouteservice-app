angular.module('orsApp.ors-share', [])
    .component('orsShare', {
        templateUrl: 'components/ors-share/ors-share.html',
        bindings: {
            shareUrl: '<',
        },
        controller: ['orsUtilsService', '$location', function(orsUtilsService, $location) {
            let ctrl = this;
            ctrl.shortenLinkBool = false;
            if (ctrl.shareUrl) ctrl.linkText = ctrl.shareUrl;
            else ctrl.linkText = $location.absUrl();
            ctrl.shortenLink = () => {
                if (ctrl.shortenLinkBool === true) {
                    const request = orsUtilsService.getShortenlink(ctrl.linkText);
                    request.promise.then(function(response) {
                        if (response.data.url) ctrl.linkText = response.data.url;
                    }, function(response) {
                        console.error(response);
                        ctrl.linkText = $location.absUrl();
                    });
                } else {
                    ctrl.linkText = $location.absUrl();
                }
            };
        }]
    });