import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-earth-cream">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(96,116,86,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-earth-card border-earth">

        {/* Header panel */}
        <div className="p-8 text-center bg-earth-primary border-b border-earth">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl bg-earth-accent">
            <span className="material-symbols-outlined text-white text-3xl">sports_tennis</span>
          </div>
          <h2 className="text-2xl font-bold text-earth-cream tracking-tight">Smash Hub</h2>
          <p className="text-sm mt-1 text-earth-cream opacity-80">Hệ Thống Quản Trị Chủ Sân</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-red-50 border border-red-100 text-earth-danger">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-earth-muted">Email Chủ Sân</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl transition-all bg-earth-card border border-earth text-earth-main focus:outline-none focus:border-earth-primary focus:ring-2 focus:ring-earth-primary-light placeholder:text-earth-muted/60"
                placeholder="admin@smashhub.vn"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-earth-muted">Mật Khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl transition-all bg-earth-card border border-earth text-earth-main focus:outline-none focus:border-earth-primary focus:ring-2 focus:ring-earth-primary-light placeholder:text-earth-muted/60"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 bg-earth-accent hover:bg-earth-accent-hover text-white"
            >
              {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
              {!isLoading && <span className="material-symbols-outlined text-sm">login</span>}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="text-sm font-semibold transition-colors hover:underline cursor-pointer text-earth-primary"
              >
                ← Quay lại trang khách hàng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
