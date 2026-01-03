
import React from 'react';
import { Order, OrderStatus } from '../types';
import { useLanguage } from '../components/LanguageContext';
import { MapPin, Truck, CheckCircle, Navigation, PhoneCall } from 'lucide-react';
import MapComponent from '../components/MapComponent';

interface DriverDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ orders, setOrders }) => {
  const { t, lang } = useLanguage();
  const activeOrders = orders.filter(o => o.status === OrderStatus.PREPARING || o.status === OrderStatus.OUT_FOR_DELIVERY);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">{t('driver_mode')}</h2>
        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 px-4 py-2 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold">{lang === 'ar' ? 'متصل' : 'Online'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">{lang === 'ar' ? 'الطلبات المتاحة' : 'Available Tasks'}</h3>
          {activeOrders.length === 0 ? (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl text-center">
              <Truck className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{lang === 'ar' ? 'لا توجد طلبات حالياً' : 'No tasks available'}</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-orange-500">{order.id}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{order.status}</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{order.customerLocation.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span>{lang === 'ar' ? 'المسافة: 3.2 كم' : 'Dist: 3.2 km'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {order.status === OrderStatus.PREPARING ? (
                    <button 
                      onClick={() => updateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all"
                    >
                      {lang === 'ar' ? 'استلام الطلب' : 'Accept Task'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(order.id, OrderStatus.DELIVERED)}
                      className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {lang === 'ar' ? 'تم التوصيل' : 'Completed'}
                    </button>
                  )}
                  <a href={`tel:${order.phone}`} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-500">
                    <PhoneCall className="w-6 h-6" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm min-h-[500px]">
          <MapComponent 
            readOnly 
            center={[15.3694, 44.1910]}
            markers={activeOrders.map(o => ({
              lat: o.customerLocation.lat,
              lng: o.customerLocation.lng,
              label: o.id,
              iconType: 'customer'
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
