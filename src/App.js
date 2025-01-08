import React, { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Toast, ToastProvider } from "@/components/ui/toast";

const WelcomeToast = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Load Facebook SDK
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
          appId: '1131033075055597', // Thêm Facebook App ID của bạn
          cookie: true,
          xfbml: true,
          version: 'v17.0',
        });
        
        checkLoginAndShowToast();
      };
    };

    const checkLoginAndShowToast = () => {
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          fetchUserData();
        } else {
          window.FB.login((loginResponse) => {
            if (loginResponse.status === 'connected') {
              fetchUserData();
            }
          }, { scope: 'public_profile' });
        }
      });
    };

    const fetchUserData = () => {
      window.FB.api('/me', { fields: 'name' }, (user) => {
        if (!user.error) {
          showWelcomeToast(user.name);
        }
      });
    };

    loadFacebookSDK();
  }, []);

  const showWelcomeToast = (name) => {
    toast({
      title: "Chào mừng!",
      description: `Chào mừng bạn ${name} đến thăm!`,
      duration: 3000,
    });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Chào mừng đến thăm!
          </h1>
        </div>
        <Toast />
      </div>
    </ToastProvider>
  );
};

export default WelcomeToast;