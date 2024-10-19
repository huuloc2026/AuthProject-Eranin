angular.module("myApp").controller("productController", [
  "$scope",
  "$location", // Thêm $location vào danh sách phụ thuộc
  "authService",
  function ($scope, $location, authService) {
    $scope.isLoggedIn = !!sessionStorage.getItem("accessToken");
    // Sử dụng sessionStorage
    $scope.products = []; // Khởi tạo biến products

    // Hàm để lấy danh sách sản phẩm
    $scope.loadProducts = function () {
      if ($scope.isLoggedIn) {
        authService
          .getProducts()
          .then(function (response) {
            $scope.products = response.data; // Gán dữ liệu vào biến products
          })
          .catch(function (error) {
            console.error("Failed to load products:", error);
          });
      } else {
        // Nếu không đăng nhập, chuyển hướng về trang đăng nhập
        $scope.isLoggedIn = false;
      }
    };

    // Gọi hàm loadProducts khi controller được khởi tạo
    $scope.loadProducts();

    $scope.logout = function () {
      console.log("Đăng xuất");

      $scope.products = []; // Dọn dẹp danh sách sản phẩm
      sessionStorage.removeItem("accessToken"); // Xóa access token từ sessionStorage
      // Nếu có refresh token trong cookies, có thể xóa hoặc không tùy thuộc vào logic bạn muốn
      // document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Xóa cookie refreshToken

      $scope.isLoggedIn = false; // Cập nhật trạng thái đăng nhập
      // Chuyển hướng về trang đăng nhập
      $location.path("/login"); // Đảm bảo rằng bạn có định nghĩa cho route /login
    };
  },
]);
