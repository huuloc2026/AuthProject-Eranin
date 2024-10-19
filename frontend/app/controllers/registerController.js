angular.module("myApp").controller("registerController", [
  "$scope",
  "$location",
  "authService",

  function ($scope, $location, authService) {
    $scope.name = "hello1";
    $scope.email = "huuloc2026@gmail.com";
    $scope.password = "huuloc2026@gmail.com";
    $scope.confirmPassword = "huuloc2026@gmail.com";
    $scope.isLoggedIn = !!sessionStorage.getItem("accessToken");
    if ($scope.isLoggedIn) {
      $location.path("/products"); // Chuyển hướng về trang sản phẩm
    }
    $scope.register = function () {
      authService
        .register(
          $scope.name,
          $scope.email,
          $scope.password,
          $scope.confirmPassword
        )
        .then(function (response) {
          alert("Đăng ký thành công!");
          $location.path("/login");
        })
        .catch(function (error) {
          const errormessage = error.data.message;
          alert(errormessage);
        });
    };
  },
]);
