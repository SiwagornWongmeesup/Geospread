'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Users,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 🚀 MENU CONFIG (REAL APP STYLE)
  const menuItems = [
    {
      name: 'ภาพรวมระบบ',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'แผนที่',
      href: '/admin/map',
      icon: MapPin,
    },
    {
      name: 'จัดการเหตุการณ์',
      icon: AlertTriangle,
      submenu: [
        { name: 'คำขอช่วยเหลือ', href: '/admin/requests' },
        { name: 'รายงานเหตุการณ์', href: '/admin/reports' },
      ],
    },
    {
      name: 'ผู้ใช้งาน',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'สถิติ',
      href: '/admin/stats',
      icon: TrendingUp,
    },
  ];

  const isActive = (href) => pathname === href;

  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      Cookies.remove('user');
      Cookies.remove('token');

      localStorage.clear();

      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 hidden lg:flex flex-col">

      {/* LOGO */}
      <div className="p-6">
        <h1 className="text-2xl font-black italic text-red-600">
          Geo<span className="text-white">Spread</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Admin Control Center
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          // 🔹 HAS SUBMENU
          if (item.submenu) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-slate-300 hover:bg-slate-900"
                >
                  {Icon && <Icon size={18} />}
                  {item.name}
                </button>

                {openMenus[item.name] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => router.push(sub.href)}
                        className={`w-full text-left text-sm p-2 rounded-xl transition ${
                          isActive(sub.href)
                            ? 'bg-red-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // 🔹 NORMAL MENU
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {Icon && <Icon size={18} />}
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* PROFILE + LOGOUT */}
      <div className="p-4 border-t border-slate-800">

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <p className="font-bold text-sm">Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center gap-3 p-3 rounded-2xl hover:bg-red-600/20 transition text-slate-400 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </aside>
  );
}