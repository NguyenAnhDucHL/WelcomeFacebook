import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Toast, ToastProvider } from "@/components/ui/toast";

const App = () => {
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadFacebookSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
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
          appId: '', // Thêm Facebook App ID của bạn
          cookie: true,
          xfbml: true,
          version: 'v17.0',
        });

        setIsSDKLoaded(true);
        setIsLoading(false);
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
    if (response.status === 'connected') {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  };

  const fetchUserData = () => {
    window.FB.api('/me', { fields: 'name' }, (user) => {
      if (!user.error) {
        setUserName(user.name);
        localStorage.setItem('userName', user.name);
        showWelcomeToast(user.name);
      }
      setIsLoading(false);
    });
  };

  const showWelcomeToast = (name) => {
    toast({
      title: "Chào mừng!",
      description: `Chào mừng bạn ${name} đến thăm!`,
      duration: 3000,
    });
  };

  const handleLogin = () => {
    if (!window.FB) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đang tải Facebook SDK, vui lòng thử lại sau giây lát",
      });
      return;
    }

    setIsLoading(true);
    window.FB.login((response) => {
      handleAuthResponse(response);
    }, { scope: 'public_profile' });
  };

  const createShareableLink = () => {
    const shareUrl = window.location.href;
    
    window.FB.ui({
      method: 'share',
      href: shareUrl,
    }, function(response) {
      if (response && !response.error_message) {
        toast({
          title: "Thành công",
          description: "Chia sẻ thành công!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Có lỗi khi chia sẻ",
        });
      }
    });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Chào mừng đến với ứng dụng của tôi
          </h1>
          
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-lg text-gray-600">Đang tải</div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" 
                     style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" 
                     style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" 
                     style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <>
              {userName ? (
                <div className="space-y-6">
                  <h2 className="text-xl text-gray-700">
                    Chào mừng bạn <span className="font-semibold">{userName}</span> đến thăm!
                  </h2>
                  <button
                    onClick={createShareableLink}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                             hover:bg-blue-700 transition duration-200 shadow-md
                             flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span>Chia sẻ ứng dụng</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                           hover:bg-blue-700 transition duration-200 shadow-md
                           flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Đăng nhập với Facebook</span>
                </button>
              )}
            </>
          )}
        </div>
        <Toast />
      </div>
    </ToastProvider>
  );
};

export default App;