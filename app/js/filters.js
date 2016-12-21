angular.module('orsApp.ors-filters', []).filter('duration', () => {
    return (input) => {
        let date = new Date(input);
        let hours = date.getUTCHours();
        hours = hours.toString().length == 1 ? ("0" + hours) : hours;
        let minutes = date.getUTCMinutes();
        minutes = minutes.toString().length == 1 ? ("0" + minutes) : minutes;
        date = hours + ":" + minutes;
        return date;
    };
}).filter('distance', ['orsSettingsFactory', (orsSettingsFactory) => {
    function distance(input) {
        input = parseInt(input);
        let units = orsSettingsFactory.getUserOptions().units;
        if (units == 'km') {
            units = 'm';
            if (input > 1000) {
                input = (input / 1000).toFixed(2);
                units = 'km';
            } else {
                input = input.toFixed();
            }
        } else if (units == 'mi') {
            /** convert meters to miles */
            input = (input * 0.000621371192).toFixed(2);
            console.log(input)
            if (input < 0.5 && input > 0.2) {
                /** yards */
                input = (input * 1760).toFixed();
                units = 'yd';
            }
            else if (input <= 0.1) {
                /** feet */
                input = (input * 1760 * 3).toFixed();
                units = 'ft';
            }
        }
        input = input + units;
        return input;
    }
    distance.$stateful = true;
    return distance;
}]);