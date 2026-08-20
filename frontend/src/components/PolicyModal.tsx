import React from 'react';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

interface PolicyModalProps {
  title: string | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ title, onClose }) => {
  if (!title) return null;

  const getContent = () => {
    switch (title) {
      case 'About Us':
        return {
          icon: <Info className="w-6 h-6 text-primary" />,
          body: (
            <div className="space-y-3 text-sm text-ink/70 leading-relaxed">
              <p>
                <strong>Badminton Booking</strong> là nền tảng đặt sân cầu lông kỹ thuật số hàng đầu Việt Nam. Được tạo ra bởi những người đam mê cầu lông, sứ mệnh của chúng tôi là xóa bỏ mọi khó khăn trong việc đặt lịch và mang sân chơi chất lượng đến với mọi người.
              </p>
              <p>
                Chúng tôi hợp tác với các sân cầu lông đạt chuẩn BWF khắp Hà Nội và TP.HCM để cung cấp lịch trống theo thời gian thực, thẻ vào cửa kỹ thuật số, và mạng lưới kết nối tìm bạn giao lưu.
              </p>
            </div>
          ),
        };
      case 'Terms of Service':
        return {
          icon: <FileText className="w-6 h-6 text-primary" />,
          body: (
            <div className="space-y-3 text-sm text-ink/70 leading-relaxed">
              <p>
                1. <strong>Đặt Sân:</strong> Đặt sân qua Badminton Booking sẽ được đảm bảo 100%. Hủy trước 4 tiếng sẽ được hoàn tiền 100% vào ví.
              </p>
              <p>
                2. <strong>Quy định tại sân:</strong> Non-marking badminton shoes are strictly required on all Taraflex and timber parquet courts.
              </p>
              <p>
                3. <strong>Thủ tục vào sân:</strong> Trình mã QR thẻ vào cửa tại quầy lễ tân hoặc quét qua cổng tự động khi đến.
              </p>
            </div>
          ),
        };
      case 'Privacy Policy':
      default:
        return {
          icon: <ShieldCheck className="w-6 h-6 text-primary" />,
          body: (
            <div className="space-y-3 text-sm text-ink/70 leading-relaxed">
              <p>
                Chúng tôi tôn trọng quyền riêng tư của bạn. Mọi thông tin (SĐT, Email) đều được mã hóa và chỉ dùng để gửi xác nhận đặt sân, tìm bạn và mã QR.
              </p>
              <p>
                We never sell or disclose player information to third-party advertisers. All payment transactions are processed through secure bank-grade encrypted channels.
              </p>
            </div>
          ),
        };
    }
  };

  const { icon, body } = getContent();

  return (
    <div
      id="policy-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="policy-modal-content"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-ink/10 overflow-hidden animate-in fade-in zoom-in-95"
      >
        <div className="bg-ink text-surface text-base p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-white/10 rounded-lg text-ink">{icon}</span>
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-ink flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">{body}</div>

        <div className="p-4 bg-slate-50 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-primary text-surface font-bold text-xs rounded-xl hover:bg-secondary hover:text-ink transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};


