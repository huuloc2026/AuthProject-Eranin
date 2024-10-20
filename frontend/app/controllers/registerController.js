angular.module("myApp").controller("registerController", [
  "$scope",
  "$location",
  "authService",

  function ($scope, $location, authService) {
    const accessToken = sessionStorage.getItem("accessToken");

    // Kiểm tra trạng thái đăng nhập
    $scope.isLoggedIn = !!accessToken;

    // Nếu đã đăng nhập, chuyển hướng đến trang sản phẩm
    if ($scope.isLoggedIn) {
      $location.path("/products");
    }

    // Khởi tạo các biến đăng ký
    $scope.name = "huuloc2026@gmail.com";
    $scope.email = "huuloc2026@gmail.com";
    $scope.password = "huuloc2026@gmail.com";
    $scope.confirmPassword = "huuloc2026@gmail.com";

    $scope.register = function () {
      authService
        .register(
          $scope.name,
          $scope.email,
          $scope.password,
          $scope.confirmPassword
        )
        .then(function (response) {
          alert("Đăng ký thành công!", response);
          $location.path("/login");
        })
        .catch(function (error) {
          const errormessage = error.data
            ? error.data.message
            : "Đăng ký thất bại!";
          alert(errormessage);
        });
    };
  },
]);
