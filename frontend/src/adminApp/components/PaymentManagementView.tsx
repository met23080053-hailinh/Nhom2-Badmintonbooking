import React, { useState } from 'react';
import { PaymentTransaction, PaymentStatus, PaymentMethod } from '../types';

interface PaymentManagementViewProps {
  payments: PaymentTransaction[];
  onUpdatePaymentStatus: (id: string, status: PaymentStatus, reason?: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PaymentManagementView: React.FC<PaymentManagementViewProps> = ({
  payments,
  onUpdatePaymentStatus,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'custom'>('week');

  // Slide-in Drawer state
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isReceiptZoomed, setIsReceiptZoomed] = useState(false);

  // Export report modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredPayments = payments.filter((txn) => {
    const matchesSearch =
      txn.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || txn.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const failedCount = payments.filter((p) => p.status === 'failed').length;

  const handleApprove = () => {
    if (selectedTxn) {
      onUpdatePaymentStatus(selectedTxn.id, 'paid');
      onShowToast(
        'Thanh toán thành công',
        `Đã duyệt giao dịch ${selectedTxn.id} (${selectedTxn.guestName} - ₫${selectedTxn.amount.toLocaleString('vi-VN')})`,
        'success'
      );
      setSelectedTxn(null);
    }
  };

  const handleReject = () => {
    if (selectedTxn) {
      onUpdatePaymentStatus(selectedTxn.id, 'failed', rejectionReason || 'Từ chối bởi Quản trị viên');
      onShowToast(
        'Đã từ chối giao dịch',
        `Giao dịch ${selectedTxn.id} bị từ chối: ${rejectionReason || 'Không hợp lệ'}`,
        'error'
      );
      setSelectedTxn(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12 animate-in fade-in duration-300 relative">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-earth-main tracking-tight">Quản Lý Thanh Toán</h1>
          <p className="text-sm text-earth-muted mt-1">
            Theo dõi doanh thu và xử lý giao dịch theo thời gian thực.
          </p>
        </div>

        <button
          id="btn-export-report"
          onClick={() => setIsExportModalOpen(true)}
          className="bg-white hover:bg-slate-50 text-earth-main px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer border border-earth"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Xuất Báo Cáo
        </button>
      </div>

      {/* Bento Grid: 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Month */}
        <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-earth-primary-light rounded-full blur-2xl opacity-50"></div>
          <div className="flex justify-between items-start z-10 relative">
            <span className="text-xs uppercase tracking-wider font-bold text-earth-muted">
              TỔNG DOANH THU (THÁNG)
            </span>
            <div className="w-8 h-8 rounded-full bg-earth-primary-light flex items-center justify-center border border-earth-primary">
              <span className="material-symbols-outlined text-earth-primary text-lg">account_balance_wallet</span>
            </div>
          </div>
          <div className="z-10 relative mt-2">
            <span className="text-3xl lg:text-4xl font-bold text-earth-primary block font-mono">₫145.2M</span>
            <span className="text-xs text-earth-muted font-semibold inline-flex items-center mt-1">
              <span className="material-symbols-outlined text-[13px] mr-1">trending_up</span>
              +12.5% so với tháng trước
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-earth-accent-light rounded-full blur-xl opacity-30"></div>
          <div className="flex justify-between items-start z-10 relative">
            <span className="text-xs uppercase tracking-wider font-bold text-earth-muted">
              CHỜ DUYỆT
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-earth">
              <span className="material-symbols-outlined text-earth-main text-lg">hourglass_empty</span>
            </div>
          </div>
          <div className="z-10 relative mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-bold text-earth-primary block font-mono">{pendingCount || 18}</span>
              <span className="text-sm text-earth-muted font-semibold">Giao dịch</span>
            </div>
            <span className="text-xs text-earth-muted mt-1 block">Cần xác nhận thủ công</span>
          </div>
        </div>

        {/* Failed / Cancelled */}
        <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px] group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-earth-danger-light rounded-full blur-2xl opacity-40"></div>
          <div className="flex justify-between items-start z-10 relative">
            <span className="text-xs uppercase tracking-wider font-bold text-earth-muted">
              THẤT BẠI / ĐÃ HỦY
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-earth">
              <span className="material-symbols-outlined text-earth-danger text-lg">cancel</span>
            </div>
          </div>
          <div className="z-10 relative mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-bold text-earth-primary block font-mono">{failedCount || 4}</span>
              <span className="text-sm text-earth-muted font-semibold">Giao dịch</span>
            </div>
            <span className="text-xs text-earth-muted mt-1 block">24 giờ qua</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Filters + Table */}
      <div className="bg-earth-card rounded-xl shadow-sm flex flex-col overflow-hidden border border-earth">
        {/* Toolbar / Filters */}
        <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 border-b border-earth">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-earth-muted text-lg">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm ID hoặc Tên khách..."
                className="w-full bg-white text-earth-main text-xs py-2.5 pl-9 pr-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary placeholder:text-earth-muted"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white text-earth-main text-xs font-medium py-2.5 pl-3 pr-8 rounded-lg border border-earth focus:outline-none focus:border-earth-primary cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-earth-muted text-base pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Method Filter */}
            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none bg-white text-earth-main text-xs font-medium py-2.5 pl-3 pr-8 rounded-lg border border-earth focus:outline-none focus:border-earth-primary cursor-pointer"
              >
                <option value="all">Tất cả phương thức</option>
                <option value="qr">Chuyển khoản QR</option>
                <option value="momo">MoMo</option>
                <option value="cash">Tiền mặt</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-earth-muted text-base pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Range Tabs */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-earth self-start md:self-auto">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                dateRange === 'today'
                  ? 'bg-slate-100 text-earth-main shadow-xs'
                  : 'text-earth-muted hover:text-earth-main'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                dateRange === 'week'
                  ? 'bg-slate-100 text-earth-main shadow-xs'
                  : 'text-earth-muted hover:text-earth-main'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                dateRange === 'custom'
                  ? 'bg-slate-100 text-earth-main shadow-xs'
                  : 'text-earth-muted hover:text-earth-main'
              }`}
            >
              Tùy chỉnh
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-primary-light text-earth-main text-xs font-bold uppercase tracking-wider border-b border-earth">
                <th className="py-3.5 px-5 whitespace-nowrap">MÃ ĐẶT SÂN</th>
                <th className="py-3.5 px-5 whitespace-nowrap">KHÁCH / NGƯỜI CHƠI</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">SỐ TIỀN</th>
                <th className="py-3.5 px-5 text-center whitespace-nowrap">PHƯƠNG THỨC</th>
                <th className="py-3.5 px-5 whitespace-nowrap">THỜI GIAN / NGÀY</th>
                <th className="py-3.5 px-5 whitespace-nowrap">TRẠNG THÁI</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="text-earth-main text-xs divide-y divide-earth font-mono">
              {filteredPayments.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="bg-white hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-5 font-bold text-earth-main">
                    {txn.bookingId}
                  </td>
                  <td className="py-4 px-5 font-sans">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-earth text-earth-main flex items-center justify-center font-bold text-xs">
                        {txn.guestInitials}
                      </div>
                      <span className="text-earth-main font-medium">{txn.guestName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right text-earth-main font-bold text-sm">
                    {txn.status === 'failed' ? (
                      <span className="line-through text-earth-muted">₫{txn.amount.toLocaleString('vi-VN')}</span>
                    ) : (
                      <span className="text-earth-primary">₫{txn.amount.toLocaleString('vi-VN')}</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {txn.method === 'qr' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-slate-100 border border-earth text-earth-main" title="Bank QR">
                        <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                      </div>
                    )}
                    {txn.method === 'momo' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#A50064]/10 border border-[#A50064]/20 text-[#A50064] font-bold" title="MoMo">
                        <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                      </div>
                    )}
                    {txn.method === 'cash' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-earth-primary-light border border-earth-primary text-earth-primary" title="Tiền mặt">
                        <span className="material-symbols-outlined text-base">payments</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5 text-earth-muted font-sans">
                    <span className="font-semibold text-earth-main">{txn.timeStr}</span>
                    <br />
                    <span className="text-[11px]">{txn.dateStr}</span>
                  </td>
                  <td className="py-4 px-5 font-sans">
                    {txn.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        Pending
                      </span>
                    )}
                    {txn.status === 'paid' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-earth-primary-light text-earth-primary border border-earth-primary">
                        Paid
                      </span>
                    )}
                    {txn.status === 'failed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-earth-danger-light text-earth-danger border border-earth-danger">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right font-sans">
                    {txn.status === 'pending' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTxn(txn);
                        }}
                        className="bg-earth-primary hover:bg-earth-primary-hover text-earth-accent px-3.5 py-1.5 rounded-md font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        Xác nhận
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTxn(txn);
                        }}
                        className="text-earth-muted hover:text-earth-main p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-4 bg-slate-50">
          {filteredPayments.map((txn) => (
            <div
              key={txn.id}
              onClick={() => setSelectedTxn(txn)}
              className="bg-white rounded-xl border border-earth shadow-sm p-4 flex flex-col gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {txn.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                      CHỜ XỬ LÝ
                    </span>
                  )}
                  {txn.status === 'paid' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-earth-primary-light text-earth-primary border border-earth-primary">
                      ĐÃ THANH TOÁN
                    </span>
                  )}
                  {txn.status === 'failed' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-earth-danger-light text-earth-danger border border-earth-danger">
                      THẤT BẠI
                    </span>
                  )}
                  <span className="text-earth-muted text-xs font-mono">{txn.timeStr} {txn.dateStr}</span>
                </div>
                <span className="text-earth-primary font-bold font-mono">₫{txn.amount.toLocaleString('vi-VN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-earth-main font-bold text-sm">{txn.guestName}</div>
                  <div className="text-earth-muted text-xs font-mono">{txn.bookingId}</div>
                </div>
                <div className="w-8 h-8 rounded bg-slate-100 text-earth-main border border-earth flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">
                    {txn.method === 'qr' ? 'qr_code_scanner' : txn.method === 'momo' ? 'account_balance_wallet' : 'payments'}
                  </span>
                </div>
              </div>

              {txn.status === 'pending' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTxn(txn);
                  }}
                  className="w-full mt-1 bg-earth-primary hover:bg-earth-primary-hover text-earth-accent py-2 rounded-md font-bold text-xs uppercase tracking-wider"
                >
                  Xác nhận thanh toán
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in Detail Drawer / Panel (Matches Image 9.png) */}
      {selectedTxn && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setSelectedTxn(null)}
          />

          <div
            id="detailPanel"
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-earth animate-in slide-in-from-right duration-300"
          >
            {/* Panel Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-slate-50 border-b border-earth">
              <h2 className="text-lg font-bold text-earth-main tracking-tight">Chi tiết giao dịch</h2>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-earth-muted hover:text-earth-main p-2"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Context Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-earth-muted text-xs mb-1">{selectedTxn.id}</p>
                  <p className="text-3xl font-bold text-earth-primary leading-none font-mono">
                    ₫{selectedTxn.amount.toLocaleString('vi-VN')}
                  </p>
                </div>
                {selectedTxn.status === 'pending' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                    Pending
                  </span>
                )}
                {selectedTxn.status === 'paid' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-earth-primary-light text-earth-primary border border-earth-primary shadow-sm">
                    Paid
                  </span>
                )}
                {selectedTxn.status === 'failed' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-earth-danger-light text-earth-danger border border-earth-danger shadow-sm">
                    Failed
                  </span>
                )}
              </div>

              {/* Proof of Payment Screenshot */}
              <div>
                <p className="text-xs font-bold text-earth-muted uppercase tracking-wider mb-2.5">
                  PROOF OF PAYMENT (BIÊN LAI CHUYỂN KHOẢN)
                </p>
                <div
                  onClick={() => setIsReceiptZoomed(true)}
                  className="w-full aspect-[3/4] max-h-72 bg-slate-100 rounded-xl border border-earth overflow-hidden relative group cursor-zoom-in shadow-inner"
                >
                  <img
                    src={selectedTxn.proofImage || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80'}
                    alt="Proof of Payment Receipt"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-ink text-3xl drop-shadow-md">
                      zoom_in
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4.5 border border-earth space-y-3.5 text-xs">
                <div className="flex justify-between items-center border-b border-earth pb-2.5">
                  <span className="text-earth-muted">Tên khách</span>
                  <span className="text-earth-main font-bold text-sm">{selectedTxn.guestName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-earth pb-2.5">
                  <span className="text-earth-muted">Mã đặt sân</span>
                  <span className="text-earth-primary font-mono font-bold flex items-center gap-1">
                    {selectedTxn.bookingId}
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-earth pb-2.5">
                  <span className="text-earth-muted">Phương thức thanh toán</span>
                  <span className="text-earth-main font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-earth-muted">
                      {selectedTxn.method === 'qr' ? 'qr_code_scanner' : 'account_balance_wallet'}
                    </span>
                    {selectedTxn.method === 'qr' ? 'Chuyển khoản (QR)' : selectedTxn.method === 'momo' ? 'Ví MoMo' : 'Tiền mặt'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-earth-muted">Thời gian gửi</span>
                  <span className="text-earth-main font-mono">{selectedTxn.fullTimestamp}</span>
                </div>
              </div>

              {/* Rejection Note input */}
              {selectedTxn.status === 'pending' && (
                <div>
                  <label className="block text-xs font-bold text-earth-muted uppercase tracking-wider mb-2">
                    Lý do từ chối (Nếu không hợp lệ)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Ví dụ: Sai số tiền, ảnh mờ không đọc được mã giao dịch..."
                    rows={2}
                    className="w-full bg-slate-50 text-earth-main text-xs p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary resize-none placeholder:text-earth-muted"
                  />
                </div>
              )}
            </div>

            {/* Panel Actions Footer */}
            <div className="p-6 bg-slate-50 border-t border-earth flex gap-3">
              {selectedTxn.status === 'pending' ? (
                <>
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-white text-earth-danger border border-earth-danger hover:bg-earth-danger-light py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-[2] bg-earth-primary hover:bg-earth-primary-hover text-earth-accent py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Duyệt thanh toán
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="w-full bg-slate-100 border border-earth hover:bg-slate-200 text-earth-main py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Đóng chi tiết
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Full Image Zoom Modal */}
      {isReceiptZoomed && selectedTxn && (
        <div
          className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4"
          onClick={() => setIsReceiptZoomed(false)}
        >
          <div className="relative max-w-lg w-full max-h-[90vh]">
            <img
              src={selectedTxn.proofImage || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80'}
              alt="Zoomed Receipt"
              className="w-full h-auto rounded-xl shadow-2xl border border-slate-300"
            />
            <button
              onClick={() => setIsReceiptZoomed(false)}
              className="absolute top-3 right-3 bg-black/60 text-ink rounded-full p-2 hover:bg-black cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-earth rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-earth">
              <h3 className="text-lg font-bold text-earth-main flex items-center gap-2">
                <span className="material-symbols-outlined text-earth-primary">file_download</span>
                Xuất báo cáo doanh thu
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-earth-muted hover:text-earth-main cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs text-earth-muted">
              <p>Chọn định dạng và khoảng thời gian để xuất file đối soát tài chính:</p>
              <div>
                <label className="block font-bold uppercase text-earth-muted mb-1">Định dạng file</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 px-3 bg-slate-50 text-earth-main rounded-lg font-bold border border-earth flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100">
                    <span className="material-symbols-outlined text-sm">table_chart</span> Excel (.xlsx)
                  </button>
                  <button className="py-2.5 px-3 bg-white border border-earth text-earth-muted hover:bg-slate-50 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF (.pdf)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-earth mt-5">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-slate-100 text-earth-muted text-xs font-bold cursor-pointer hover:bg-slate-200 border border-earth"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onShowToast('Đang tải file...', 'Báo cáo doanh thu tháng 8 đã được xuất thành công', 'success');
                  setIsExportModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-lg bg-earth-primary text-earth-accent text-xs font-bold hover:bg-earth-primary-hover cursor-pointer"
              >
                Tải xuống ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
