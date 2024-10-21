angular.module("myApp").controller("productController", [
  "$scope",
  "$location",
  "authService",
  function ($scope, $location, authService) {
    const accessToken = sessionStorage.getItem("accessToken");

    $scope.isLoggedIn = !!accessToken;
    $scope.isTokenExpired = false;
    $scope.products = [];
    $scope.errorMessage = "";

    const loadProducts = function () {
      if ($scope.isLoggedIn) {
        authService
          .getProducts()
          .then(function (response) {
            if (response.data && response.data.length > 0) {
              $scope.products = response.data;
              $scope.errorMessage = "";
            } else {
              $scope.errorMessage = "Không có sản phẩm nào.";
            }
          })
          .catch(function (error) {
            $scope.isTokenExpired = true; // Đánh dấu token đã hết hạn
            console.log("Token hết hạn");
          });
      } else {
        sessionStorage.removeItem("accessToken");
        // $location.path("/login");
      }
    };

    // Hàm để xử lý khi token hết hạn
    $scope.handleTokenExpiration = function () {
      authService
        .refreshToken()
        .then(function (response) {
          alert("You got access token!!!");
          sessionStorage.setItem("accessToken", response.data.accessToken);
          $scope.isTokenExpired = false;
          loadProducts(); // Tải lại danh sách sản phẩm
        })
        .catch(function (error) {
          console.error("Lỗi khi làm mới token:", error);

          $location.path("/login"); // Chuyển hướng về trang đăng nhập nếu có lỗi
        });
    };

    loadProducts();

    $scope.logout = function () {
      sessionStorage.removeItem("accessToken");
      $scope.isLoggedIn = false;
      $scope.products = [];
      $location.path("/login");
    };
  },
]);
