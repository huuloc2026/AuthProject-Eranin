angular.module("myApp").factory("authInterceptor", [
  "$q",
  "$location",
  "$window",
  function ($q, $location, $window) {
    return {
      request: function (config) {
        const token = $window.sessionStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Set the header
        }

        return config;
      },
      responseError: function (response) {
        return $q.reject(response);
      },
    };
  },
]);
