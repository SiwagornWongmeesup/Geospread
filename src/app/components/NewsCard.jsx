// components/NewsSidebar.jsx
'use client';

export default function NewsSidebar() {
    // 💡 ข้อมูลข่าวจำลอง (เดี๋ยวอนาคตคุณฟิวค่อยต่อ API ดึงข้อมูลจริงมาใส่แทนได้เลย)
    const newsData = [
        { 
            id: 1, 
            source: "NFLX", 
            title: "หุ้น Netflix บวก 14% หลังบริษัทได้เงินชดเชยมูลค่า 2,800 ล้านดอลลาร์ จากการยกเลิกข้อเสนอซื้อกิจการของ Warner Bros. Discovery", 
            time: "~1 วัน", 
            tag: "🔥 Hot !" 
        },
        { 
            id: 2, 
            source: "AAPL", 
            title: "Apple เตรียมเปิดตัวฟีเจอร์ AI ใหม่ในระบบปฏิบัติการ iOS รุ่นถัดไป คาดอัปเดตใหญ่เดือนหน้า", 
            time: "~3 ชม.", 
            tag: "New" 
        },
        { 
            id: 3, 
            source: "WTHR", 
            title: "ประกาศเตือนภัยพายุฤดูร้อน รักษาระยะห่างจากป้ายโฆษณาและต้นไม้ใหญ่ในเขตกรุงเทพและปริมณฑล", 
            time: "~5 ชม.", 
            tag: "🚨 เตือนภัย" 
        },
        { 
            id: 4, 
            source: "TSLA", 
            title: "Tesla หั่นราคารถยนต์ไฟฟ้า Model Y ลงอีก 10% กระตุ้นยอดขายไตรมาสสุดท้าย", 
            time: "~12 ชม.", 
            tag: "" 
        },
        { 
            id: 5, 
            source: "GOOG", 
            title: "Google เผยโฉมโมเดลภาษาขนาดใหญ่รุ่นใหม่ เก่งกว่าเดิม 3 เท่า รองรับภาษาไทยสมบูรณ์แบบ", 
            time: "~1 วัน", 
            tag: "" 
        }
    ];

    return (
        <div className="flex flex-col w-full pb-4"> 
            
            {/* รายการข่าว (flex-col เพื่อให้เรียงจากบนลงล่าง) */}
            <div className="flex flex-col gap-3">
                {newsData.map((news) => (
                    <div 
                        key={news.id} 
                        className="w-full bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 shadow-lg flex flex-col justify-between group cursor-pointer hover:border-red-900/40 hover:bg-[#222] transition-all"
                    >
                        
                        {/* ส่วนหัวของการ์ดข่าว (โลโก้ + ชื่อ + Tag) */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-[9px] font-bold shadow-sm text-white">
                                    {news.source.charAt(0)} {/* ดึงตัวอักษรแรกมาทำโลโก้ */}
                                </div>
                                <span className="text-xs font-bold text-white">{news.source}</span>
                                {news.tag && (
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ml-1 ${
                                        news.tag.includes('เตือนภัย') 
                                        ? 'bg-red-900/50 text-red-400 border-red-500/30' // สีแดงถ้าเป็นเตือนภัย
                                        : 'bg-[#4d3319] text-[#ff9933] border-[#ff9933]/20' // สีส้มไฟสำหรับข่าว Hot
                                    }`}>
                                        {news.tag}
                                    </span>
                                )}
                            </div>
                            
                            {/* ไอคอนลูกศร (จะสว่างขึ้นตอนเอาเมาส์ชี้) */}
                            <div className="text-gray-600 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* หัวข้อข่าว */}
                        <h3 className="text-[13px] font-medium leading-relaxed text-gray-200 line-clamp-3">
                            {news.title}
                        </h3>
                        
                        {/* ข้อมูลด้านล่าง (แหล่งที่มา + เวลา) */}
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 border-t border-gray-800/50 pt-2">
                            <span className="underline decoration-gray-700 underline-offset-4 hover:text-gray-300">
                                bloomberg.com
                            </span>
                            <span>•</span>
                            <span>{news.time}</span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}