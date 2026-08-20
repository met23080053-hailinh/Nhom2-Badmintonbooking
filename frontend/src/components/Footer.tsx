import React from 'react';

interface FooterProps {
  onNavigateTab?: (tab: 'home' | 'search' | 'courts' | 'partners') => void;
  onOpenPolicyModal?: (title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenPolicyModal }) => {
  return (
    <footer id="main-footer" className="bg-white border-t border-ink/10 pt-14 pb-10 text-ink">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-ink/10">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <h3 className="font-extrabold text-xl text-ink tracking-tight">
              Badminton Booking
            </h3>
            <p className="mt-3 text-sm text-ink/80 leading-relaxed max-w-sm">
              Nền tảng hàng đầu về đặt lịch sân và kết nối cộng đồng cầu lông.
            </p>
          </div>

          {/* Liên Kết Col */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-ink mb-3">
              Liên Kết
            </h4>
            <ul className="space-y-2.5 text-sm text-ink/80">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal?.('Về Chúng Tôi')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Về Chúng Tôi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal?.('Điều khoản Dịch vụ')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Điều Khoản Dịch Vụ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal?.('Chính sách Bảo mật')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Chính Sách Bảo Mật
                </button>
              </li>
            </ul>
          </div>

          {/* Liên Hệ Col */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-sm text-ink mb-3">
              Liên Hệ
            </h4>
            <ul className="space-y-2 text-sm text-ink/80">
              <li>
                <a
                  href="mailto:support@badmintonbooking.com"
                  className="hover:text-primary transition-colors"
                >
                  support@badmintonbooking.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+84763993624"
                  className="hover:text-primary transition-colors"
                >
                  +84 763993624
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-ink/60">
          <p>© 2024 Badminton Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
