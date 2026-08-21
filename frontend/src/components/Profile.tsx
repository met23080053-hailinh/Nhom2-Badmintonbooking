import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Calendar, CreditCard, Activity, MapPin, Users, Settings, Edit2, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProfileProps {
  userId: number | null;
  userName: string;
  userPhone: string;
  userRole: 'customer' | 'admin';
  onProfileUpdate: (name: string, phone: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ userId, userName, userPhone, userRole, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [infoMessage, setInfoMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passMessage, setPassMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSubmitting(true);
    setInfoMessage(null);
    try {
      const res = await fetch(`/backend/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          full_name: editName,
          phone: editPhone
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setInfoMessage({ type: 'success', text: data.message });
        onProfileUpdate(editName, editPhone);
      } else {
        setInfoMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setInfoMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'Mật khẩu mới không khớp.' });
      return;
    }
    setIsSubmitting(true);
    setPassMessage(null);
    try {
      const res = await fetch(`/backend/change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          old_password: currentPassword,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPassMessage({ type: 'success', text: data.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setPassMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Customer View
  if (userRole === 'customer') {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-ink/10 overflow-hidden">
          {/* Header */}
          <div className="h-32 bg-gradient-to-r from-primary to-ink"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-primary/5 flex items-center justify-center text-primary text-3xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="bg-primary/5 text-primary border border-ink/10 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Thành viên
              </span>
            </div>

            <h2 className="text-2xl font-bold text-ink mb-1">{userName}</h2>
            <p className="text-ink/60 mb-8 flex items-center gap-2">
              <Phone className="w-4 h-4" /> {userPhone || 'Chưa cập nhật SĐT'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar Tabs */}
              <div className="md:col-span-1 space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'info'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-ink/70 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'password'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-ink/70 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4" /> Đổi mật khẩu
                </button>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                {activeTab === 'info' && (
                  <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-6 text-ink flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-primary" /> Cập nhật thông tin
                    </h3>
                    
                    {infoMessage && (
                      <div className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-start gap-2 ${
                        infoMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {infoMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                        {infoMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleUpdateInfo} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-ink/80 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink/80 mb-1">Số điện thoại</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 bg-primary text-surface font-bold px-6 py-2.5 rounded-xl hover:bg-secondary hover:text-ink transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" /> {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'password' && (
                  <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-6 text-ink flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" /> Đổi mật khẩu
                    </h3>

                    {passMessage && (
                      <div className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-start gap-2 ${
                        passMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {passMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                        {passMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-ink/80 mb-1">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink/80 mb-1">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink/80 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 bg-primary text-surface font-bold px-6 py-2.5 rounded-xl hover:bg-secondary hover:text-ink transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" /> {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <Shield className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-lg font-bold text-ink">Bảng Điều Khiển Quản Trị đang được phát triển ở tab khác.</h3>
        <p className="text-sm text-ink/60 mt-1">Xin chào {userName}. Admin interface is now decoupled.</p>
      </div>
    </div>
  );
};



