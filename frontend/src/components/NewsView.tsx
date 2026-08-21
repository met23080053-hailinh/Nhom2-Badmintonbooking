import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';



export const NewsView: React.FC = () => {
  const [newsList, setNewsList] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`/backend/get_news.php`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setNewsList(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-12 bg-[#f9fafb] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-ink mb-3">Tin Tức & Hoạt Động</h1>
          <p className="text-ink/60 max-w-2xl mx-auto">Cập nhật những thông tin mới nhất về các giải đấu, chương trình khuyến mãi và kiến thức cầu lông.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map(news => (
            <div key={news.id} className="bg-white rounded-2xl shadow-sm border border-ink/5 overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
              <div className="h-48 overflow-hidden relative">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md">
                  {news.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-3 font-semibold">
                  <Calendar className="w-4 h-4" />
                  {news.date}
                </div>
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-ink/70 mb-5 line-clamp-3 leading-relaxed">
                  {news.excerpt}
                </p>
                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Đọc tiếp <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



