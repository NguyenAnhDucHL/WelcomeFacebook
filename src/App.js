import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    // Khởi tạo Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1131033075055597', // Thay YOUR_APP_ID bằng App ID của bạn
        cookie: true,
        xfbml: true,
        version: 'v17.0',
      });

      // Kiểm tra trạng thái đăng nhập
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          // Lấy thông tin người dùng
          window.FB.api('/me', { fields: 'name' }, (user) => {
            if (user && user.name) {
              // Hiển thị thông báo chào mừng
              toast.success(`Chào mừng bạn ${user.name} đến thăm!`, {
                position: 'top-center',
                autoClose: 3000,
              });
            }
          });
        } else {
          // Yêu cầu người dùng đăng nhập nếu chưa đăng nhập
          window.FB.login((loginResponse) => {
            if (loginResponse.status === 'connected') {
              window.FB.api('/me', { fields: 'name' }, (user) => {
                if (user && user.name) {
                  toast.success(`Chào mừng bạn ${user.name} đến thăm!`, {
                    position: 'top-center',
                    autoClose: 3000,
                  });
                }
              });
            }
          }, { scope: 'public_profile' });
        }
      });
    };
  }, []);

  return (
    <div className="App">
      <h1>Chào mừng đến với ứng dụng của tôi</h1>
      <ToastContainer />
    </div>
  );
}

export default App;
