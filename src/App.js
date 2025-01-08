import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    // Load Facebook SDK dynamically
    const loadFacebookSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeFacebookSDK();
      };
    };

    const initializeFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "1131033075055597", // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: "v17.0",
        });

        setIsSDKLoaded(true);
        checkLoginState();
      };
    };

    loadFacebookSDK();
  }, []);

  const checkLoginState = () => {
    if (window.FB) {
      window.FB.getLoginStatus((response) => {
        handleAuthResponse(response);
      });
    }
  };

  const handleAuthResponse = (response) => {
    if (response.status === "connected") {
      fetchUserData();
    }
  };

  const fetchUserData = () => {
    window.FB.api("/me", { fields: "name" }, (user) => {
      if (!user.error) {
        setUserName(user.name);
        localStorage.setItem("userName", user.name);
        showWelcomeToast(user.name);
      }
    });
  };

  const showWelcomeToast = (name) => {
    toast.success(`Chào mừng bạn ${name} đến thăm!`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleLogin = () => {
    if (!window.FB) {
      toast.error("Đang tải Facebook SDK, vui lòng thử lại sau giây lát");
      return;
    }

    window.FB.login((response) => {
      handleAuthResponse(response);
    }, { scope: "public_profile" });
  };

  // Function to create a shareable link
  const createShareableLink = () => {
    const shareUrl = window.location.href; // Your app's URL
    
    window.FB.ui({
      method: 'share',
      href: shareUrl,
    }, function(response) {
      if (response && !response.error_message) {
        toast.success('Chia sẻ thành công!');
      } else {
        toast.error('Có lỗi khi chia sẻ');
      }
    });
  };

  return (
    <div className="text-center mt-12">
      <h1 className="text-2xl font-bold mb-4">Chào mừng đến với ứng dụng của tôi</h1>
      
      {!isSDKLoaded && (
        <div className="text-gray-600">Đang tải...</div>
      )}

      {isSDKLoaded && (
        <>
          {userName ? (
            <div className="space-y-4">
              <h2 className="text-xl">Chào mừng bạn {userName} đến thăm!</h2>
              <button
                onClick={createShareableLink}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Chia sẻ ứng dụng
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Đăng nhập với Facebook
            </button>
          )}
        </>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default App;