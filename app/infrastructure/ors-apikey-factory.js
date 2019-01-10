angular.module("orsApp.apikey-factory", []).factory("orsApikeyFactory", [
  "$timeout",
  "$interval",
  "$injector",
  ($timeout, $interval, $injector) => {
    let orsApikeyFactory = {};
    /**
     * Retrieves API Key
     * @return {string} weathercheck - current api key
     */
    orsApikeyFactory.getApiKey = () => {
      return orsApikeyFactory.apiKey;
    };
    /**
     * Sets API Key
     * @param {string} key - current api key
     */
    orsApikeyFactory.setApiKey = key => {
      orsApikeyFactory.apiKey = key;
    };
    // this is where a new api key is called every 12 hours
    orsApikeyFactory.setApiKeyInterval = () => {
      const httpService = $injector.get("$http");
      $interval(function() {
        return httpService.get("weathercheck.txt").then(
          function(response) {
            orsApikeyFactory.setApiKey(response.data);
          },
          function(errorResponse) {}
        );
      }, 43200000);
    };
    return orsApikeyFactory;
  }
]);
