angular
  .module("myApp", ["ngRoute"])
  .controller("MainController", [
    "$scope",
    function ($scope) {
      // Check login status on page load
      $scope.isLoggedIn = !!localStorage.getItem("shortToken");
    },
  ])

  .config(function ($routeProvider) {
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
      .when("/verify", {
        templateUrl: "app/views/verify.html",
        controller: "verifyController",
      })
      .otherwise({
        redirectTo: "/login",
      });
  });
