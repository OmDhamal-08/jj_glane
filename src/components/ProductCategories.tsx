import React, { useEffect, useMemo, useState } from 'react';
import type { EnquiryPrefillDetail } from '../types';

type GalleryFilter = 'All' | 'Chimneys' | 'Hobs' | 'Ovens' | 'Microwaves' | 'Dishwashers' | 'Small Appliances';

interface GalleryProduct {
  id: string;
  name: string;
  brand: string;
  category: Exclude<GalleryFilter, 'All'>;
  image: string;
  specs: string;
  rating: number;
  productUrl: string;
}

const FILTERS: GalleryFilter[] = ['All', 'Chimneys', 'Hobs', 'Ovens', 'Microwaves', 'Dishwashers', 'Small Appliances'];

const GALLERY_PRODUCTS: GalleryProduct[] = [
  {
    id: 'glen-ch6052dfmsbfbl60',
    name: 'Glen Ductfree Plug & Play Chimney 60cm',
    brand: 'Glen',
    category: 'Chimneys',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_944fcf6a-471b-47db-aee6-edd4be9f7d93.jpg?v=1763960917',
    specs: 'Wall-mounted ductfree chimney with baffle filters and 1100 m3/h airflow.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/wall-mounted-ductfree-kitchen-chimney-plug-play-with-baffle-filters-60cm-1100-m3-h-black-ch6052dfmsbfbl60',
  },
  {
    id: 'glen-ch6064ac',
    name: 'Glen Auto Clean Filterless Chimney CH6064AC',
    brand: 'Glen',
    category: 'Chimneys',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/6064-AC.jpg?v=1723473072',
    specs: 'Auto-clean glass filterless chimney with motion sensor and 1200 m3/h suction.',
    rating: 4.9,
    productUrl: 'https://glenindia.com/products/auto-clean-glass-filterless-chimney-with-motion-sensor-1200-m3-h-60-90cm-ch6064ac',
  },
  {
    id: 'glen-6058-bl-ac',
    name: 'Glen 6058 BL Auto Clean Chimney',
    brand: 'Glen',
    category: 'Chimneys',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/Front_View_of_Auto_Clean_Curved_Glass_Filter_less_Kitchen_Chimney_1.jpg?v=1761031527',
    specs: 'Curved glass filterless chimney with motion sensor and 1200 m3/h airflow.',
    rating: 4.9,
    productUrl: 'https://glenindia.com/products/auto-clean-curved-glass-filter-less-kitchen-chimney-with-motion-sensor-60-76-90cm-1200-m3-h-6058-bl-auto-clean',
  },
  {
    id: 'glen-6060-bl-ac',
    name: 'Glen 6060 BL AC Chimney',
    brand: 'Glen',
    category: 'Chimneys',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_b19848cb-8512-4162-92ff-a6e6638542a3.jpg?v=1712896874',
    specs: 'Auto-clean curved glass filterless chimney for 60/90cm kitchens.',
    rating: 4.9,
    productUrl: 'https://glenindia.com/products/glen-auto-clean-chimney-6060-bl-ac-60-90cm-with-motion-sensor-airflow-1200-m3-hr',
  },
  {
    id: 'glen-6000-dx-bl',
    name: 'Glen 6000 DX BL Straight Line Chimney',
    brand: 'Glen',
    category: 'Chimneys',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/Straight_Line_Kitchen_Chimney_front_view.jpg?v=1761025624',
    specs: 'Straight line push-button chimney with baffle filters and 1000 m3/h airflow.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/glen-straight-line-kitchen-chimney-6000-junior-black-baffle-filters-60cm-airflow-1000-m3-h',
  },
  {
    id: 'glen-1012-rodb',
    name: 'Glen 2 Burner Built-in Glass Hob 1012 RODB',
    brand: 'Glen',
    category: 'Hobs',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_ace70d65-d2e1-4bb8-a8fb-8f1f42b64eca.jpg?v=1711445955',
    specs: '2 burner glass hob with double ring forged brass burners and auto ignition.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/glen-2-burner-auto-ignition-built-in-glass-hob-1012-ro-db',
  },
  {
    id: 'glen-1065-trg',
    name: 'Glen 4 Burner Built-in Glass Hob 1065 TRG',
    brand: 'Glen',
    category: 'Hobs',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/Mainimage_c2a73cc3-1a79-43f2-9fe7-b83997945daf.jpg?v=1631854143',
    specs: '4 burner glass hob with European sealed burners and auto ignition.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/glen-4-burner-built-in-glass-hob-1065-tr-auto-ignition-with-ms-pan-support',
  },
  {
    id: 'glen-1063-sq-db',
    name: 'Glen 3 Burner Built-in Glass Hob 1063 SQ DB',
    brand: 'Glen',
    category: 'Hobs',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_355c6886-f437-4160-b122-5e5a9f2ca629.jpg?v=1725513472',
    specs: '3 burner glass hob with forged brass burner and auto ignition.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/glen-3-burner-built-in-glass-hob-1063-sq-db-auto-ignition-with-ms-pan-support',
  },
  {
    id: 'glen-1073-sq-ht-in',
    name: 'Glen 3 Burner Glass Hob Top 1073 SQ HT IN',
    brand: 'Glen',
    category: 'Hobs',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_85f7da3d-6966-4c8e-b7b0-c14d6cefb5fd.jpg?v=1715421914',
    specs: 'Glass hob top with Italian double ring burners and auto ignition.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/3-burner-built-in-glass-hob-with-italian-double-ring-burners-auto-ignition-1073-sq-in-copy',
  },
  {
    id: 'glen-1074-sq-ht-in',
    name: 'Glen 4 Burner Glass Hob Top 1074 SQ HT IN',
    brand: 'Glen',
    category: 'Hobs',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_402aa29a-346e-48a2-b903-330496e7c772.jpg?v=1715422034',
    specs: '4 burner glass hob top with Italian double ring burner and auto ignition.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/4-burner-built-in-glass-gas-hob-with-italian-double-ring-burner-auto-ignition-1074-sq-in-copy',
  },
  {
    id: 'glen-660-mrt',
    name: 'Glen 660 M RT Built-in Oven 78L',
    brand: 'Glen',
    category: 'Ovens',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/BO-660MRT.jpg?v=1631862340',
    specs: '78L motorised rotisserie turbo fan oven with multi-function cooking.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/glen-660-mr-turbo',
  },
  {
    id: 'glen-bo662af',
    name: 'Glen BO662AF Built-in Air Fryer Oven 60L',
    brand: 'Glen',
    category: 'Ovens',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_8a12eb86-7619-45a9-a6da-66497af9a5d3.jpg?v=1762760121',
    specs: '60L built-in oven with air fry technology, convection fan, and 6 functions.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/built-in-oven-air-fryer-60ltr-with-convection-fan-and-3-control-knobs-bo662af',
  },
  {
    id: 'glen-651mrtss',
    name: 'Glen 651MRTSS Built-in Oven 70L',
    brand: 'Glen',
    category: 'Ovens',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/1_760019fa-8775-48ba-98a0-1d5980c1e1d4.jpg?v=1659352767',
    specs: '70L stainless steel oven with 9 functions and motorised rotisserie.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/built-in-oven-651-mr-turbo-stainless-steel-bo-651mrtss',
  },
  {
    id: 'glen-651mrtbl',
    name: 'Glen 651MRTBL Built-in Oven 70L',
    brand: 'Glen',
    category: 'Ovens',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/651MRTBL_d1847d3a-0f74-420c-8aa7-b7102bc580a9.jpg?v=1729485382',
    specs: 'Black 70L built-in oven with turbo fan, 9 functions, and rotisserie.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/built-in-oven-motorised-rotisserie-turbo-fan-70ltr-with-9-multi-functions-651mrtbl',
  },
  {
    id: 'glen-bo607t',
    name: 'Glen BO-607T Built-in Oven 59L',
    brand: 'Glen',
    category: 'Ovens',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/BOC-607-TURBO_d3941e8f-460f-4217-a116-37bcb8dccc9f.jpg?v=1763026162',
    specs: '59L built-in oven with turbo fan and 9 multi-functions.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/built-in-oven-turbo-fan-59ltr-with-9-multi-functions-bo-607t',
  },
  {
    id: 'glen-mo677',
    name: 'Glen MO 677 Built-in Microwave 25L',
    brand: 'Glen',
    category: 'Microwaves',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/MO-677.jpg?v=1631862473',
    specs: '25L stainless steel built-in microwave with grill and soft touch controls.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/glen-built-in-microwave-oven-mo-677',
  },
  {
    id: 'glen-mo675',
    name: 'Glen MO 675 Built-in Microwave 25L',
    brand: 'Glen',
    category: 'Microwaves',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/MO-675.jpg?v=1631862453',
    specs: '25L built-in microwave with grill and glass finish.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/glen-built-in-microwave-oven-mo-675',
  },
  {
    id: 'glen-mo671',
    name: 'Glen MO 671 Built-in Microwave 25L',
    brand: 'Glen',
    category: 'Microwaves',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/GlenBuilt-In-Microwave25L-671.jpg?v=1631508594',
    specs: 'Glass touch control microwave with grill, multi-stage cooking, and ISI certification.',
    rating: 4.5,
    productUrl: 'https://glenindia.com/products/glen-built-in-microwave-oven-mo-671',
  },
  {
    id: 'glen-mo678',
    name: 'Glen MO 678 Built-in Microwave 25L',
    brand: 'Glen',
    category: 'Microwaves',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/678_1500x1500_acacf569-f2c9-4574-a304-9918544a4973.webp?v=1702540371',
    specs: 'Touch control microwave with 8 auto menus, grill function, and child lock.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/built-in-microwave-with-touch-control-capacity-25-ltr-mo-678',
  },
  {
    id: 'glen-dw7735m',
    name: 'Glen DW-7735M Built-in Dishwasher 14 Place',
    brand: 'Glen',
    category: 'Dishwashers',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/DW-7735M---2049.jpg?v=1722573787',
    specs: '14 place semi built-in dishwasher with electronic controls and dual-zone wash.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/built-in-dishwasher-14-place-setting-ss-panel-electronic-controls-dw-7735m',
  },
  {
    id: 'glen-dw5201fs',
    name: 'Glen DW-5201FS Dishwasher 12 Place',
    brand: 'Glen',
    category: 'Dishwashers',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/DW-5201FS-2049.jpg?v=1722574263',
    specs: 'Free standing 12 place setting dishwasher with stainless steel panel.',
    rating: 4.6,
    productUrl: 'https://glenindia.com/products/free-standing-dishwasher-12-place-setting-ss-panel-electronic-controls-dw-5201fs',
  },
  {
    id: 'glen-dw7721j',
    name: 'Glen DW7721J Built-in Dishwasher 14 Place',
    brand: 'Glen',
    category: 'Dishwashers',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/DishwasherSSPanel7721JBuilt-In14PS.jpg?v=1631508493',
    specs: '14 place built-in dishwasher with stainless steel panel and electronic controls.',
    rating: 4.6,
    productUrl: 'https://glenindia.com/products/glen-built-in-dishwasher-7721j',
  },
  {
    id: 'glen-sa4023platinum',
    name: 'Glen SA4023 Platinum Mixer Grinder 750W',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/4023-Platinum-min.jpg?v=1651145741',
    specs: '750W mixer grinder with 1 transparent jar and 3 stainless steel jars.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/glen-mixer-grinder-sa-4023-platinum',
  },
  {
    id: 'glen-sa4030plus',
    name: 'Glen 4030 PLUS Mixer Grinder 750W',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/products/MixerGrindersJuicersSA4030PLUS.jpg?v=1631782584',
    specs: '750W copper motor mixer grinder with 3 stainless steel jars and transparent jar.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/mixer-grinder-750w-100-copper-motor-1-transparent-jar-3-stainless-steel-jars-silver-4030-plus',
  },
  {
    id: 'glen-sa4031plus',
    name: 'Glen 4031PLUS Ultra Tuff Mixer Grinder 1000W',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/SA4031MixerGrinderUltraTUFF4Jars.jpg?v=1700656146',
    specs: '1000W ultra tuff mixer grinder with 1 transparent and 3 stainless steel jars.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/ultra-tuff-mixer-grinder-1000w-with-1-transparent-jar-3-stainless-steel-jars-4031plus',
  },
  {
    id: 'glen-sa3040dss',
    name: 'Glen SA3040 DSS Digital Air Fryer 12L',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1st.jpg?v=1728993438',
    specs: '12L digital air fryer with 8 preset menus, time and temperature control.',
    rating: 4.7,
    productUrl: 'https://glenindia.com/products/digital-air-fryer-12-litre-capacity-8-pre-set-menu-time-and-temperature-control-2000w-sa-3040-dss',
  },
  {
    id: 'glen-sa3042dbl',
    name: 'Glen SA3042DBL Digital Air Fryer 6L',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/1_c47deb0a-4c74-41d0-8df1-f8a1e709a713.jpg?v=1713763178',
    specs: '6L digital air fryer with 7 preset menus and 1500W power.',
    rating: 4.8,
    productUrl: 'https://glenindia.com/products/air-fryer-6-0-litre-digital-controls-7-pre-set-menu-timer-temperature-control-1500w-black-sa3042dbl',
  },
  {
    id: 'glen-sa3050afo',
    name: 'Glen SA3050AFO Air Fryer Oven 25L',
    brand: 'Glen',
    category: 'Small Appliances',
    image: 'https://cdn.shopify.com/s/files/1/0569/6883/9344/files/3050_f865ce6e-de67-418a-a08e-2808bcc77bb6.jpg?v=1771416975',
    specs: '25L air fryer oven with time and temperature control, rotisserie, and 1800W power.',
    rating: 4.6,
    productUrl: 'https://glenindia.com/products/air-fryer-oven-25-litre-time-and-temperature-control-1800w-black-sa3050afo',
  },
];

const StarIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 1.6l2.35 5.1 5.57.65-4.12 3.78 1.1 5.5L10 13.85l-4.9 2.78 1.1-5.5-4.12-3.78 5.57-.65L10 1.6z" />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 8.5h11l.85 10.2A2.1 2.1 0 0116.25 21h-8.5a2.1 2.1 0 01-2.1-2.3L6.5 8.5z" />
    <path d="M9 8.5V7a3 3 0 016 0v1.5" />
  </svg>
);

const ProductCategories: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(loadTimer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return GALLERY_PRODUCTS;
    return GALLERY_PRODUCTS.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const comparedProducts = useMemo(
    () => GALLERY_PRODUCTS.filter((product) => compareIds.includes(product.id)),
    [compareIds],
  );

  const handleFilterClick = (filter: GalleryFilter) => {
    if (filter === activeFilter || isFiltering) return;

    setIsFiltering(true);
    window.setTimeout(() => {
      setActiveFilter(filter);
      window.setTimeout(() => setIsFiltering(false), 40);
    }, 220);
  };

  const handleEnquiryClick = (product: GalleryProduct) => {
    const detail: EnquiryPrefillDetail = {
      product: product.name,
      budget: 'Need store recommendation',
      message: `Interested in ${product.name}.`,
    };

    window.dispatchEvent(new CustomEvent<EnquiryPrefillDetail>('jj:prefill-enquiry', { detail }));
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCompareClick = (product: GalleryProduct) => {
    setCompareIds((current) => {
      if (current.includes(product.id)) {
        return current.filter((id) => id !== product.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, product.id];
    });
  };

  const handleCompareEnquiry = () => {
    if (comparedProducts.length === 0) return;

    const productList = comparedProducts.map((product) => product.name).join(' vs ');
    const detail: EnquiryPrefillDetail = {
      product: productList,
      budget: 'Need store recommendation',
      message: `Please help me compare these models: ${productList}.`,
    };

    window.dispatchEvent(new CustomEvent<EnquiryPrefillDetail>('jj:prefill-enquiry', { detail }));
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="products" className="product-gallery">
      <div className="product-gallery__inner">
        <div className="product-gallery__header">
          <div>
            <span className="tag product-gallery__eyebrow">Product Gallery</span>
            <h2>
              Explore Appliances
              <em> by Category</em>
            </h2>
          </div>
          <p>
            Browse Glen chimneys, hobs, built-in ovens, microwaves, dishwashers, and small appliances available through JJ Kitchen Appliances.
          </p>
        </div>

        <div className="product-filter-tabs" role="tablist" aria-label="Product gallery filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={`product-filter-tab${activeFilter === filter ? ' is-active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="product-gallery__assist">
          <div>
            <strong>{filteredProducts.length}</strong>
            <span>{activeFilter === 'All' ? 'models visible' : `${activeFilter} visible`}</span>
          </div>
          <div>
            <strong>{compareIds.length}/3</strong>
            <span>compare slots</span>
          </div>
          <div>
            <strong>Demo</strong>
            <span>available in store</span>
          </div>
        </div>

        {comparedProducts.length > 0 ? (
          <div className="product-compare-panel" aria-label="Selected product comparison">
            <div className="product-compare-panel__header">
              <div>
                <span className="tag">Compare Shortlist</span>
                <h3>{comparedProducts.length === 1 ? 'One model selected' : `${comparedProducts.length} models selected`}</h3>
              </div>
              <div className="product-compare-panel__actions">
                <button type="button" className="btn-wh" onClick={() => setCompareIds([])}>
                  Clear
                </button>
                <button type="button" className="btn-g" onClick={handleCompareEnquiry}>
                  Ask Expert
                </button>
              </div>
            </div>

            <div className="product-compare-list">
              {comparedProducts.map((product) => (
                <article key={product.id}>
                  <img
                    src={product.image}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <span>{product.category}</span>
                    <strong>{product.name}</strong>
                    <p>{product.specs}</p>
                  </div>
                  <button type="button" onClick={() => handleCompareClick(product)} aria-label={`Remove ${product.name} from comparison`}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="product-gallery-grid" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="product-skeleton-card" key={index} aria-hidden="true">
                <div className="product-skeleton-media" />
                <div className="product-skeleton-body">
                  <span />
                  <strong />
                  <p />
                  <p />
                  <button type="button" tabIndex={-1} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`product-gallery-grid${isFiltering ? ' is-filtering' : ''}`}>
            {filteredProducts.map((product) => (
              <article className={`gallery-product-card${compareIds.includes(product.id) ? ' is-compared' : ''}`} key={product.id}>
                <div className="gallery-product-media">
                  <div className="gallery-product-media-fallback" aria-hidden="true">
                    <span>{product.brand}</span>
                    <strong>{product.category}</strong>
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="gallery-brand-badge">{product.brand}</span>
                  <button
                    type="button"
                    className="gallery-enquiry-button"
                    aria-label={`Add ${product.name} to enquiry`}
                    onClick={() => handleEnquiryClick(product)}
                  >
                    <BagIcon />
                  </button>
                </div>

                <div className="gallery-product-body">
                  <span className="gallery-product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.specs}</p>

                  <div className="gallery-rating" aria-label={`${product.rating} out of 5 stars`}>
                    <span>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon key={index} />
                      ))}
                    </span>
                    <strong>{product.rating.toFixed(1)}</strong>
                  </div>

                  <button
                    type="button"
                    className="gallery-compare-button"
                    onClick={() => handleCompareClick(product)}
                    disabled={!compareIds.includes(product.id) && compareIds.length >= 3}
                    aria-pressed={compareIds.includes(product.id)}
                  >
                    {compareIds.includes(product.id) ? 'Selected for Compare' : 'Compare Model'}
                  </button>
                  <button type="button" className="gallery-details-button" onClick={() => handleEnquiryClick(product)}>
                    Enquire Now
                  </button>
                  <a
                    className="gallery-official-link"
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Glen Details
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCategories;
