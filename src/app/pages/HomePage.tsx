import { Link } from "react-router";
import { toast } from "sonner";
import { Phone, Droplets, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { ALL_BEVERAGES_SHOWCASE, FOOD_ITEMS, JUICE_ITEMS } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/** Post-hero sections: edge-to-edge on large viewports, capped on ultra-wide displays. */
const SECTION_INNER =
  "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-12";

function foodTagClass(tag: string) {
  if (tag === "Best Seller") return "bg-yellow-400 text-black";
  if (tag === "Chef's Choice") return "bg-orange-400 text-black";
  if (tag === "Popular") return "bg-white/90 text-black";
  if (tag === "Vegetarian") return "bg-green-400 text-black";
  if (tag === "Traditional") return "bg-amber-600 text-white";
  return "bg-gray-700 text-white";
}

export function HomePage() {
  const phoneNumber = "054 972 9309";
  const whatsappNumber = "233549729309";
  const { addItem } = useCart();
  const featuredJuiceImage =
    JUICE_ITEMS.find((j) => j.id === "juice-ginger-pineapple")?.image ?? JUICE_ITEMS[0]?.image;

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-yellow-400">Healthy,</span>
                <br />
                <span className="text-white">Delicious,</span>
                <br />
                <span className="text-yellow-400">Fresh!</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Traditional Ghanaian food & fresh fruit juices made with love.
                Call us and we'll prepare your order fresh!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Phone className="w-6 h-6" />
                  CALL TO ORDER
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  WhatsApp Us
                </a>
              </div>
              <div className="mt-8 flex items-center gap-2 text-yellow-400">
                <MapPin className="w-5 h-5" />
                <span>Freshly prepared & delivered to you</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden transform hover:scale-105 transition-transform">
                <ImageWithFallback
                  src={FOOD_ITEMS[0]?.image}
                  alt="Jollof rice with chicken"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden transform hover:scale-105 transition-transform mt-8">
                <ImageWithFallback
                  src={featuredJuiceImage}
                  alt="Fresh ginger pineapple juice"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Menu */}
      <section id="food" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className={SECTION_INNER}>
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Menu
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Authentic <span className="text-yellow-400">Ghanaian</span> Cuisine
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three homestyle plates — prepared fresh to order with locally sourced ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
            {FOOD_ITEMS.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-gradient-to-b from-gray-900/80 to-gray-950/90 border border-gray-800 rounded-3xl overflow-hidden hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300"
              >
                <div className="relative flex items-center justify-center min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] xl:min-h-[380px] p-5 sm:p-6 bg-gradient-to-b from-zinc-900/90 via-black to-black">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full max-h-[min(340px,50vh)] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {item.tag && (
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${foodTagClass(item.tag)}`}
                    >
                      {item.tag}
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-6 flex-1 leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(item.id);
                      toast.success(`${item.name} added to cart`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-3.5 rounded-full hover:bg-yellow-300 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-colors text-lg"
            >
              View full menu
            </Link>
            <Link
              to="/checkout"
              className="inline-flex items-center gap-3 border border-yellow-400/60 text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-yellow-400/10 transition-colors text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Go to checkout
            </Link>
          </div>
        </div>
      </section>

      {/* Juice Menu */}
      <section id="juice" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className={SECTION_INNER}>
          <div className="text-center mb-16">
            <span className="inline-block bg-green-400/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Fresh & Natural
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh <span className="text-green-400">Fruit</span> Juices
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              100% natural, no sugar added - just pure fruit goodness blended fresh to order. Boost your health with every sip!
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 w-full">
            <figure className="rounded-2xl overflow-hidden border border-gray-700/80 bg-[#1a0a0a] shadow-2xl shadow-green-900/10 ring-1 ring-green-400/10">
              <ImageWithFallback
                src={ALL_BEVERAGES_SHOWCASE.redBackground}
                alt="Believe Chops full beverage menu on red background"
                className="w-full h-auto object-contain"
              />
            </figure>
            <figure className="rounded-2xl overflow-hidden border border-gray-200/20 bg-white shadow-2xl shadow-black/30">
              <ImageWithFallback
                src={ALL_BEVERAGES_SHOWCASE.whiteBackground}
                alt="Believe Chops full beverage menu on white background"
                className="w-full h-auto object-contain"
              />
            </figure>
          </div>

          <p className="text-center text-gray-400 text-sm mb-10 max-w-xl mx-auto">
            Ginger blends, tropical mixes, and more — browse individual flavours on our menu and add to your order.
          </p>

          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 bg-green-400 text-black px-8 py-4 rounded-full font-bold hover:bg-green-300 transition-colors text-lg"
            >
              <Droplets className="w-5 h-5" />
              View All Juices →
            </Link>
          </div>
        </div>
      </section>

      {/* Catering Section */}
      <section id="catering" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className={SECTION_INNER}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Catering Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Custom <span className="text-yellow-400">Orders</span> for Your Events
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Planning a special event? Let us handle the food while you enjoy the celebration!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-yellow-400/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1576842546422-60562b9242ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGZvb2QlMjBjYXRlcmluZ3xlbnwxfHx8fDE3NzQwNTQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Party catering"
                  className="w-full h-80 lg:h-[500px] object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black px-6 py-4 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-bold">100+</p>
                <p className="text-sm font-medium">Events Served</p>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-400 font-semibold">We Cater For</p>
                  <p className="text-gray-400 text-sm">All types of events</p>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Let Us Make Your Event <span className="text-yellow-400">Unforgettable</span>
              </h3>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                From intimate birthday parties to large corporate events, we bring the authentic taste of Ghana to your celebration. Fresh ingredients, traditional recipes, exceptional service.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">✓</span>
                    <span className="text-white font-medium">Birthday Parties</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">✓</span>
                    <span className="text-white font-medium">Family Gatherings</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">✓</span>
                    <span className="text-white font-medium">Office Events</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">✓</span>
                    <span className="text-white font-medium">Custom Menus</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call for Quote
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all"
                >
                  Send Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Order Section */}
      <section id="order" className="py-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className={`${SECTION_INNER} relative`}>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Ready to Taste <span className="text-white drop-shadow-lg">Perfection?</span>
            </h2>
            <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
              Fresh, authentic Ghanaian cuisine delivered to your doorstep. Call us now and we'll prepare your meal with love!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="group inline-flex items-center justify-center gap-3 bg-black text-yellow-400 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl shadow-black/20"
              >
                <Phone className="w-6 h-6 group-hover:animate-pulse" />
                CALL TO ORDER
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl shadow-black/10"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
