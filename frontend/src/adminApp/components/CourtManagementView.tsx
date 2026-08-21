import React, { useState } from 'react';
import { Court, CourtType, CourtStatus } from '../types';

interface CourtManagementViewProps {
  courts: Court[];
  onAddCourt: (court: Court) => void;
  onUpdateCourt: (court: Court) => void;
  onDeleteCourt: (courtId: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const CARD: React.CSSProperties = { background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)' };
const INPUT_STYLE: React.CSSProperties = { background: 'rgba(96,116,86,0.05)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-main)', borderRadius: 10, padding: '10px 14px', fontSize: 13, width: '100%', outline: 'none' };
const LABEL_STYLE: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 6 };
const MODAL_BG: React.CSSProperties = { background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: 20, maxWidth: 520, width: '100%', padding: 28, boxShadow: '0 24px 64px rgba(96,116,86,0.2)' };

export const CourtManagementView: React.FC<CourtManagementViewProps> = ({
  courts, onAddCourt, onUpdateCourt, onDeleteCourt, onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<CourtType>('Sân đôi');
  const [formArea, setFormArea] = useState('Khu A');
  const [formPrice, setFormPrice] = useState('120000');
  const [formStatus, setFormStatus] = useState<CourtStatus>('HOẠT ĐỘNG');
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);

  const filteredCourts = courts.filter((court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) || court.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || court.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || court.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddModal = () => {
    setEditingCourt(null);
    setFormName(''); setFormType('Sân đôi'); setFormArea('Khu A');
    setFormPrice('120000'); setFormStatus('HOẠT ĐỘNG');
    setFormImage('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80');
    setFormDesc(''); setIsModalOpen(true);
  };

  const openEditModal = (court: Court) => {
    setEditingCourt(court); setFormName(court.name); setFormType(court.type);
    setFormArea(court.area); setFormPrice(court.pricePerHour.toString());
    setFormStatus(court.status); setFormImage(court.image);
    setFormDesc(court.description || ''); setIsModalOpen(true);
  };

  const handleSaveCourt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { onShowToast('Lỗi nhập liệu', 'Vui lòng nhập tên sân', 'error'); return; }
    const priceNum = parseInt(formPrice, 10) || 100000;
    if (editingCourt) {
      onUpdateCourt({ ...editingCourt, name: formName, type: formType, area: formArea, pricePerHour: priceNum, status: formStatus, image: formImage || editingCourt.image, description: formDesc });
      onShowToast('Cập nhật thành công', `Đã cập nhật thông tin sân ${formName}`, 'success');
    } else {
      onAddCourt({ id: `court-${Date.now()}`, name: formName, type: formType, area: formArea, pricePerHour: priceNum, status: formStatus, image: formImage || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80', description: formDesc });
      onShowToast('Thêm sân thành công', `Đã thêm ${formName} vào hệ thống`, 'success');
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (courtToDelete) { onDeleteCourt(courtToDelete.id); onShowToast('Đã xóa sân', `Đã xóa ${courtToDelete.name} khỏi danh sách`, 'info'); setCourtToDelete(null); }
  };

  const pageBtn = (page: number) => (
    <button key={page} onClick={() => setCurrentPage(page)}
      className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
      style={currentPage === page
        ? { background: 'var(--admin-primary)', color: 'white' }
        : { background: 'rgba(96,116,86,0.08)', color: 'var(--admin-text-muted)' }}>
      {page}
    </button>
  );

  return (
    <div className="flex flex-col w-full gap-6 pb-12" style={{ animation: 'fadeIn 0.3s ease both' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-earth-main tracking-tight">Quản lý sân</h1>
          <p className="text-sm mt-1 text-earth-muted">Quản lý thông tin, giá cả và trạng thái các sân cầu lông</p>
        </div>
        <button id="btn-add-court" onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer self-start sm:self-auto bg-earth-accent hover:bg-earth-accent-hover text-ink">
          <span className="material-symbols-outlined text-xl">add</span>
          Thêm sân mới
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-xl flex flex-col md:flex-row gap-3" style={CARD}>
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-earth-muted">search</span>
          <input id="input-court-search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tên sân, khu vực..."
            style={{ ...INPUT_STYLE, paddingLeft: 42 }} />
        </div>
        <div className="relative min-w-[160px]">
          <select id="select-court-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            style={{ ...INPUT_STYLE, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
            <option value="all">Tất cả loại sân</option>
            <option value="Sân đơn">Sân đơn</option>
            <option value="Sân đôi">Sân đôi</option>
            <option value="Sân VIP">Sân VIP</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl text-earth-muted">expand_more</span>
        </div>
        <div className="relative min-w-[160px]">
          <select id="select-court-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...INPUT_STYLE, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="HOẠT ĐỘNG">HOẠT ĐỘNG</option>
            <option value="BẢO TRÌ">BẢO TRÌ</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl text-earth-muted">expand_more</span>
        </div>
      </div>

      {/* Courts Table */}
      <div className="rounded-xl overflow-hidden" style={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--admin-primary-light)', borderBottom: '1px solid var(--admin-border)' }}>
                {['HÌNH ẢNH','TÊN SÂN','LOẠI SÂN','KHU VỰC','GIÁ / GIỜ','TRẠNG THÁI','THAO TÁC'].map((h, i) => (
                  <th key={i} className={`py-4 px-5 text-xs font-bold uppercase tracking-wider text-earth-main ${i === 5 ? 'text-center' : i === 6 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: 'var(--admin-text-main)', fontSize: 13 }}>
              {filteredCourts.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-earth-muted">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">sports_tennis</span>
                  Không tìm thấy sân phù hợp với bộ lọc.
                </td></tr>
              ) : (
                filteredCourts.map((court) => (
                  <tr key={court.id} className="group transition-colors hover:bg-slate-50"
                    style={{ borderBottom: '1px solid var(--admin-border)' }}>

                    {/* Image */}
                    <td className="py-3.5 px-5">
                      <div className="w-16 h-11 rounded-lg overflow-hidden relative shrink-0 border border-earth">
                        <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-earth-main">{court.name}</div>
                      {court.description && (
                        <div className="text-xs line-clamp-1 max-w-xs mt-0.5 text-earth-muted">{court.description}</div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-5 text-earth-muted">{court.type}</td>

                    {/* Area */}
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-earth-main border border-earth">
                        {court.area}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-5 font-bold font-mono text-earth-primary">
                      {court.pricePerHour.toLocaleString('vi-VN')}đ
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 text-center">
                      {court.status === 'HOẠT ĐỘNG' ? (
                        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wide bg-earth-primary-light text-earth-primary">
                          HOẠT ĐỘNG
                        </span>
                      ) : (
                        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-50 text-amber-600 border border-amber-200">
                          BẢO TRÌ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(court)}
                          className="p-1.5 rounded-lg transition-all cursor-pointer text-earth-primary hover:bg-earth-primary-light"
                          title="Chỉnh sửa sân">
                          <span className="material-symbols-outlined text-[19px]">edit</span>
                        </button>
                        <button onClick={() => setCourtToDelete(court)}
                          className="p-1.5 rounded-lg transition-all cursor-pointer text-earth-danger hover:bg-earth-danger-light"
                          title="Xóa sân">
                          <span className="material-symbols-outlined text-[19px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border-t border-earth">
          <p className="text-xs font-medium text-earth-muted">
            Hiển thị 1–{filteredCourts.length} trên {courts.length} sân
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 bg-white border border-earth text-earth-muted hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            {[1, 2, 3].map(pageBtn)}
            <span className="text-xs px-1 text-earth-muted">...</span>
            <button onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-white border border-earth text-earth-muted hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div style={MODAL_BG}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-earth">
              <h2 className="text-xl font-bold text-earth-main">{editingCourt ? 'Chỉnh sửa thông tin sân' : 'Thêm sân mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg transition-colors cursor-pointer text-earth-muted hover:bg-slate-50">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourt} className="space-y-4">
              <div>
                <label style={LABEL_STYLE}>Tên Sân</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Sân VIP 7..." style={INPUT_STYLE} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={LABEL_STYLE}>Loại Sân</label>
                  <div className="relative">
                    <select value={formType} onChange={(e) => setFormType(e.target.value as CourtType)}
                      style={{ ...INPUT_STYLE, appearance: 'none', paddingRight: 32 }}>
                      <option value="Sân đôi">Sân đôi</option>
                      <option value="Sân đơn">Sân đơn</option>
                      <option value="Sân VIP">Sân VIP</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base text-earth-muted">expand_more</span>
                  </div>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Khu Vực</label>
                  <input type="text" value={formArea} onChange={(e) => setFormArea(e.target.value)}
                    placeholder="Khu A, Khu B..." style={INPUT_STYLE} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={LABEL_STYLE}>Giá thuê (VNĐ / Giờ)</label>
                  <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)}
                    style={INPUT_STYLE} required />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Trạng Thái</label>
                  <div className="relative">
                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as CourtStatus)}
                      style={{ ...INPUT_STYLE, appearance: 'none', paddingRight: 32 }}>
                      <option value="HOẠT ĐỘNG">HOẠT ĐỘNG</option>
                      <option value="BẢO TRÌ">BẢO TRÌ</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base text-earth-muted">expand_more</span>
                  </div>
                </div>
              </div>
              <div>
                <label style={LABEL_STYLE}>URL Hình ảnh sân</label>
                <input type="url" value={formImage} onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..." style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Mô tả tiện ích sân</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Thảm thi đấu, đèn chống lóa, điều hòa..." rows={2}
                  style={{ ...INPUT_STYLE, resize: 'none' }} />
              </div>
              <div className="flex gap-3 pt-3 border-t border-earth">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer bg-slate-100 text-earth-muted border border-earth hover:bg-slate-200">
                  Hủy bỏ
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm cursor-pointer bg-earth-accent hover:bg-earth-accent-hover text-ink">
                  {editingCourt ? 'Lưu thay đổi' : 'Tạo sân mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {courtToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div style={{ ...MODAL_BG, maxWidth: 380, textAlign: 'center' }}>
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 bg-earth-danger-light text-earth-danger">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold text-earth-main mb-2">Xác nhận xóa sân?</h3>
            <p className="text-xs mb-6 text-earth-muted">
              Bạn có chắc chắn muốn xóa <span className="font-bold text-earth-main">{courtToDelete.name}</span>? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCourtToDelete(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all bg-slate-100 text-earth-muted hover:bg-slate-200 border border-earth">
                Hủy
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm cursor-pointer bg-earth-danger hover:bg-red-800 text-ink">
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



