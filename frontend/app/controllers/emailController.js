angular.module("myApp").controller("verifyControllerEmail", [
  "$scope",
  "$location",
  "$http",
  function ($scope, $location, $http) {
    $scope.token = "";
    $scope.email = "";
    $scope.errorMessage = "";

    // Kiểm tra xem có accessToken trong sessionStorage không
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      $location.path("/login");
    }
    $scope.verify = function () {
      $scope.loading = true;
      // Gửi mã xác thực đến server
      $http
        .post(
          "http://localhost:3000/email/verifyCode",
          {
            token: $scope.token, // Truyền token đúng cách
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(function (response) {
          $scope.loading = false;
          console.log("success from Email:", response.data.message);
          $location.path("/products");
        })
        .catch(function (error) {
          console.error("Error email:", error);
          $scope.loading = false;

          $scope.errorMessage = "Invalid verification token. Please try again.";
        });
    };
  },
]);
