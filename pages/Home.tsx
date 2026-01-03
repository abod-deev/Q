
import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { MOCK_STORES } from '../constants';
import { Store, Location } from '../types';
import { Utensils, ShoppingBag, Pill, Zap, Star, Clock } from 'lucide-react';

interface HomeProps {
  onStoreSelect: (store: Store) => void;
  location: Location | null;
}

const Home: React.FC<HomeProps> = ({ onStoreSelect, location }) => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'restaurant', name: t('restaurants'), icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { id: 'grocery', name: t('grocery'), icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
    { id: 'pharmacy', name: t('pharmacy'), icon: Pill, color: 'bg-red-100 text-red-600' },
    { id: 'express', name: t('express'), icon: Zap, color: 'bg-blue-100 text-blue-600' },
  ];

  const filteredStores = filter === 'all' 
    ? MOCK_STORES 
    : MOCK_STORES.filter(s => s.type === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <section className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-orange-400 to-orange-600 flex items-center px-8 text-white">
        <div className="z-10 max-w-lg">
          <h2 className="text-3xl md:text-5xl font-black mb-2">
            {lang === 'ar' ? 'جوعان؟ أبشر بعزك!' : 'Hungry? We got you!'}
          </h2>
          <p className="text-orange-100 text-lg">
            {lang === 'ar' ? 'أفضل مطاعم ومتاجر صنعاء، تصلك لبابك.' : 'Best restaurants and stores in Sana\'a, delivered to your door.'}
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden">
          <Utensils className="w-full h-full -rotate-12 translate-x-1/4" />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {t('categories')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(filter === cat.id ? 'all' : cat.id)}
              className={`flex flex-col items-center p-6 rounded-2xl transition-all border-2 ${
                filter === cat.id ? 'border-orange-500 bg-white ring-4 ring-orange-50' : 'border-transparent bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-4 rounded-full mb-3 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Stores */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black flex items-center gap-3">
            {t('nearby')}
          </h3>
          <button className="text-sm font-bold text-orange-500 hover:underline">
            {lang === 'ar' ? 'مشاهدة الكل' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map((store) => (
            <div 
              key={store.id} 
              onClick={() => onStoreSelect(store)}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-50 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={store.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={store.name}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-black text-gray-900">{store.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full font-black text-xs shadow-lg ring-2 ring-white">
                  {store.deliveryTime}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-black text-gray-900 mb-2">
                  {lang === 'ar' ? store.nameAr : store.name}
                </h4>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{t('delivery_fee')}: {store.deliveryFee} {t('currency')}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
