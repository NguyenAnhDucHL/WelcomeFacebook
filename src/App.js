import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  useEffect(() => {
    console.log("Initializing Facebook SDK...");
    // Khởi tạo Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1131033075055597",
        cookie: true,
        xfbml: true,
        version: "v17.0", // Sử dụng phiên bản Facebook API mới nhất
      });

      // Kiểm tra trạng thái đăng nhập
      window.FB.getLoginStatus(function (response) {
        console.log("Login status response:", response);
        statusChangeCallback(response);
      });
    };
  }, []);

  // Hàm xử lý trạng thái đăng nhập
  const statusChangeCallback = (response) => {
    if (response.status === "connected") {
      console.log("User is connected:", response);
      // Lấy thông tin người dùng
      window.FB.api("/me", { fields: "name" }, (user) => {
        console.log("User data from Facebook API:", user);
        setUserName(user.name);
        localStorage.setItem("userName", user.name); // Lưu tên vào localStorage
        // Hiển thị thông báo chào mừng
        toast.success(`Chào mừng bạn ${user.name} đến thăm!`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    } else {
      console.warn("User is not connected or needs to log in:", response);
    }
  };

  // Hàm đăng nhập với Facebook
  const handleLogin = () => {
    console.log("User clicked login button");
    window.FB.login(
      (response) => {
        console.log("Login response:", response);
        if (response.authResponse) {
          // Lấy thông tin người dùng sau khi đăng nhập
          window.FB.api("/me", { fields: "name" }, (user) => {
            console.log("User data after login:", user);
            setUserName(user.name);
            localStorage.setItem("userName", user.name); // Lưu tên vào localStorage
            // Hiển thị thông báo chào mừng
            toast.success(`Chào mừng bạn ${user.name} đến thăm!`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        } else {
          alert("Bạn đã từ chối đăng nhập!");
        }
      },
      { scope: "public_profile" } // Quyền cần yêu cầu
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Chào mừng đến với ứng dụng của tôi</h1>
      {userName ? (
        <h2>Chào mừng bạn {userName} đến thăm!</h2>
      ) : (
        <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Đăng nhập với Facebook
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
