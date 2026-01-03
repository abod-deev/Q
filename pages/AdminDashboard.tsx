
import React, { useState, useMemo, useEffect } from 'react';
import { Order, OrderStatus, Store, Driver, DriverStatus } from '../types';
import { MOCK_STORES } from '../constants';
import { useLanguage } from '../components/LanguageContext';
import MapComponent from '../components/MapComponent';
import Tracking from './Tracking';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Store as StoreIcon,
  Check,
  X,
  Truck,
  Map as MapIcon,
  Navigation,
  ExternalLink,
  Bike,
  Car,
  Clock,
  UserPlus,
  ShieldCheck,
  User,
  Radar,
  ChevronLeft
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

type TravelMode = 'moto' | 'car' | 'bicycle';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, setOrders }) => {
  const { t, lang } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'drivers' | 'map'>('analytics');
  
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 'D1', name: 'أحمد علي', phone: '777123456', status: DriverStatus.ACTIVE, vehicle: 'motorcycle', totalDistance: 120, walletBalance: 4500 },
    { id: 'D2', name: 'سامي منصور', phone: '770987654', status: DriverStatus.BUSY, vehicle: 'car', currentOrderId: 'ORD-XYZ', totalDistance: 350, walletBalance: 8200 },
    { id: 'D3', name: 'كمال حسن', phone: '771112233', status: DriverStatus.OFFLINE, vehicle: 'bicycle', totalDistance: 45, walletBalance: 1200 },
  ]);

  const [driverLocations, setDriverLocations] = useState<Record<string, [number, number]>>({
    'D1': [15.3484, 44.1790],
    'D2': [15.3620, 44.2050],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocations(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          next[id] = [
            next[id][0] + (Math.random() - 0.5) * 0.001,
            next[id][1] + (Math.random() - 0.5) * 0.001
          ];
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: t('revenue'), value: orders.reduce((s, o) => s + o.total, 0) + ' ' + t('currency'), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: t('orders_count'), value: orders.length, icon: ShoppingBag, color: 'text-orange-600 bg-orange-50' },
    { label: t('active_drivers'), value: drivers.filter(d => d.status !== DriverStatus.OFFLINE).length, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: t('stores'), value: MOCK_STORES.length, icon: StoreIcon, color: 'text-purple-600 bg-purple-50' },
  ];

  const updateOrderStatus = (orderId: string, status: OrderStatus, driverId?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, driverId: driverId || o.driverId } : o));
    
    if (driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === driverId) return { ...d, status: DriverStatus.BUSY, currentOrderId: orderId };
        return d;
      }));
    }

    if (status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) {
      const order = orders.find(o => o.id === orderId);
      if (order?.driverId) {
        setDrivers(prev => prev.map(d => {
          if (d.id === order.driverId) return { ...d, status: DriverStatus.ACTIVE, currentOrderId: undefined };
          return d;
        }));
      }
    }
  };

  if (showOrderDetails && selectedOrder) {
    return <Tracking order={selectedOrder} onBack={() => setShowOrderDetails(false)} />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('admin')}</h2>
          <div className="flex flex-wrap gap-6 mt-4">
            {[
              { id: 'analytics', label: (lang === 'ar' ? 'التحليلات' : 'Analytics'), icon: TrendingUp },
              { id: 'drivers', label: (lang === 'ar' ? 'المناديب' : 'Drivers'), icon: Bike },
              { id: 'map', label: (lang === 'ar' ? 'الخريطة الحية' : 'Live Map'), icon: Radar }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-sm font-black pb-2 border-b-4 transition-all ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-700 w-fit">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
          <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Sana'a Control Center</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className={`p-5 rounded-[1.5rem] transition-transform group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'map' ? (
            <div className="h-[650px] bg-white dark:bg-gray-800 rounded-[3rem] overflow-hidden border-8 border-white dark:border-gray-700 shadow-2xl relative">
              <MapComponent 
                readOnly
                center={[15.3694, 44.1910]}
                markers={Object.entries(driverLocations).map(([id, pos]) => ({
                  lat: pos[0], lng: pos[1], label: `Driver ${id}`, iconType: 'store'
                }))}
              />
            </div>
          ) : activeTab === 'drivers' ? (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-3xl font-black mb-10 text-gray-900 dark:text-white">{lang === 'ar' ? 'إدارة فريق التوصيل' : 'Rider Management'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drivers.map(driver => (
                  <div key={driver.id} className="p-8 rounded-[2rem] border-2 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 hover:border-orange-500 transition-all group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                          driver.status === DriverStatus.ACTIVE ? 'bg-green-500' :
                          driver.status === DriverStatus.BUSY ? 'bg-orange-500' : 'bg-gray-400'
                        }`}>
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="font-black text-xl text-gray-900 dark:text-white">{driver.name}</p>
                          <p className="text-sm text-gray-500 font-bold ltr">{driver.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-3xl font-black mb-10 text-gray-900 dark:text-white">{lang === 'ar' ? 'تحليلات الأداء' : 'Performance'}</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'السبت', sales: 45000 }, { name: 'الأحد', sales: 52000 }, { name: 'الاثنين', sales: 38000 }, { name: 'الثلاثاء', sales: 41000 }, { name: 'الأربعاء', sales: 49000 }, { name: 'الخميس', sales: 62000 }, { name: 'الجمعة', sales: 58000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 900}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f97316', opacity: 0.1}} contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }} />
                    <Bar dataKey="sales" fill="#f97316" radius={[15, 15, 0, 0]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Orders List Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-50 dark:border-gray-700 flex flex-col h-[800px]">
          <h3 className="text-2xl font-black mb-8 flex items-center justify-between text-gray-900 dark:text-white">
            {lang === 'ar' ? 'إدارة الطلبات' : 'Orders'}
            <span className="bg-orange-500 text-white text-[10px] px-3 py-1.5 rounded-full font-black">{orders.length}</span>
          </h3>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {orders.map(order => (
              <div 
                key={order.id} 
                onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                className="p-6 rounded-[2.5rem] border-4 cursor-pointer transition-all hover:-translate-y-1 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 group hover:border-orange-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-sm text-gray-900 dark:text-white">{order.id}</span>
                  <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${
                    order.status === OrderStatus.DELIVERED ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 text-xs font-black text-gray-500">
                  <div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /><span>{order.items.length} قطع</span></div>
                  <span className="text-orange-600 font-black">{order.total} {t('currency')}</span>
                </div>
                <button className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black group-hover:bg-orange-50 group-hover:border-orange-200 transition-all">
                  {lang === 'ar' ? 'عرض تتبع مباشر للطلب' : 'View Live Tracking'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
