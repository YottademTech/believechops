import { useState } from 'react';
import { Phone, Droplets, UtensilsCrossed, Leaf } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'juice'>('food');
  
  const phoneNumber = "054 972 9309";
  const whatsappNumber = "233549729309";

  const foodMenu = [
    {
      name: "Banku & Tilapia",
      description: "Soft fermented corn dough paired with crispy grilled tilapia and fresh pepper sauce",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Best Seller",
      category: "Main Dish"
    },
    {
      name: "Jollof Rice",
      description: "Iconic West African rice cooked in rich tomato sauce with aromatic spices",
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Popular",
      category: "Main Dish"
    },
    {
      name: "Goat Light Soup",
      description: "Hearty goat meat slow-cooked in aromatic light soup with traditional herbs",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      category: "Soups"
    },
    {
      name: "Fufu & Groundnut Soup",
      description: "Smooth pounded cassava with rich, creamy groundnut soup and assorted meat",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Chef's Choice",
      category: "Main Dish"
    },
    {
      name: "Waakye Special",
      description: "Rice and beans combo served with spaghetti, gari, egg, and spicy shito sauce",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Popular",
      category: "Main Dish"
    },
    {
      name: "Kelewele & Grilled Chicken",
      description: "Spiced fried plantains paired with perfectly seasoned grilled chicken",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      category: "Sides"
    },
    {
      name: "Fried Rice & Chicken",
      description: "Savory fried rice loaded with vegetables and served with crispy fried chicken",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Popular",
      category: "Main Dish"
    },
    {
      name: "Red Red (Bean Stew)",
      description: "Traditional black-eyed pea stew cooked in palm oil, served with fried plantains",
      image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Vegetarian",
      category: "Main Dish"
    },
    {
      name: "Pepper Soup",
      description: "Spicy, aromatic soup with your choice of fish, goat, or chicken - a true comfort food",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      category: "Soups"
    },
    {
      name: "Kenkey & Fried Fish",
      description: "Fermented corn dough wrapped in banana leaves, served with crispy fried fish and pepper",
      image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Traditional",
      category: "Main Dish"
    },
    {
      name: "Yam Ampesi",
      description: "Boiled yam served with kontomire (cocoyam leaves) stew and palm oil",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      category: "Main Dish"
    },
    {
      name: "Grilled Tilapia",
      description: "Whole tilapia marinated in special spices and grilled to smoky perfection",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Best Seller",
      category: "Grills"
    },
  ];

  const juiceMenu = [
    {
      name: "Ginger Pineapple Blast",
      description: "Sweet tropical pineapple blended with fiery ginger for the ultimate immunity boost",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Best Seller",
      benefits: ["Immunity Boost", "Anti-inflammatory"]
    },
    {
      name: "Orange Ginger Sunrise",
      description: "Fresh-squeezed oranges with a zingy ginger kick - your daily vitamin C powerhouse",
      image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Popular",
      benefits: ["Vitamin C", "Energy Boost"]
    },
    {
      name: "Watermelon Ginger Chill",
      description: "Hydrating watermelon with subtle ginger warmth - summer in a glass",
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      benefits: ["Hydration", "Refreshing"]
    },
    {
      name: "Mango Paradise",
      description: "Creamy African mango blended to perfection with a hint of lime",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "New",
      benefits: ["Fiber Rich", "Digestive Health"]
    },
    {
      name: "Green Detox Power",
      description: "Spinach, cucumber, apple & ginger - a cleansing blend for your wellness journey",
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Healthy",
      benefits: ["Detox", "Nutrient Dense"]
    },
    {
      name: "Passion Fruit Zing",
      description: "Tangy passion fruit with tropical notes - bold, exotic, and energizing",
      image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      benefits: ["Antioxidants", "Mood Boost"]
    },
    {
      name: "Coconut Bliss",
      description: "Fresh coconut water blended with coconut flesh - tropical hydration at its finest",
      image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "New",
      benefits: ["Electrolytes", "Natural Hydration"]
    },
    {
      name: "Beetroot Energy",
      description: "Earthy beetroot with apple and ginger - a natural pre-workout powerhouse",
      image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Healthy",
      benefits: ["Stamina", "Blood Flow"]
    },
    {
      name: "Carrot Sunrise",
      description: "Sweet carrots with orange and a touch of turmeric for golden wellness",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      benefits: ["Eye Health", "Vitamin A"]
    },
    {
      name: "Tropical Fusion",
      description: "A vibrant mix of mango, pineapple, and papaya - pure paradise in every sip",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Popular",
      benefits: ["Tropical Vitamins", "Mood Lift"]
    },
    {
      name: "Cucumber Mint Cooler",
      description: "Refreshing cucumber with fresh mint and lime - the ultimate thirst quencher",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: null,
      benefits: ["Cooling", "Low Calorie"]
    },
    {
      name: "Sobolo (Hibiscus)",
      description: "Traditional Ghanaian hibiscus drink with ginger and natural spices",
      image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Traditional",
      benefits: ["Heart Health", "Antioxidants"]
    },
  ];

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
              {foodMenu.map((item, index) => (
                <div
                  key={index}
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
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Order Now
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
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
              {juiceMenu.map((item, index) => (
                <div
                  key={index}
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
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold hover:text-green-300 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Order Fresh
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-400 text-black px-8 py-4 rounded-full font-bold hover:bg-green-300 transition-colors"
              >
                <Droplets className="w-5 h-5" />
                Order Fresh Juice
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
