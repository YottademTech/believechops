import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Phone, Droplets, UtensilsCrossed, Leaf, ShoppingBag } from 'lucide-react';
import { FOOD_ITEMS, JUICE_ITEMS } from '@/data/menu';
import { formatGhs } from '@/lib/money';
import { useCart } from '@/context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'juice'>('food');
  const { addItem } = useCart();

  const phoneNumber = "054 972 9309";
  const whatsappNumber = "233549729309";

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-green-400/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
               <span className="text-yellow-400">Our</span> Menu
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Explore our complete selection of authentic Ghanaian dishes and fresh natural juices. 
              Every item is prepared with love using the finest ingredients.
            </p>
            
            {/* Tab Navigation */}
            <div className="inline-flex bg-gray-900 rounded-full p-2 gap-2">
              <button
                onClick={() => setActiveTab('food')}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
                  activeTab === 'food'
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5" />
                Food Menu
              </button>
              <button
                onClick={() => setActiveTab('juice')}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
                  activeTab === 'juice'
                    ? 'bg-green-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Droplets className="w-5 h-5" />
                Fresh Juices
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Food Menu Section */}
      {activeTab === 'food' && (
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <UtensilsCrossed className="w-10 h-10 text-yellow-400" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Authentic <span className="text-yellow-400">Ghanaian</span> Cuisine
                </h2>
                <p className="text-gray-400 mt-1">Traditional dishes made fresh daily</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {FOOD_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/5 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {item.tag && (
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        item.tag === 'Best Seller' ? 'bg-yellow-400 text-black' :
                        item.tag === 'Chef\'s Choice' ? 'bg-orange-400 text-black' :
                        item.tag === 'Popular' ? 'bg-white/90 text-black' :
                        item.tag === 'Vegetarian' ? 'bg-green-400 text-black' :
                        item.tag === 'Traditional' ? 'bg-amber-600 text-white' :
                        'bg-gray-700 text-white'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <p className="text-yellow-400 font-bold text-xl mb-4 tabular-nums">
                      {formatGhs(item.pricePesewas)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addItem(item.id);
                        toast.success(`${item.name} added to cart`);
                      }}
                      className="inline-flex items-center gap-2 bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Checkout
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Order via WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Juice Menu Section */}
      {activeTab === 'juice' && (
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <Leaf className="w-10 h-10 text-green-400" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Fresh <span className="text-green-400">Natural</span> Juices
                </h2>
                <p className="text-gray-400 mt-1">100% natural, no sugar added - blended fresh to order</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {JUICE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-green-400/50 hover:shadow-xl hover:shadow-green-400/5 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {item.tag && (
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        item.tag === 'Best Seller' ? 'bg-yellow-400 text-black' :
                        item.tag === 'New' ? 'bg-green-400 text-black' :
                        item.tag === 'Healthy' ? 'bg-emerald-500 text-white' :
                        item.tag === 'Popular' ? 'bg-white/90 text-black' :
                        item.tag === 'Traditional' ? 'bg-red-500 text-white' :
                        'bg-gray-700 text-white'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                      {item.benefits.map((benefit, i) => (
                        <span key={i} className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <p className="text-green-400 font-bold text-xl mb-4 tabular-nums">
                      {formatGhs(item.pricePesewas)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addItem(item.id);
                        toast.success(`${item.name} added to cart`);
                      }}
                      className="inline-flex items-center gap-2 bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-300 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-3 bg-green-400 text-black px-8 py-4 rounded-full font-bold hover:bg-green-300 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Checkout
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-green-400 text-green-400 px-8 py-4 rounded-full font-bold hover:bg-green-400/10 transition-colors"
              >
                <Droplets className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400/20 via-transparent to-green-400/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can't Decide? Let Us Help!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Call us or send a WhatsApp message and we'll recommend the perfect meal for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
