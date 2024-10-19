angular.module("myApp").service("authService", function ($http) {
  this.login = function (email, password) {
    return $http.post("http://localhost:3000/auth/login", {
      email: email,
      password: password,
    });
  };

  this.register = function (name, email, password, confirmPassword) {
    return $http.post("http://localhost:3000/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
  };

  this.getProducts = function () {
    const token = sessionStorage.getItem("accessToken"); // Sử dụng sessionStorage

    // Đảm bảo token tồn tại trước khi gửi yêu cầu
    if (!token) {
      console.error("No token found in sessionStorage");
      return Promise.reject("No token found");
    }

    // Đặt headers cho yêu cầu
    const headers = {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    };

    return $http.get("http://localhost:3000/products/listvoucher", { headers });
  };
});
