angular.module("myApp").controller("loginController", [
  "$scope",
  "$location",
  "authService",
  "$http",
  function ($scope, $location, authService, $http) {
    $scope.email = "admin@example.com";
    $scope.password = "admin@example.com";
    $scope.isLoggedIn = !!sessionStorage.getItem("accessToken");
    if ($scope.isLoggedIn) {
      $location.path("/products"); // Chuyển hướng về trang sản phẩm
    }
    $scope.login = function () {
      authService
        .login($scope.email, $scope.password)
        .then(function (response) {
          const { accessToken, user } = response.data;

          // Lưu access token vào sessionStorage
          sessionStorage.setItem("accessToken", accessToken);

          if (!user.twoFactorAuthEnabled) {
            $http
              .post(
                "http://localhost:3000/auth/2fa/generate",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`, // Sử dụng accessToken để xác thực
                  },
                }
              )
              .then(function () {
                // Chuyển hướng đến trang xác thực 2FA
                $location.path("/verify");
              })
              .catch(function (error) {
                console.error("Failed to generate 2FA code:", error);
                alert("Không thể tạo mã 2FA: " + error.data.message);
              });
          } else {
            // Nếu không, chuyển hướng đến trang sản phẩm
            $location.path("/products");
          }
        })
        .catch(function (error) {
          console.error("Login failed:", error);
          alert("Đăng nhập thất bại! Vui lòng kiểm tra thông tin.");
        });
    };
  },
]);
