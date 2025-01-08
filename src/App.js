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
        appId: "1131033075055597", // Thay YOUR_APP_ID bằng App ID của bạn
        cookie: true,
        xfbml: true,
        version: "v17.0", // Sử dụng phiên bản Facebook API mới nhất
      });

      // Kiểm tra trạng thái đăng nhập
      window.FB.getLoginStatus(function (response) {
        console.log("Login status response:", response);
        if (response.error) {
          console.error("Error during getLoginStatus:", response.error);
        } else {
          statusChangeCallback(response);
        }
      });
    };

    // Xử lý trường hợp SDK không tải được
    if (!window.FB) {
      console.error("Facebook SDK không được tải.");
    }
  }, []);

  // Hàm xử lý trạng thái đăng nhập
  const statusChangeCallback = (response) => {
    console.log("StatusChangeCallback response:", response);
    if (response.status === "connected") {
      console.log("User is connected:", response);
      // Lấy thông tin người dùng
      window.FB.api("/me", { fields: "name" }, (user) => {
        if (user.error) {
          console.error("Error fetching user data:", user.error);
        } else {
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
        }
      });
    } else {
      console.warn("User is not connected or needs to log in:", response);
    }
  };

  // Hàm đăng nhập với Facebook
  const handleLogin = () => {
    console.log("User clicked login button");
    if (!window.FB) {
      console.error("Facebook SDK chưa sẵn sàng.");
      return;
    }
    window.FB.login(
      (response) => {
        console.log("Login response:", response);
        if (response.authResponse) {
          // Lấy thông tin người dùng sau khi đăng nhập
          window.FB.api("/me", { fields: "name" }, (user) => {
            if (user.error) {
              console.error("Error fetching user data after login:", user.error);
            } else {
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
            }
          });
        } else {
          console.warn("Người dùng từ chối đăng nhập:", response);
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
