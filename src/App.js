import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
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
        statusChangeCallback(response);
      });
    };
  }, []);

  // Hàm xử lý trạng thái đăng nhập
  const statusChangeCallback = (response) => {
    if (response.status === "connected") {
      // Lấy thông tin người dùng
      window.FB.api("/me", { fields: "name" }, (user) => {
        setUserName(user.name);
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
    }
  };

  // Hàm đăng nhập với Facebook
  const handleLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          // Lấy thông tin người dùng sau khi đăng nhập
          window.FB.api("/me", { fields: "name" }, (user) => {
            setUserName(user.name);
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
