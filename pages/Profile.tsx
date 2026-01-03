
import React, { useState } from 'react';
// Added OrderStatus to the types import
import { UserProfile, Order, OrderStatus } from '../types';
import { useLanguage } from '../components/LanguageContext';
import Tracking from './Tracking';
import { Wallet, MapPin, History, LogOut, ChevronRight, RotateCcw, ShieldCheck, ShieldAlert, MessageCircle, ExternalLink } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  orders: Order[];
  onReorder: (order: Order) => void;
  onVerifySuccess: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, orders, onReorder, onVerifySuccess }) => {
  const { t, lang } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return <Tracking order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border dark:border-gray-700">
        <div className="relative">
          <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center text-orange-500 text-4xl font-black shadow-inner">
            {user.name[0]}
          </div>
          {user.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white dark:border-gray-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black">{user.name}</h2>
            {user.isVerified ? (
              <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">{t('verified')}</span>
            ) : (
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">{t('not_verified')}</span>
            )}
          </div>
          <p className="text-gray-500 font-bold mt-1">{user.phone || (lang === 'ar' ? 'لم يتم ربط رقم' : 'No phone linked')}</p>
        </div>
      </div>

      {!user.isVerified && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl text-orange-500 shadow-sm"><ShieldAlert /></div>
            <div>
              <h4 className="font-black">{lang === 'ar' ? 'وثق حسابك الآن' : 'Verify your account'}</h4>
              <p className="text-sm text-gray-500">{lang === 'ar' ? 'يجب التحقق من رقمك عبر الواتساب لتتمكن من الطلب' : 'WhatsApp verification is required to place orders'}</p>
            </div>
          </div>
          <button 
            onClick={() => alert(lang === 'ar' ? 'يرجى التوجه لصفحة الدفع للتحقق' : 'Please verify during checkout')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {t('verify_whatsapp')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <Wallet className="w-8 h-8" />
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">{t('wallet')}</span>
          </div>
          <p className="text-4xl font-black mb-2">{user.wallet} {t('currency')}</p>
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md">
            {lang === 'ar' ? 'شحن الرصيد' : 'Top Up'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border dark:border-gray-700 space-y-2">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all text-gray-900 dark:text-white">
            <div className="flex items-center gap-4 text-blue-500">
              <MapPin className="w-6 h-6" />
              <span className="font-bold">{t('saved_addresses')}</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-300 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
          <button className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all">
            <div className="flex items-center gap-4">
              <LogOut className="w-6 h-6" />
              <span className="font-bold">{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border dark:border-gray-700">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
          <History className="text-orange-500" />
          {lang === 'ar' ? 'سجل الطلبات' : 'Order History'}
        </h3>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <History className="w-16 h-16 mx-auto mb-2" />
              <p className="font-bold">{lang === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders'}</p>
            </div>
          ) : (
            orders.map(order => (
              <div 
                key={order.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-gray-100 dark:border-gray-700 rounded-3xl gap-4 hover:border-orange-200 transition-all group relative"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl group-hover:bg-orange-50 transition-colors">
                    <History className="w-6 h-6 text-gray-400 group-hover:text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-lg text-gray-900 dark:text-white">{order.id}</p>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 text-xs font-black text-blue-500 hover:text-blue-600 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('track')}
                  </button>
                  <button 
                    onClick={() => onReorder(order)}
                    className="bg-gray-900 dark:bg-orange-500 text-white p-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 font-black text-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'إعادة طلب' : 'Reorder'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
