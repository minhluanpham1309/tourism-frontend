'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { useSearch } from '@/hooks/useSearch';
import { TourismQuery } from '@/types/tourism';
import {
  Search,
  MapPin,
  Navigation,
  Landmark,
  Trees,
  UtensilsCrossed,
  ScrollText,
  Globe,
  X,
  Building2,
  Mic,
  Square,
} from 'lucide-react';

export default function HomePage() {
  const { results, isLoading, error, search, searchByVoice, clearResults } = useSearch();
  const [queryText, setQueryText] = React.useState('');

  // ---- Voice search (MediaRecorder -> /stt/search) ----
  const [isRecording, setIsRecording] = React.useState(false);
  const [micError, setMicError] = React.useState<string | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        const ext = type.includes('mp4') ? 'mp4' : 'webm';
        const res = await searchByVoice(blob, `voice.${ext}`);
        // hiện câu đã nhận dạng lên ô tìm kiếm
        if (res?.query) setQueryText(res.query.replace('🎤 ', ''));
      };
      rec.start();
      recorderRef.current = rec;
      setIsRecording(true);
    } catch {
      setMicError(
        'Không truy cập được micro. Hãy cho phép quyền micro trong trình duyệt (chỉ hoạt động trên localhost hoặc HTTPS).'
      );
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  const toggleRecording = () => (isRecording ? stopRecording() : void startRecording());

  const runSearch = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    const query: TourismQuery = { text: q, use_vector_search: true };
    await search(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(queryText);
  };

  const pickSuggestion = (q: string) => {
    setQueryText(q);
    void runSearch(q);
  };

  const adminQueries = [
    'Phường Trấn Biên được gộp từ những phường nào?',
    'Xã Thạnh Phú mới tên là gì?',
    'Phường Linh Tây tên mới là gì?',
  ];

  const tourismGroups = [
    {
      icon: <Landmark className="h-3.5 w-3.5" />,
      queries: ['Nhà thờ cổ kính ở Biên Hòa', 'Đền thờ và miếu mạo truyền thống'],
    },
    {
      icon: <Trees className="h-3.5 w-3.5" />,
      queries: ['Thác nước đẹp ở Đồng Nai', 'Khu du lịch sinh thái rừng tre'],
    },
    {
      icon: <UtensilsCrossed className="h-3.5 w-3.5" />,
      queries: ['Chợ truyền thống ở Xuân Lộc', 'Quán cà phê view đẹp Biên Hòa'],
    },
  ];

  const isAdminResult = results?.search_method === 'administrative_focused';

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-rose-950 drop-shadow-sm">
            Khám phá miền Nam
          </h1>
          <p className="mt-4 text-lg text-rose-900/80 max-w-2xl mx-auto">
            Hỏi đáp địa giới hành chính và gợi ý du lịch miền Nam sau sáp nhập 1-7-2025
          </p>
        </div>

        {/* sóng trang trí */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full text-background"
          viewBox="0 0 1440 70"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C320,80 720,0 1440,50 L1440,70 L0,70 Z" />
        </svg>
      </section>

      {/* ================= SEARCH CARD (nổi trên hero) ================= */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        <div className="card-soft rounded-3xl p-5 sm:p-7 animate-fade-up">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ví dụ: Gợi ý điểm du lịch ở Đồng Nai..."
                className="w-full h-16 pl-12 pr-40 rounded-2xl border border-slate-200 bg-slate-50/60 text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-300/30 transition-all"
              />
              <button
                type="submit"
                disabled={!queryText.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl brand-gradient text-white text-base font-semibold shadow-md shadow-pink-300/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Nút nói để tìm — to, rõ, hợp người lớn tuổi */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading && !isRecording}
              className={`inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full text-lg font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 ${
                isRecording
                  ? 'bg-rose-500 text-white shadow-rose-300/60 animate-pulse-soft'
                  : 'bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50 shadow-pink-200/50'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="h-5 w-5 fill-white" />
                  Đang nghe... bấm để dừng
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6" />
                  🎤 Nói để tìm kiếm
                </>
              )}
            </button>
            {isRecording && (
              <p className="text-sm text-rose-600 font-medium">
                Hãy nói câu hỏi của bạn, ví dụ: “Gợi ý điểm du lịch ở Đồng Nai”
              </p>
            )}
            {micError && <p className="text-sm text-rose-600 text-center max-w-md">{micError}</p>}
          </div>

          {/* Gợi ý nhanh */}
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide inline-flex items-center gap-1">
                <ScrollText className="h-3.5 w-3.5" /> Hành chính
              </span>
              {adminQueries.map((q) => (
                <button key={q} type="button" className="chip" onClick={() => pickSuggestion(q)}>
                  {q}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Du lịch
              </span>
              {tourismGroups.flatMap((g) =>
                g.queries.map((q) => (
                  <button key={q} type="button" className="chip" onClick={() => pickSuggestion(q)}>
                    {g.icon}
                    {q}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-5">
        {isLoading && (
          <div className="card-soft rounded-3xl py-14 text-center animate-fade-up">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-pink-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Đang phân tích câu hỏi & tìm kiếm...</p>
            <p className="text-sm text-slate-400 mt-1">NER → Intent → Knowledge Graph / Vector Search</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 animate-fade-up">
            <p className="font-semibold text-rose-800">Lỗi tìm kiếm</p>
            <p className="text-sm text-rose-600 mt-1">{error}</p>
          </div>
        )}

        {results && !isLoading && (
          <>
            {/* Meta bar */}
            <div className="card-soft rounded-2xl px-5 py-4 animate-fade-up">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-slate-600">
                <span className="font-medium text-slate-900 truncate max-w-full sm:max-w-[45%]">
                  “{results.query.replace('🎤 ', '')}”
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-pink-500" />
                  <b>{results.total}</b>&nbsp;kết quả
                </span>
                <button
                  onClick={clearResults}
                  className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" /> Xóa
                </button>
              </div>
            </div>

            {/* ADMIN answer panel (kết quả dạng cây) */}
            {isAdminResult && results.results.length > 0 && (
              <div className="card-soft rounded-3xl p-6 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="brand-gradient w-10 h-10 rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Địa giới hành chính sau sáp nhập</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(() => {
                    // Gom các dòng thường liên tiếp vào 1 khối; mỗi dòng "Trước đây gồm:" là 1 khối chip riêng
                    type Block =
                      | { kind: 'old_names'; ward: string; items: string[] }
                      | { kind: 'lines'; lines: { name: string; ward?: string; province?: string; idx: number }[] };
                    const blocks: Block[] = [];
                    results.results.forEach((r, i) => {
                      if (r.name.startsWith('Trước đây gồm:')) {
                        const items = r.name
                          .replace('Trước đây gồm:', '')
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        blocks.push({ kind: 'old_names', ward: r.ward || '', items });
                      } else {
                        const last = blocks[blocks.length - 1];
                        const line = { name: r.name, ward: r.ward, province: r.province, idx: i };
                        if (last?.kind === 'lines') last.lines.push(line);
                        else blocks.push({ kind: 'lines', lines: [line] });
                      }
                    });
                    return blocks.map((b, bi) =>
                      b.kind === 'old_names' ? (
                        <div key={bi} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            {b.items.length} đơn vị cũ
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {b.items.map((it, j) => (
                              <span
                                key={j}
                                className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-slate-200 text-sm text-slate-700"
                              >
                                {it}
                              </span>
                            ))}
                          </div>
                          {b.ward && (
                            <p className="mt-3 pt-3 border-t border-slate-200/70 text-[17px] font-semibold text-slate-900">
                              <span className="text-pink-500 mr-1.5">→</span>
                              {b.ward}
                              <span className="ml-2 text-xs font-normal text-slate-400">tên mới</span>
                            </p>
                          )}
                        </div>
                      ) : (
                        <div key={bi} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
                          {b.lines.map((l) => (
                            <p
                              key={l.idx}
                              className={`text-[17px] leading-relaxed ${
                                l.idx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'
                              } ${
                                l.name.startsWith('├') || l.name.startsWith('└') || l.name.startsWith(' ')
                                  ? 'pl-2 font-mono text-sm'
                                  : ''
                              }`}
                            >
                              {l.name}
                              {l.idx === 0 && l.province && (
                                <span className="ml-2 text-xs font-normal text-slate-400">
                                  {l.ward} · {l.province}
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TOURISM result cards */}
            {!isAdminResult && results.results.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {results.results.map((loc, i) => (
                  <div
                    key={i}
                    className="card-soft card-lift rounded-2xl p-5 animate-fade-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-xl leading-snug">
                          {loc.name}
                        </h3>
                        <p className="mt-1.5 text-base text-slate-600 inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-500" />
                          <span className="truncate">
                            {[loc.ward, loc.province].filter(Boolean).join(', ') || 'Việt Nam'}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          loc.confidence >= 0.85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : loc.confidence >= 0.6
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {(loc.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        {loc.source.split('_').join(' ')}
                      </span>
                      <div className="flex gap-2">
                        {loc.lat != null && loc.lng != null && (
                          <a
                            href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white brand-gradient hover:opacity-95"
                          >
                            <Navigation className="h-3.5 w-3.5" /> Bản đồ
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            `${loc.name} ${loc.province || ''}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
                        >
                          <Globe className="h-3.5 w-3.5" /> Tìm hiểu
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {results.results.length === 0 && (
              <div className="card-soft rounded-3xl py-14 text-center animate-fade-up">
                <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-700 font-medium">Không tìm thấy kết quả</p>
                <p className="text-sm text-slate-400 mt-1">
                  Thử từ khóa khác hoặc chọn một gợi ý phía trên
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
