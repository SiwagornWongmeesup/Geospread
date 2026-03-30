'use client';

import ActionButtons from "./ActionButtons";
import TabbedPanel from "./TabbedPanel";

export default function Sidebar({ isSidebarOpen, incidents, setSelectedIncident, isLoggedIn }) {
    
    return (
        <aside 
            className={`
                hidden md:flex flex-col z-30 border-r border-red-900/50 shrink-0 transition-all duration-300 ease-in-out bg-black/20 backdrop-blur-sm
                ${isSidebarOpen ? 'w-[320px]' : 'w-0 border-none opacity-0'} 
            `}
        >
            {/* 💡 หุ้มเนื้อหาไว้ใน div ที่ล็อคความกว้าง เพื่อไม่ให้เนื้อหาบีบตัวตอนปิด Sidebar */}
            <div className={`flex flex-col h-full w-[320px] transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                
                <div className={`flex flex-col h-full w-[320px] transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               
                    <TabbedPanel incidents={incidents} setSelectedIncident={setSelectedIncident} isLoggedIn={isLoggedIn} />
                </div>

                
                <div className="p-4 bg-black/40 shrink-0">
                    <ActionButtons />
                </div>
            </div>
        </aside>
    );
}

