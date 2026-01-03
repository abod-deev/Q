
import React, { useState, useEffect, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { useLanguage } from '../components/LanguageContext';
import MapComponent from '../components/MapComponent';
import { MOCK_STORES } from '../constants';
import { 
  Package, Bike, CheckCircle, AlertTriangle, 
  MapPin, Phone, Navigation, Clock, ChevronRight, 
  Store as StoreIcon, Receipt, User
} from 'lucide-react';

interface TrackingProps {
  order?: Order;
  onBack?: () => void;
}

const Tracking: React.FC<TrackingProps> = ({ order, onBack }) => {
  const { t, lang } = useLanguage();
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [progress, setProgress] = useState(0);

  const store = useMemo(() => 
    MOCK_STORES.find(s => s.id === order?.storeId) || MOCK_STORES[0]
  , [order]);

  useEffect(() => {
    if (order?.status === OrderStatus.OUT_FOR_DELIVERY) {
      const startPos: [number, number] = [store.lat, store.lng];
      const endPos: [number, number] = [order.customerLocation.lat, order.customerLocation.lng];
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 0.01;
        if (currentProgress >= 1) {
          currentProgress = 1;
          clearInterval(interval);
        }
        const lat = startPos[0] + (endPos[0] - startPos[0]) * currentProgress;
        const lng = startPos[1] + (endPos[1] - startPos[1]) * currentProgress;
        setDriverPos([lat, lng]);
        setProgress(Math.round(currentProgress * 100));
      }, 1000);
      return () => clearInterval(interval);
    } else if (order?.status === OrderStatus.DELIVERED) {
      setDriverPos([order.customerLocation.lat, order.customerLocation.lng]);
      setProgress(100);
    } else {
      setDriverPos([store.lat, store.lng]);
      setProgress(0);
    }
  }, [order?.status, store, order?.customerLocation]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
        <p>{lang === 'ar' ? 'لم يتم العثور على الطلب' : 'Order not found'}</p>
        <button onClick={onBack} className="mt-4 text-orange-500 font-bold hover:underline">{t('back_to_orders')}</button>
      </div>
    );
  }

  const timelineSteps = [
    { key: 'ACCEPTED', label: t('status_accepted'), icon: Receipt, active: true, time: '10:00 AM' },
    { key: OrderStatus.PREPARING, label: t('status_preparing'), icon: Package, active: true, time: '10:05 AM' },
    { key: OrderStatus.OUT_FOR_DELIVERY, label: t('status_out'), icon: Bike, active: order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.DELIVERED, time: order.status === OrderStatus.OUT_FOR_DELIVERY ? '10:20 AM' : '10:20 AM' },
    { key: OrderStatus.DELIVERED, label: t('status_delivered'), icon: CheckCircle, active: order.status === OrderStatus.DELIVERED, time: order.status === OrderStatus.DELIVERED ? '10:45 AM' : '' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10 px-4">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-black"
        >
          <ChevronRight className={`w-6 h-6 ${lang === 'ar' ? '' : 'rotate-180'}`} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border dark:border-gray-700">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-black text-gray-600 dark:text-gray-300">
            {new Date(order.timestamp).toLocaleTimeString(lang === 'ar' ? 'ar-YE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tracking & Timeline */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Map Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border-4 border-white dark:border-gray-700 overflow-hidden relative h-[500px]">
             <MapComponent 
                readOnly 
                center={driverPos || [15.3694, 44.1910]}
                markers={[
                  { lat: order.customerLocation.lat, lng: order.customerLocation.lng, label: 'موقع التوصيل', iconType: 'customer' },
                  { lat: store.lat, lng: store.lng, label: store.nameAr, iconType: 'store' },
                  ...(driverPos ? [{ lat: driverPos[0], lng: driverPos[1], label: 'المندوب', iconType: 'store' as const }] : [])
                ]}
                polyline={[[store.lat, store.lng], [order.customerLocation.lat, order.customerLocation.lng]]}
              />
              {order.status === OrderStatus.OUT_FOR_DELIVERY && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white z-[1000]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <Navigation className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{lang === 'ar' ? 'الحالة الحالية' : 'Current Status'}</p>
                      <p className="text-sm font-black text-gray-900">{lang === 'ar' ? 'المندوب يقترب من موقعك' : 'Rider approaching'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-orange-600">{100 - progress}%</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase">{lang === 'ar' ? 'متبقي' : 'Left'}</p>
                  </div>
                </div>
              )}
          </div>

          {/* Timeline Card */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-gray-900 dark:text-white">
              <Clock className="text-orange-500 w-8 h-8" />
              {t('order_timeline')}
            </h3>
            <div className="relative space-y-8">
              <div className="absolute top-2 bottom-2 right-6 w-1 bg-gray-100 dark:bg-gray-700" />
              {timelineSteps.map((step, idx) => (
                <div key={idx} className={`relative flex items-center gap-8 ${step.active ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    step.active ? 'bg-orange-500 text-white shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-black text-lg ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step.label}</p>
                    {step.time && <p className="text-xs font-bold text-gray-400">{step.time}</p>}
                  </div>
                  {step.active && idx === timelineSteps.filter(s => s.active).length - 1 && (
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                      {lang === 'ar' ? 'الآن' : 'Now'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="lg:col-span-4 space-y-8">
           {/* Store Info */}
           <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden">
                <img src={store.image} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-xl text-gray-900 dark:text-white">{lang === 'ar' ? store.nameAr : store.name}</h4>
                <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <StoreIcon className="w-3 h-3" />
                  {store.neighborhood}
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-700">
               {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md font-black text-[10px]">{item.quantity}x</span>
                      <span className="font-bold text-gray-600 dark:text-gray-300">{lang === 'ar' ? item.product.nameAr : item.product.name}</span>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white">{item.product.price * item.quantity} {t('currency')}</span>
                  </div>
               ))}
            </div>
            <div className="pt-6 mt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="font-black text-gray-400 uppercase text-xs">{t('total')}</span>
              <span className="text-2xl font-black text-orange-600">{order.total} {t('currency')}</span>
            </div>
          </div>

          {/* Customer & Location */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{lang === 'ar' ? 'معلومات التوصيل' : 'Delivery Info'}</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400">{lang === 'ar' ? 'العميل' : 'Customer'}</p>
                  <p className="font-black text-gray-900 dark:text-white">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400">{lang === 'ar' ? 'العنوان' : 'Address'}</p>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-tight">{order.customerLocation.address}</p>
                  {order.customerLocation.deliveryNote && (
                    <p className="text-xs text-orange-500 mt-2 font-bold italic">"{order.customerLocation.deliveryNote}"</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Card (If assigned) */}
          {(order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.DELIVERED) && (
             <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-100 dark:shadow-none">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <Bike className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{lang === 'ar' ? 'المندوب المباشر' : 'Live Rider'}</p>
                    <p className="text-xl font-black">بسام الصنعاني</p>
                    <div className="flex items-center gap-2 text-xs font-bold mt-1 text-blue-100">
                      <CheckCircle className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'متصل وحركته مراقبة' : 'Online & Tracked'}</span>
                    </div>
                  </div>
                  <a href={`tel:777000000`} className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
