
import React, { useState, useEffect } from 'react';
import { Location, Order, UserProfile } from '../types';
import { useLanguage } from '../components/LanguageContext';
import MapComponent from '../components/MapComponent';
import { 
  CreditCard, Wallet, Phone, MapPin, Notebook, 
  CheckCircle2, MessageCircle, ShieldCheck, Loader2, X, Send, Info 
} from 'lucide-react';

interface CheckoutProps {
  onOrderPlace: (data: Partial<Order>) => void;
  location: Location | null;
  total: number;
  deliveryFee: number;
  user: UserProfile;
  onVerifySuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onOrderPlace, location, total, deliveryFee, user, onVerifySuccess }) => {
  const { t, lang } = useLanguage();
  const [phone, setPhone] = useState(user.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(location);
  
  // Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const startTimer = () => setTimer(60);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleLocationUpdate = (lat: number, lng: number, address: string) => {
    const newLoc = { lat, lng, address };
    setSelectedLoc(newLoc);
    localStorage.setItem('userLastLocation', JSON.stringify(newLoc));
  };

  const requestOtp = () => {
    if (phone.length < 9) return;
    setIsVerifying(true);
    
    // توليد رمز عشوائي مكون من 6 أرقام
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // محاكاة الإرسال "الحقيقي": فتح رابط واتساب مع الرقم والرسالة
    setTimeout(() => {
      const fullNumber = `967${phone}`;
      const message = lang === 'ar' 
        ? `مرحباً بك في دليفرو! كود التحقق الخاص بك هو: [ ${newOtp} ] . يرجى إدخاله في التطبيق لإكمال الطلب.` 
        : `Welcome to Delivro! Your verification code is: [ ${newOtp} ] . Please enter it in the app to complete your order.`;
      
      // فتح واتساب في نافذة جديدة
      window.open(`https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`, '_blank');
      
      setIsVerifying(false);
      setShowOtpModal(true);
      startTimer();
    }, 1000);
  };

  const confirmOtp = () => {
    // التحقق من الكود المولد أو الكود التجريبي 123456
    if (otp === generatedOtp || otp === '123456') {
      onVerifySuccess();
      setShowOtpModal(false);
    } else {
      alert(lang === 'ar' ? 'عذراً، الرمز غير صحيح. يرجى التأكد من الرسالة الواردة في واتساب.' : 'Invalid code. Please check your WhatsApp message.');
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedLoc || !phone || !user.isVerified) return;
    onOrderPlace({ 
      phone: `+967${phone}`, 
      paymentMethod,
      customerLocation: { ...selectedLoc, deliveryNote }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-arabic">
      {/* نافذة إدخال كود التحقق (OTP Modal) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md" onClick={() => setShowOtpModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl max-w-md w-full animate-fade-in border border-gray-100 dark:border-gray-700">
            <button onClick={() => setShowOtpModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-orange-500 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
                <MessageCircle className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('enter_otp')}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold">
                  {lang === 'ar' ? 'أرسلنا رسالة واتساب للرقم:' : 'WhatsApp sent to:'}
                  <br/>
                  <span className="text-gray-900 dark:text-white text-xl ltr inline-block mt-2 font-black">+967 {phone}</span>
                </p>
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-4xl font-black tracking-[0.4em] py-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-[2rem] border-4 border-gray-100 dark:border-gray-700 focus:border-green-500 outline-none transition-all shadow-inner"
                  placeholder="000000"
                />
              </div>

              <button 
                onClick={confirmOtp}
                className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-green-200 dark:shadow-none hover:bg-green-700 transition-all transform active:scale-95 flex items-center justify-center gap-3"
              >
                <ShieldCheck className="w-6 h-6" />
                {t('verify_button')}
              </button>
              
              {timer > 0 ? (
                <p className="text-sm font-black text-gray-400">
                  {lang === 'ar' ? `إعادة الإرسال بعد ${timer} ثانية` : `Resend in ${timer}s`}
                </p>
              ) : (
                <button onClick={requestOtp} className="text-sm font-black text-green-600 hover:underline">
                  {lang === 'ar' ? 'إعادة إرسال الرمز عبر واتساب' : 'Resend code via WhatsApp'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* عنوان الصفحة */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{t('checkout')}</h2>
        <div className="h-2 flex-1 bg-orange-500/10 dark:bg-gray-700 rounded-full mt-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          
          {/* قسم الهاتف والتحقق - تصميم محسن عالي التباين */}
          <section className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
                <Phone className="text-orange-500 w-7 h-7" />
                {t('phone')}
              </h3>
              {user.isVerified && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/30 px-5 py-2 rounded-full text-sm font-black border-2 border-green-100 dark:border-green-800">
                  <ShieldCheck className="w-5 h-5" />
                  {t('verified')}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="relative flex-1 flex shadow-sm rounded-[1.5rem] overflow-hidden">
                 <div className="bg-gray-100 dark:bg-gray-700 border-2 border-r-0 border-gray-100 dark:border-gray-600 px-6 flex items-center font-black text-gray-600 dark:text-gray-300 ltr text-lg">
                  +967
                 </div>
                 <input 
                  type="tel" 
                  placeholder="7XXXXXXXX"
                  value={phone}
                  readOnly={user.isVerified}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 py-6 px-6 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-black text-2xl text-gray-900 dark:text-white ltr ${user.isVerified ? 'opacity-60 grayscale' : ''}`}
                />
              </div>
              {!user.isVerified && (
                <button 
                  onClick={requestOtp}
                  disabled={isVerifying || phone.length < 9}
                  className="bg-green-600 text-white px-10 py-6 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-all disabled:opacity-50 shadow-xl shadow-green-100 dark:shadow-none transform active:scale-95"
                >
                  {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageCircle className="w-6 h-6" />}
                  <span className="whitespace-nowrap">{t('verify_whatsapp')}</span>
                </button>
              )}
            </div>
            
            {!user.isVerified && (
              <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                {/* Fixed the missing 'Info' icon error by importing it from lucide-react */}
                <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                  {lang === 'ar' 
                    ? 'سيقوم النظام بفتح واتساب لإرسال كود التحقق. هذه العملية مجانية بالكامل لضمان وصول المندوب إليك بدقة.' 
                    : 'The system will open WhatsApp to send the verification code. This process is free and ensures accuracy.'}
                </p>
              </div>
            )}
          </section>

          {/* قسم تحديد الموقع */}
          <section className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900 dark:text-white">
              <MapPin className="text-orange-600 w-8 h-8" />
              {t('select_location')}
            </h3>
            <div className="h-[450px] mb-8 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-inner">
              <MapComponent 
                center={selectedLoc ? [selectedLoc.lat, selectedLoc.lng] : [15.3694, 44.1910]}
                onLocationSelect={handleLocationUpdate}
              />
            </div>
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب تفاصيل إضافية (رقم الشقة، الدور، معلم بارز)...' : 'Add details (Apt, Floor, Landmark)...'}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700 rounded-[2rem] p-6 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 min-h-[140px] font-bold transition-all text-lg"
            />
          </section>

          {/* طريقة الدفع */}
          <section className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-black mb-8 text-gray-900 dark:text-white">{t('payment')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`p-8 rounded-[2rem] border-4 transition-all flex items-center gap-6 group ${
                  paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'border-gray-100 dark:border-gray-700 text-gray-400 hover:border-orange-200'
                }`}
              >
                <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === 'cash' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Wallet className="w-8 h-8" />
                </div>
                <span className="font-black text-2xl">{t('cash')}</span>
              </button>
            </div>
          </section>
        </div>

        {/* جانب ملخص الطلب - تصميم عائم */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-50 dark:border-gray-700 sticky top-24">
            <h3 className="text-3xl font-black mb-10 border-b-4 border-orange-500/10 dark:border-gray-700 pb-6 text-gray-900 dark:text-white">
              {lang === 'ar' ? 'ملخص طلبك' : 'Your Order'}
            </h3>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center font-bold text-gray-500 dark:text-gray-400 text-lg">
                <span>{lang === 'ar' ? 'مجموع المنتجات' : 'Products'}</span>
                <span className="text-gray-900 dark:text-white">{total} {t('currency')}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-gray-500 dark:text-gray-400 text-lg">
                <span>{t('delivery_fee')}</span>
                <span className="text-gray-900 dark:text-white">{deliveryFee} {t('currency')}</span>
              </div>
              <div className="pt-8 mt-8 border-t-4 border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-baseline">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{t('total')}</span>
                <span className="text-5xl font-black text-orange-600 tracking-tighter">{total + deliveryFee} {t('currency')}</span>
              </div>
            </div>
            
            <button 
              disabled={!phone || !selectedLoc || !user.isVerified}
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 text-white font-black text-2xl py-8 rounded-[2rem] shadow-2xl shadow-orange-200 dark:shadow-none hover:bg-orange-600 transition-all transform active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-4"
            >
              <Send className="w-8 h-8" />
              {user.isVerified ? t('confirm_order') : lang === 'ar' ? 'تحقق للمتابعة' : 'Verify First'}
            </button>

            {!user.isVerified && (
              <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-[2rem] border-2 border-orange-100 dark:border-orange-800 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-orange-500 shrink-0" />
                <p className="text-sm font-black text-orange-800 dark:text-orange-200 leading-relaxed">
                  {lang === 'ar' 
                    ? 'يرجى توثيق هاتفك لتتمكن من إرسال طلبك إلى المطبخ مباشرة.' 
                    : 'Please verify your phone to send your order to the kitchen.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
