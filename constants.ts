
import { Neighborhood, Coupon, Store } from './types';

export const SANAA_NEIGHBORHOODS: Neighborhood[] = [
  { id: 'hadda', nameAr: 'حدّة', isActive: true, baseFee: 500 },
  { id: 'sabeen', nameAr: 'السبعين', isActive: true, baseFee: 600 },
  { id: 'shumailah', nameAr: 'شميلة', isActive: true, baseFee: 700 },
  { id: 'safiah', nameAr: 'الصافية', isActive: true, baseFee: 500 },
  { id: 'tahrir', nameAr: 'التحرير', isActive: true, baseFee: 400 },
  { id: 'mathbah', nameAr: 'مذبح', isActive: true, baseFee: 800 },
];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'SANA10', discount: 10, type: 'percent' },
  { code: 'DELIVERY500', discount: 500, type: 'fixed' },
];

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'Al-Shaibani Modern',
    nameAr: 'الشيباني مودرن',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 500,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    type: 'restaurant',
    lat: 15.3484,
    lng: 44.1790,
    neighborhood: 'hadda',
    products: [
      {
        id: 'p1',
        name: 'Yemeni Saltah',
        nameAr: 'سلتة يمنية',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1541518763669-279f00ed51ca?w=400',
        description: 'Traditional clay pot stew with meat and vegetables.',
        descriptionAr: 'السلتة الصنعانية التقليدية في مقلى فخاري.',
        category: 'Main'
      },
      {
        id: 'p2',
        name: 'Mandi Chicken',
        nameAr: 'مندي دجاج',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400',
        description: 'Authentic underground smoked chicken with basmati rice.',
        descriptionAr: 'دجاج مندي أصلي مع أرز بسمتي.',
        category: 'Main'
      }
    ]
  },
  {
    id: 's2',
    name: 'Sana\'a Express Grocery',
    nameAr: 'بقالة صنعاء إكسبرس',
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: 400,
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800',
    type: 'grocery',
    lat: 15.3620,
    lng: 44.2050,
    neighborhood: 'sabeen',
    products: [
      {
        id: 'p4',
        name: 'Sana\'ani Honey',
        nameAr: 'عسل صنعاني',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
        description: 'Premium raw Sidr honey from Sana\'a mountains.',
        descriptionAr: 'عسل سدر أصلي من جبال صنعاء.',
        category: 'Main'
      }
    ]
  }
];

export const TRANSLATIONS = {
  ar: {
    search: "ابحث عن أكل يمني، بقالة...",
    categories: "الفئات",
    restaurants: "مطاعم",
    grocery: "بقالة",
    pharmacy: "صيدلية",
    express: "توصيل سريع",
    nearby: "المتاجر القريبة في صنعاء",
    cart: "السلة",
    checkout: "إتمام الطلب",
    total: "الإجمالي النهائي",
    track: "تتبع حالة الطلب",
    admin: "لوحة التحكم",
    driver_mode: "وضع المندوب",
    profile: "الملف الشخصي",
    select_location: "تحديد موقع التوصيل",
    phone: "رقم الهاتف والتحقق",
    payment: "طريقة الدفع المفضلة",
    cash: "نقداً عند الاستلام",
    wallet: "المحفظة الإلكترونية",
    confirm_order: "تأكيد وإرسال الطلب",
    delivery_fee: "رسوم التوصيل",
    currency: "ريال يمني",
    status_preparing: "قيد التحضير",
    status_out: "المندوب في الطريق",
    status_delivered: "تم التسليم بنجاح",
    status_accepted: "تم قبول الطلب",
    home_label: "المنزل",
    work_label: "العمل",
    saved_addresses: "عناوينك المحفوظة",
    apply_coupon: "إضافة كوبون خصم",
    revenue: "إجمالي الإيرادات",
    orders_count: "إجمالي الطلبات",
    active_drivers: "المناديب المتصلين",
    stores: "المتاجر",
    verify_whatsapp: "إرسال كود الواتساب",
    enter_otp: "تأكيد كود التحقق",
    otp_sent: "تم إرسال الكود بنجاح إلى",
    verify_button: "تحقق الآن",
    verified: "حساب موثق",
    not_verified: "غير موثق",
    order_details: "تفاصيل الطلب",
    order_timeline: "مسار الطلب",
    back_to_orders: "العودة للطلبات"
  },
  en: {
    search: "Search for food, groceries...",
    categories: "Categories",
    restaurants: "Restaurants",
    grocery: "Grocery",
    pharmacy: "Pharmacy",
    express: "Express",
    nearby: "Nearby in Sana'a",
    cart: "Cart",
    checkout: "Checkout",
    total: "Order Total",
    track: "Track Order",
    admin: "Admin Panel",
    driver_mode: "Driver Mode",
    profile: "My Profile",
    select_location: "Delivery Location",
    phone: "Phone & Verification",
    payment: "Payment Method",
    cash: "Cash on Delivery",
    wallet: "Digital Wallet",
    confirm_order: "Confirm Order",
    delivery_fee: "Delivery Fee",
    currency: "YER",
    status_preparing: "Preparing",
    status_out: "Driver on the way",
    status_delivered: "Delivered",
    status_accepted: "Order Accepted",
    home_label: "Home",
    work_label: "Work",
    saved_addresses: "Saved Addresses",
    apply_coupon: "Apply Coupon",
    revenue: "Revenue",
    orders_count: "Total Orders",
    active_drivers: "Active Drivers",
    stores: "Stores",
    verify_whatsapp: "Send WhatsApp Code",
    enter_otp: "Confirm OTP",
    otp_sent: "Code sent successfully to",
    verify_button: "Verify Now",
    verified: "Verified",
    not_verified: "Not Verified",
    order_details: "Order Details",
    order_timeline: "Order Journey",
    back_to_orders: "Back to Orders"
  }
};
