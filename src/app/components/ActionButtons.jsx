'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ActionButtons({ isLoggedIn }) {
    const router = useRouter();

    // 🔒 Auth check before navigating
    const handleActionClick = (path) => {
        const hasCookie = Cookies.get('user');

        if (!isLoggedIn && !hasCookie) {
            const confirmLogin = confirm(
                `🔒 Please log in before continuing.\nWould you like to go to the login page now?`
            );

            if (confirmLogin) {
                router.push('/login');
            }
            return;
        }

        router.push(path);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">

            {/* 🆘 SOS BUTTON */}
            <button
                onClick={() => handleActionClick('/sos')}
                className="bg-linear-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white py-3 rounded-xl font-bold text-[10px] border border-red-500 shadow-lg active:scale-95 transition-all"
            >
                🆘 Request Help
            </button>

            {/* ⚠️ DISASTER REPORT BUTTON */}
            <button
                onClick={() => handleActionClick('/report')}
                className="bg-linear-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white py-3 rounded-xl font-bold text-[10px] border border-yellow-500 shadow-lg active:scale-95 transition-all"
            >
                🛡️ Report Disaster
            </button>

        </div>
    );
}