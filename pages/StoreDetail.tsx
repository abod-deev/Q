
import React from 'react';
import { Store, Product } from '../types';
import { useLanguage } from '../components/LanguageContext';
import { Plus, Star, Clock, Info } from 'lucide-react';

interface StoreDetailProps {
  store: Store;
  onAddToCart: (product: Product) => void;
  onGoBack: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ store, onAddToCart, onGoBack }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg mb-8">
        <img src={store.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-black">
              {lang === 'ar' ? store.nameAr : store.name}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {store.rating}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              {store.deliveryTime}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              {t('delivery_fee')}: {store.deliveryFee} {t('currency')}
            </span>
          </div>
        </div>
      </div>

      {/* Menu / Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Menu Navigation (Desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-24 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 px-2 uppercase text-xs text-gray-400 tracking-widest">{lang === 'ar' ? 'الفئات' : 'Categories'}</h3>
            <ul className="space-y-1">
              <li><button className="w-full text-left px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-bold">Main Dishes</button></li>
              <li><button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50">Sides</button></li>
              <li><button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50">Drinks</button></li>
              <li><button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50">Desserts</button></li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3 space-y-12">
          {['Main', 'Sides', 'Drinks'].map((cat) => (
            <div key={cat}>
              <h3 className="text-2xl font-bold mb-6 border-b pb-2">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {store.products.filter(p => p.category === cat).map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <img src={product.image} className="w-24 h-24 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{lang === 'ar' ? product.nameAr : product.name}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {lang === 'ar' ? product.descriptionAr : product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-orange-500">{product.price} {t('currency')}</span>
                        <button 
                          onClick={() => onAddToCart(product)}
                          className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
