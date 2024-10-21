angular.module("myApp", ["ngRoute"]).config([
  "$routeProvider",
  "$httpProvider",
  function ($routeProvider) {
    // Cấu hình các route
    $routeProvider
      .when("/login", {
        templateUrl: "app/views/login.html",
        controller: "loginController",
      })
      .when("/register", {
        templateUrl: "app/views/register.html",
        controller: "registerController",
      })
      .when("/products", {
        templateUrl: "app/views/productList.html",
        controller: "productController",
      })
      .when("/mfa", {
        templateUrl: "app/views/mfaInterface.html",
        controller: "verify2FAController",
      })
      .when("/verify", {
        templateUrl: "app/views/verifyQR.html",
        controller: "verifyControllerQR",
      })
      .when("/emailVerify", {
        templateUrl: "app/views/emailInterface.html",
        controller: "verifyControllerEmail",
      })
      .otherwise({
        redirectTo: "/login",
      });
  },
]);
