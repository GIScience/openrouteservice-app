angular
  .module("orsApp.ors-filters", [])
  .filter("trusted", function($sce) {
    return function(html) {
      return $sce.trustAsHtml(html);
    };
  })
  .filter("duration", () => {
    return input => {
      const hours = Math.floor(input / 3600);
      input %= 3600;
      const minutes = Math.floor(input / 60);
      const seconds = input % 60;
      if (hours < 1 && minutes < 1) {
        return "<b>" + "< 1" + "</b>" + " min";
      } else {
        let HHMM = [];
        if (hours.toString().length === 1) HHMM.push("0" + hours);
        else HHMM.push(hours);
        if (minutes.toString().length === 1) HHMM.push("0" + minutes);
        else HHMM.push(minutes);
        return "<b>" + HHMM.join(":") + "</b>";
      }
    };
  })
  .filter("distance", [
    "orsSettingsFactory",
    orsSettingsFactory => {
      function distance(input, round) {
        input = parseInt(input);
        let units = orsSettingsFactory.getUserOptions().units;
        if (units === "km") {
          units = " m";
          if (Math.abs(input) >= 1000) {
            if (round) {
              input = (input / 1000).toFixed();
            } else {
              if (input >= 1000000) input = (input / 1000).toFixed();
              else input = (input / 1000).toFixed(1);
            }
            units = " km";
          } else {
            input = input.toFixed();
          }
        } else if (units === "mi") {
          /** convert meters to miles */
          if (round) {
            input = (input * 0.000621371192).toFixed();
          } else {
            input = (input * 0.000621371192).toFixed(1);
          }
          if (input < 0.5 && input > 0.2) {
            /** yards */
            input = (input * 1760).toFixed();
            units = " yd";
          } else if (input <= 0.1) {
            /** feet */
            input = (input * 1760 * 3).toFixed();
            units = " ft";
          }
        }
        input = "<b>" + input + "</b>" + units;
        return input;
      }
      distance.$stateful = true;
      return distance;
    }
  ])
  .filter("area", [
    "orsSettingsFactory",
    orsSettingsFactory => {
      function distance(input, round) {
        input = parseInt(input);
        let units = orsSettingsFactory.getUserOptions().units;
        if (units === "km") {
          input = (input / 1000000).toFixed(2);
        } else if (units === "mi") {
          input = (input / 2589988.11034).toFixed(2);
        }
        input = input + " " + units + "<sup>2</sup>";
        return input;
      }
      distance.$stateful = true;
      return distance;
    }
  ])
  .filter("contains", function() {
    return function(array, needle) {
      return array.indexOf(needle) >= 0;
    };
  })
  .filter("round", () => {
    return (input, units = "") => {
      return "<b>" + input.toFixed(1) + "</b>" + units;
    };
  })
  .filter("capitalize", () => {
    return str => {
      str = str.split(" ");
      for (let i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }
      return str.join(" ");
    };
  });
