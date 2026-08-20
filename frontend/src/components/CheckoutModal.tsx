import React, { useState } from 'react';
import { X, Copy, CheckCircle2, QrCode } from 'lucide-react';

interface CheckoutModalProps {
  bookingId: number;
  bookingCode: string;
  totalPrice: number;
  qrUrl: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  bookingId,
  bookingCode,
  totalPrice,
  qrUrl,
  onClose,
  onSuccess
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardcoded for demo, normally this would come from backend config
  const bankDetails = {
    bankName: 'MB Bank',
    accountName: 'NGUYEN VAN A',
    accountNumber: '0987654321',
    content: bookingCode,
    amount: totalPrice.toString()
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    fetch(`http://${window.location.hostname}:8000/process_payment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        onSuccess();
      } else {
        alert("Lỗi: " + data.message);
        setIsProcessing(false);
      }
    })
    .catch(err => {
      console.error(err);
      setIsProcessing(false);
      alert("Lỗi kết nối đến máy chủ.");
    });
  };

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="p-1.5 hover:bg-ink/5 rounded-md transition-colors text-primary"
      title="Sao chép"
    >
      {copiedField === field ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-ink/10 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-ink text-surface text-base p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-lg">Thanh Toán Đặt Sân</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Left Column - QR Code */}
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-ink mb-4 text-center">Mã QR Thanh Toán (VietQR)</h4>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              <img src={qrUrl} alt="Mã QR Thanh toán" className="w-64 h-64 object-contain" />
            </div>
            <p className="text-xs text-ink/60 mt-4 text-center">
              Mở ứng dụng ngân hàng và quét mã để thanh toán tự động.
            </p>
          </div>

          {/* Right Column - Manual Info */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <h4 className="font-bold text-ink mb-2">Hoặc chuyển khoản thủ công</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-ink/50 mb-0.5">Ngân hàng</p>
                  <p className="font-bold text-sm text-ink">{bankDetails.bankName}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-ink/50 mb-0.5">Tên tài khoản</p>
                  <p className="font-bold text-sm text-ink">{bankDetails.accountName}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-ink/50 mb-0.5">Số tài khoản</p>
                  <p className="font-bold text-lg text-primary tracking-wider">{bankDetails.accountNumber}</p>
                </div>
                <CopyButton text={bankDetails.accountNumber} field="account" />
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-ink/50 mb-0.5">Số tiền</p>
                  <p className="font-bold text-lg text-red-600">{totalPrice.toLocaleString('vi-VN')} đ</p>
                </div>
                <CopyButton text={bankDetails.amount} field="amount" />
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-ink/50 mb-0.5">Nội dung chuyển khoản</p>
                  <p className="font-bold text-sm text-ink bg-yellow-100 px-2 py-0.5 rounded">{bankDetails.content}</p>
                </div>
                <CopyButton text={bankDetails.content} field="content" />
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-200">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-primary hover:bg-secondary hover:text-ink text-surface font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Đang xử lý...' : 'Gửi yêu cầu (Chờ Admin xác nhận)'}
              </button>
              <p className="text-[10px] text-center text-ink/50 mt-3 px-4">
                Bằng việc xác nhận, đơn đặt sân của bạn sẽ được chuyển đến Admin chờ duyệt. Vui lòng kiểm tra kỹ số tiền và nội dung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
