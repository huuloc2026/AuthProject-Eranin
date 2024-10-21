angular.module("myApp").controller("verify2FAController", [
  "$scope",
  "$location",
  "$http",
  function ($scope, $location, $http) {
    $scope.authMethod = null; // Khởi tạo phương thức xác thực

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      $location.path("/login");
    }

    $scope.updateForm = function () {};

    $scope.continue = function () {
      console.log("Selected auth method:", $scope.authMethod);
      if ($scope.authMethod === "qr") {
        $location.path("/verify"); // Chuyển hướng đến trang xác thực QR Code
      } else if ($scope.authMethod === "email") {
        $http
          .get("http://localhost:3000/email/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(function (response) {
            const userEmail = response.data.email;

            sendRecoveryEmail(userEmail);
          })
          .catch(function (error) {
            console.error("Error fetching email:", error);
            alert("Could not fetch user email. Please log in again.");
            $location.path("/login");
          });
      }
    };
    function sendRecoveryEmail(email) {
      // Bước 3: Gửi yêu cầu POST khôi phục mật khẩu
      $http
        .post(
          "http://localhost:3000/email/forgetpassword",
          { email },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(function (response) {
          $location.path("/emailVerify");
          alert(
            "A Code verification email has been sent to your email address."
          );
        })
        .catch(function (error) {
          console.error("Error sending email:", error);
          alert(
            error.data.message || "An error occurred while sending the email."
          );
        });
    }
  },
]);
