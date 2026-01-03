
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { 
  Store, Product, CartItem, Order, OrderStatus, Location, UserProfile 
} from './types';
import { MOCK_STORES } from './constants';
import Home from './pages/Home';
import StoreDetail from './pages/StoreDetail';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import DriverDashboard from './pages/DriverDashboard';
import { 
  ShoppingCart, User, LayoutDashboard, 
  ChevronLeft, X, Moon, Sun, Bike, Trash2, ArrowRight, Settings, MessageCircle
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { lang, t } = useLanguage();
  const [view, setView] = useState<'home' | 'store' | 'checkout' | 'tracking' | 'admin' | 'profile' | 'driver'>('home');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'زائر دليفرو',
      phone: localStorage.getItem('userPhone') || '',
      isVerified: false,
      wallet: 5000,
      savedAddresses: [],
      orderHistory: []
    };
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const [location, setLocation] = useState<Location | null>(() => {
    const saved = localStorage.getItem('userLastLocation');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartSubtotal = cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

  const handlePlaceOrder = (orderData: Partial<Order>) => {
    const fee = orderData.deliveryFee || (selectedStore?.deliveryFee || 500);
    const newOrder: Order = {
      id: `DLV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: fee,
      discount: orderData.discount || 0,
      total: cartSubtotal + fee - (orderData.discount || 0),
      status: OrderStatus.PREPARING,
      timestamp: new Date(),
      customerLocation: orderData.customerLocation || location!,
      paymentMethod: orderData.paymentMethod || 'cash',
      phone: orderData.phone || user.phone,
      storeId: selectedStore?.id || ''
    };
    setOrders(prev => [newOrder, ...prev]);
    setUser(prev => ({ ...prev, orderHistory: [newOrder, ...prev.orderHistory] }));
    setCart([]);
    setView('tracking');
    setIsCartOpen(false);
  };

  const reorder = (prevOrder: Order) => {
    setCart(prevOrder.items);
    const store = MOCK_STORES.find(s => s.id === prevOrder.storeId);
    if (store) setSelectedStore(store);
    setIsCartOpen(true);
  };

  const setVerifiedStatus = (status: boolean) => {
    setUser(prev => ({ ...prev, isVerified: status }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view !== 'home' && (
              <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <ChevronLeft className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            )}
            <h1 onClick={() => setView('home')} className="text-2xl md:text-3xl font-black text-orange-500 cursor-pointer tracking-tighter">Delivro</h1>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={() => setView('admin')} 
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${view === 'admin' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t('admin')}</span>
            </button>

            <button 
              onClick={() => setView('driver')} 
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${view === 'driver' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Bike className="w-5 h-5" />
              <span>{lang === 'ar' ? 'وضع المندوب' : 'Driver'}</span>
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block" />

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button onClick={() => setView('profile')} className={`p-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 transition-all ${view === 'profile' ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <div className="relative">
                <User className="w-5 h-5" />
                {user.isVerified && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />}
              </div>
              <span className="hidden lg:block text-sm font-bold">{user.name.split(' ')[0]}</span>
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all transform active:scale-95">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black ring-2 ring-orange-500 animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-8">
        {view === 'home' && <Home onStoreSelect={(s) => { setSelectedStore(s); setView('store'); }} location={location} />}
        {view === 'store' && selectedStore && <StoreDetail store={selectedStore} onAddToCart={addToCart} onGoBack={() => setView('home')} />}
        {view === 'checkout' && (
          <Checkout 
            onOrderPlace={handlePlaceOrder} 
            location={location} 
            total={cartSubtotal} 
            deliveryFee={selectedStore?.deliveryFee || 500} 
            user={user}
            onVerifySuccess={() => setVerifiedStatus(true)}
          />
        )}
        {view === 'tracking' && <Tracking order={orders[0]} onBack={() => setView('home')} />}
        {view === 'admin' && <AdminDashboard orders={orders} setOrders={setOrders} />}
        {view === 'driver' && <DriverDashboard orders={orders} setOrders={setOrders} />}
        {view === 'profile' && <Profile user={user} setUser={setUser} orders={orders} onReorder={reorder} onVerifySuccess={() => setVerifiedStatus(true)} />}
      </main>

      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className={`fixed inset-y-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-[60] flex flex-col animate-slide-in`}>
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <ShoppingCart className="text-orange-500" />
                {t('cart')}
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-full">
                    <ShoppingCart className="w-16 h-16" />
                  </div>
                  <p className="font-bold text-lg">{lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your cart is empty'}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-200 transition-all">
                    <img src={item.product.image} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{lang === 'ar' ? item.product.nameAr : item.product.name}</h4>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-orange-500 font-black text-sm mt-1">{item.product.price} {t('currency')}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-600 flex items-center justify-center font-bold shadow-sm hover:bg-gray-50">-</button>
                        <span className="font-black w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-600 flex items-center justify-center font-bold shadow-sm hover:bg-gray-50">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-black text-2xl text-orange-500">{cartSubtotal} {t('currency')}</span>
                </div>
                <button 
                  onClick={() => { setView('checkout'); setIsCartOpen(false); }}
                  className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-600 transition-all transform active:scale-[0.98]"
                >
                  {t('checkout')}
                  <ArrowRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t dark:border-gray-800 p-4 flex justify-around z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 p-2 ${view === 'home' ? 'text-orange-500' : 'text-gray-400'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button onClick={() => setView('driver')} className={`flex flex-col items-center gap-1 p-2 ${view === 'driver' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Bike className="w-6 h-6" />
          <span className="text-[10px] font-bold">المندوب</span>
        </button>
        <button onClick={() => setView('admin')} className={`flex flex-col items-center gap-1 p-2 ${view === 'admin' ? 'text-orange-500' : 'text-gray-400'}`}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold">الإدارة</span>
        </button>
        <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-1 p-2 ${view === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">حسابي</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <MainApp />
  </LanguageProvider>
);

export default App;
