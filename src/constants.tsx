
export const BUSINESS_DETAILS = {
  name: "JJ Kitchen Appliances - Premium Kitchen Gallery",
  shortName: "JJ Gallery Ravet",
  establishedYear: "2021",
  address: "Opposite BRT Bus Stand, Shop No 10, Kohinoor Grandeur, Mukai Chowk, Ravet, Pune, Maharashtra 412101",
  phone: "724 898 3407",
  secondaryPhone: "962 345 4371",
  email: "He_jani2523@yahoo.in",
  rating: 4.9,
  reviewsCount: 105,
  hours: "10 AM - 9 PM",
  whatsapp: "https://wa.me/917248983407?text=Hi%20JJ%20Kitchen%2C%20I%27m%20interested%20in%20your%20products"
};

export const SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
  twitter: "",
};

export interface BranchLocation {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  mapUrl: string;
}

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    name: "Ravet",
    address: "Shop No. 10, Kohinoor Grandeur, Ravet, Pune, Maharashtra 412101",
    phone: `${BUSINESS_DETAILS.phone} / ${BUSINESS_DETAILS.secondaryPhone}`,
    phoneHref: "tel:+917248983407",
    hours: `${BUSINESS_DETAILS.hours} - All 7 Days`,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Kohinoor+Grandeur+Ravet+Pune+412101",
  },
  {
    name: "Mukai Chowk",
    address: "Kohinoor Grandeur, Shop No. 10, Mukai Chowk, Kiwale Road, Ravet, Pune 412101",
    phone: `${BUSINESS_DETAILS.phone} / ${BUSINESS_DETAILS.secondaryPhone}`,
    phoneHref: "tel:+917248983407",
    hours: `${BUSINESS_DETAILS.hours} - All 7 Days`,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Shop+No+10+Kohinoor+Grandeur+Mukai+Chowk+Ravet+Pune",
  },
  {
    name: "Kiwale Road",
    address: "Near Mukai Chowk, Kiwale Road, Ravet, Pimpri-Chinchwad, Pune 412101",
    phone: `${BUSINESS_DETAILS.phone} / ${BUSINESS_DETAILS.secondaryPhone}`,
    phoneHref: "tel:+917248983407",
    hours: `${BUSINESS_DETAILS.hours} - All 7 Days`,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Kiwale+Road+Mukai+Chowk+Ravet+Pune+412101",
  },
];

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amit Jadhav",
    location: "Ravet",
    quote: "The team explained every chimney model clearly and helped us choose the right auto-clean option for our kitchen.",
  },
  {
    name: "Priya Shah",
    location: "Mukai Chowk",
    quote: "Excellent product display, polite guidance, and quick support for installation. The Glen hob looks perfect in our new kitchen.",
  },
  {
    name: "Rohit Kulkarni",
    location: "Kiwale",
    quote: "I compared several brands, but JJ Kitchen made the buying process simple with honest advice and transparent pricing.",
  },
  {
    name: "Sneha Patil",
    location: "Wakad",
    quote: "Their showroom experience is very good. We got a chimney and built-in oven with smooth delivery and installation.",
  },
  {
    name: "Nilesh Pawar",
    location: "Punawale",
    quote: "Fast response on WhatsApp, neat demo, and helpful staff. I would recommend visiting before finalizing appliances.",
  },
  {
    name: "Meera Deshmukh",
    location: "Pimpri-Chinchwad",
    quote: "The staff understood our cooking needs and suggested a practical chimney and hob combo within our budget.",
  },
];

export interface SubProduct {
  name: string;
  image: string;
  specs: string;
}

export interface Category {
  name: string;
  image: string;
  desc: string;
  id: string;
  collectionLink: string;
  products: SubProduct[];
}

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: "chimneys",
    name: "Chimneys",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    desc: "Advanced suction technology for smoke-free cooking. Featuring Auto-Clean and Motion Sensor models.",
    collectionLink: "https://glenindia.com/collections/chimneys",
    products: [
      {
        name: "Glen 6060 BL AC (60/90cm)",
        image: "https://glenindia.com/cdn/shop/products/6060-60-bl_1_800x.jpg",
        specs: "1200 m3/h Suction, Filterless, Motion Sensor, Auto Clean"
      },
      {
        name: "Glen 6058 BL Auto Clean",
        image: "https://glenindia.com/cdn/shop/products/6058-bl-ac_1_800x.jpg",
        specs: "1200 m3/h Suction, Heat Auto-Clean, Motion Sensor"
      },
      {
        name: "Glen 6000 DX BL",
        image: "https://glenindia.com/cdn/shop/products/6000-dx-bl_1_800x.jpg",
        specs: "1000 m3/h Suction, Push Button, Baffle Filters"
      },
      {
        name: "Glen 6050 IN BLK",
        image: "https://glenindia.com/cdn/shop/products/6050-in-blk_1_800x.jpg",
        specs: "1100 m3/h Suction, Pyramid Shape, Baffle Filters"
      },
      {
        name: "Glen 6049 IN BLK",
        image: "https://glenindia.com/cdn/shop/products/6049-in-blk_1_800x.jpg",
        specs: "1100 m3/h Suction, Classic Pyramid, Push Button"
      }
    ]
  },
  {
    id: "hobs",
    name: "Gas Hobs",
    image: "https://images.unsplash.com/photo-1506332033947-dfb77ff3639a?auto=format&fit=crop&q=80&w=800",
    desc: "European styled built-in hobs with high efficiency brass burners for modern kitchens.",
    collectionLink: "https://glenindia.com/collections/hobs",
    products: [
      { name: "Glen 1074 SQ BL Hob", image: "https://glenindia.com/cdn/shop/products/1074-sq-bl_1_800x.jpg", specs: "4 Burners, Toughened Glass, Square Drip Tray" },
      { name: "Glen 1063 TR SS Hob", image: "https://glenindia.com/cdn/shop/products/1063-tr-ss_1_800x.jpg", specs: "3 Brass Burners, Stainless Steel Finish" },
      { name: "Glen 1073 SQ Glass Hob", image: "https://glenindia.com/cdn/shop/products/1073-sq-bl_1_800x.jpg", specs: "3 Burners, Italian Gas Valve, Auto Ignition" },
      { name: "Glen 1022 Slim Hob", image: "https://glenindia.com/cdn/shop/products/1022-sl-bl_1_800x.jpg", specs: "2 Burners, Ultra-Slim Design" }
    ]
  },
  {
    id: "ovens",
    name: "Built-in Ovens",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=800",
    desc: "Precision baking and grilling with smart touch controls and sleek glass designs.",
    collectionLink: "https://glenindia.com/collections/built-in-ovens",
    products: [
      { name: "Glen 658 Black Oven", image: "https://glenindia.com/cdn/shop/products/658-bl_1_800x.jpg", specs: "65 Litres, 8 Functions, Convection Fan" },
      { name: "Glen 652 Digital Oven", image: "https://glenindia.com/cdn/shop/products/652-bl_1_800x.jpg", specs: "Touch Control, Electronic Timer, Multi-function" },
      { name: "Glen 661 SS Oven", image: "https://glenindia.com/cdn/shop/products/661-ss_1_800x.jpg", specs: "Steel Finish, Mechanical Timer, Large Capacity" }
    ]
  },
  {
    id: "dishwashers",
    name: "Dishwashers",
    image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800",
    desc: "Hygiene-focused cleaning designed specifically for Indian utensils and tough stains.",
    collectionLink: "https://glenindia.com/collections/dishwashers",
    products: [
      { name: "Glen 12 Place Setting", image: "https://glenindia.com/cdn/shop/products/dishwasher-12p-ss_1_800x.jpg", specs: "12 Place Settings, 6 Wash Programs, SS Finish" },
      { name: "Glen 14 Place Setting", image: "https://glenindia.com/cdn/shop/products/dishwasher-14p-ss_1_800x.jpg", specs: "14 Place Settings, Dual Zone Wash" },
      { name: "Glen 8 Place Compact", image: "https://glenindia.com/cdn/shop/products/dishwasher-8p-ss_1_800x.jpg", specs: "8 Place Setting, Table Top Design" }
    ]
  }
];

export const SERVICE_AREAS = [
  "Ravet", "Wakad", "Hinjewadi", "Nigdi", "Pimpri-Chinchwad", "Punawale", "Kiwale"
];

export const Icons = {
  Star: () => (
    <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Map: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};


