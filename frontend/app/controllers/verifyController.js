angular.module("myApp").controller("verifyController", [
  "$scope",
  "$location",
  "$http",
  function ($scope, $location, $http) {
    $scope.token = "";
    $scope.errorMessage = "";

    // Kiểm tra xem có accessToken trong sessionStorage không
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      $location.path("/login");
    }

    $scope.verify = function () {
      if (accessToken) {
        const token = $scope.token; // Nhận mã OTP từ input

        $http
          .post(
            "http://localhost:3000/auth/2fa/verify",
            { token: token },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`, // Sử dụng accessToken để xác thực
              },
            }
          )
          .then(function (response) {
            console.log("Verification successful:", response.data);
            // Chuyển hướng đến trang sản phẩm
            $location.path("/products");
          })
          .catch(function (error) {
            $scope.errorMessage = "Verification failed: " + error.data.message;
            console.error("Verification failed:", error);
          });
      } else {
        $location.path("/login");
      }
    };
  },
]);
