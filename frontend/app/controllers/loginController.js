angular.module("myApp").controller("loginController", [
  "$scope",
  "$location",
  "authService",
  "$http",
  function ($scope, $location, authService, $http) {
    // Kiểm tra xem đã có accessToken trong sessionStorage chưa
    const accessToken = sessionStorage.getItem("accessToken");
    $scope.isLoggedIn = !accessToken ? false : true;

    if (accessToken) {
      $location.path("/products");
    }

    $scope.email = "thelegendstreet@gmail.com";
    $scope.password = "thelegendstreet@gmail.com";

    $scope.login = function () {
      authService
        .login($scope.email, $scope.password)
        .then(function (response) {
          const { accessToken, refreshToken, user } = response.data;
          // console.log(refreshToken);
          $location.path("/products");

          // Kiểm tra xem có bật xác thực 2FA không
          if (user.twoFactorAuthEnabled) {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);

            $scope.isLoggedIn = true;
          } else {
            return $http
              .post(
                "http://localhost:3000/auth/2fa/generate",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                    "X-Refresh-Token": refreshToken,
                  },
                }
              )
              .then(function () {
                sessionStorage.setItem("accessToken", accessToken);
                sessionStorage.setItem("refreshToken", refreshToken);
                $location.path("/mfa");
              });
          }
        })
        .catch(function (error) {
          alert("Đăng nhập thất bại! Vui lòng kiểm tra thông tin.");
          sessionStorage.removeItem("accessToken");
        });
    };
  },
]);
