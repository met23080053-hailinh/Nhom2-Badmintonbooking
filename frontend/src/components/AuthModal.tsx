import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

// Đã cập nhật thêm tham số id: number vào interface
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, email: string, id: number) => void;
  intent?: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  intent = 'customer',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'profile' | 'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Inject FB SDK script
    if (document.getElementById('facebook-jssdk')) return;
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      (window as any).FB.init({
        appId: '1565365581102488',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setIsLoading(true);
    setError('');

    const endpoint = mode === 'register' ? 'register.php' : 'login.php';
    const payload = mode === 'register'
      ? { full_name: fullName, name: fullName, email: email, phone: phone, password: password }
      : { email: email, password: password };

    try {
      const response = await fetch(`https://cau-long.rf.gd/backend/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.status === 'success') {
        if (mode === 'login') {
          const userObj = data.user || data.data || {};
          onLoginSuccess(userObj.full_name || userObj.name || fullName || 'Người dùng', userObj.email || email, userObj.id);
          onClose();
        } else {
          setMode('login');
          setPassword('');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://cau-long.rf.gd/backend/google_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();
      if (data.status === 'success') {
        onLoginSuccess(data.user.full_name, data.user.email, data.user.id);
        onClose();
      } else {
        setError(data.message || 'Lỗi đăng nhập Google.');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSuccess = async (response: any) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`https://cau-long.rf.gd/backend/facebook_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: response.accessToken })
      });

      const data = await res.json();
      if (data.status === 'success') {
        onLoginSuccess(data.user.full_name, data.user.email, data.user.id);
        onClose();
      } else {
        setError(data.message || 'Lỗi đăng nhập Facebook.');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLoginClick = () => {
    if (!(window as any).FB) {
      setError('Facebook SDK chưa được tải, vui lòng thử lại sau.');
      return;
    }
    
    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        handleFacebookSuccess(response.authResponse);
      } else {
        console.error('FB Login Failed or Cancelled', response);
        setError('Đăng nhập Facebook thất bại hoặc đã bị hủy.');
      }
    }, {scope: 'public_profile,email'});
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="auth-modal-content"
        className="bg-earth-card w-full max-w-md rounded-2xl shadow-2xl border border-earth overflow-hidden animate-in fade-in zoom-in-95"
      >
        <div className="bg-earth-primary text-earth-cream p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold mt-2">
            {mode === 'login' 
              ? (intent === 'admin' ? 'Đăng Nhập Chủ Sân' : 'Đăng Nhập') 
              : 'Đăng Ký Tài Khoản'}
          </h2>
        </div>

        <div className="flex border-b border-earth text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${mode === 'login' ? 'text-earth-primary border-b-2 border-earth-primary bg-earth-primary/5' : 'text-earth-main/60'
              }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${mode === 'register' ? 'text-earth-primary border-b-2 border-earth-primary bg-earth-primary/5' : 'text-earth-main/60'
              }`}
          >
            Đăng Ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          
          {mode === 'register' && (
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-[#e6f7ed] text-[#0eb552] rounded-xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <h3 className="text-xl font-bold text-earth-main mb-1">Đăng ký</h3>
              <p className="text-sm text-earth-main/70 mb-3">Tạo tài khoản để đặt sân dễ dàng hơn</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#0eb552] text-xs font-semibold px-2 py-1 rounded-full"><span className="material-symbols-outlined text-[14px]">check</span> Đặt sân nhanh</span>
                <span className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#0eb552] text-xs font-semibold px-2 py-1 rounded-full"><span className="material-symbols-outlined text-[14px]">check</span> Xem lịch sử</span>
                <span className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#0eb552] text-xs font-semibold px-2 py-1 rounded-full"><span className="material-symbols-outlined text-[14px]">check</span> Nhận ưu đãi</span>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-earth-main/40 text-lg">person</span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-earth focus:outline-none focus:border-earth-primary"
                    placeholder="Họ và tên *"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-earth-main/40 text-lg">call</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-earth focus:outline-none focus:border-earth-primary"
                    placeholder="Số điện thoại *"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-earth-main/40 text-lg">mail</span>
              <input
                type="email"
                required={mode === 'login'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-earth focus:outline-none focus:border-earth-primary"
                placeholder={mode === 'register' ? "Email (tùy chọn)" : "Email *"}
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-earth-main/40 text-lg">lock</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-earth focus:outline-none focus:border-earth-primary"
                placeholder={mode === 'register' ? "Mật khẩu (ít nhất 6 ký tự) *" : "Mật khẩu *"}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-earth-main/40 text-lg">lock</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-earth focus:outline-none focus:border-earth-primary"
                  placeholder="Xác nhận lại mật khẩu *"
                />
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-earth-accent hover:bg-earth-accent-hover text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
            </button>

            {mode === 'login' && intent === 'customer' && (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-earth"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-semibold text-earth-muted/60 uppercase">Hoặc</span>
                  <div className="flex-grow border-t border-earth"></div>
                </div>
                
                <div className="flex flex-col gap-3 justify-center w-full">
                  <div className="flex justify-center">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Đăng nhập Google thất bại.')}
                      useOneTap
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleFacebookLoginClick}
                      className="bg-[#1877f2] hover:bg-[#1864cc] text-earth-main font-bold py-[9px] px-4 rounded-[4px] shadow-sm transition-colors text-sm w-auto flex items-center justify-center min-w-[210px]"
                    >
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Tiếp tục với Facebook</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


