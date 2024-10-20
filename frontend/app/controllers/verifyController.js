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
      $location.path("/login");
    }

    $scope.verify = function () {
      if (accessToken) {
        const token = $scope.token;

        $http
          .post(
            "http://localhost:3000/auth/2fa/verify",
            { token: token },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(function (response) {
            console.log("Verification successful:", response.data);
            // Đánh dấu là đã đăng nhập thành công
            $scope.isLoggedIn = true;
            $location.path("/products");
          })
          .catch(function (error) {
            $scope.errorMessage = "Verification failed: " + error.data;
            alert("Verification failed", error);
            sessionStorage.removeItem("accessToken");
          });
      } else {
        $location.path("/login");
      }
    };
  },
]);
