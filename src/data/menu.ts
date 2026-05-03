export type FoodMenuItem = {
  id: string;
  kind: "food";
  name: string;
  description: string;
  image: string;
  tag: string | null;
  category: string;
  /** Ghana pesewas — matches backend `Order.totalAmount` when currency is GHS */
  pricePesewas: number;
};

export type JuiceMenuItem = {
  id: string;
  kind: "juice";
  name: string;
  description: string;
  image: string;
  tag: string | null;
  benefits: string[];
  pricePesewas: number;
};

export type MenuItem = FoodMenuItem | JuiceMenuItem;

export const FOOD_ITEMS: FoodMenuItem[] = [
  {
    id: "food-banku-tilapia",
    kind: "food",
    name: "Banku & Tilapia",
    description:
      "Soft fermented corn dough paired with crispy grilled tilapia and fresh pepper sauce",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Best Seller",
    category: "Main Dish",
    pricePesewas: 85_00,
  },
  {
    id: "food-jollof",
    kind: "food",
    name: "Jollof Rice",
    description: "Iconic West African rice cooked in rich tomato sauce with aromatic spices",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Test ₵1",
    category: "Main Dish",
    pricePesewas: 100,
  },
  {
    id: "food-goat-light-soup",
    kind: "food",
    name: "Goat Light Soup",
    description: "Hearty goat meat slow-cooked in aromatic light soup with traditional herbs",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    category: "Soups",
    pricePesewas: 72_00,
  },
  {
    id: "food-fufu-groundnut",
    kind: "food",
    name: "Fufu & Groundnut Soup",
    description: "Smooth pounded cassava with rich, creamy groundnut soup and assorted meat",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Chef's Choice",
    category: "Main Dish",
    pricePesewas: 78_00,
  },
  {
    id: "food-waakye",
    kind: "food",
    name: "Waakye Special",
    description:
      "Rice and beans combo served with spaghetti, gari, egg, and spicy shito sauce",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Popular",
    category: "Main Dish",
    pricePesewas: 42_00,
  },
  {
    id: "food-kelewele-chicken",
    kind: "food",
    name: "Kelewele & Grilled Chicken",
    description: "Spiced fried plantains paired with perfectly seasoned grilled chicken",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    category: "Sides",
    pricePesewas: 48_00,
  },
  {
    id: "food-fried-rice-chicken",
    kind: "food",
    name: "Fried Rice & Chicken",
    description: "Savory fried rice loaded with vegetables and served with crispy fried chicken",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Popular",
    category: "Main Dish",
    pricePesewas: 52_00,
  },
  {
    id: "food-red-red",
    kind: "food",
    name: "Red Red (Bean Stew)",
    description:
      "Traditional black-eyed pea stew cooked in palm oil, served with fried plantains",
    image:
      "https://images.unsplash.com/photo-1515516969-d4008cc6241a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Vegetarian",
    category: "Main Dish",
    pricePesewas: 45_00,
  },
  {
    id: "food-pepper-soup",
    kind: "food",
    name: "Pepper Soup",
    description:
      "Spicy, aromatic soup with your choice of fish, goat, or chicken - a true comfort food",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    category: "Soups",
    pricePesewas: 58_00,
  },
  {
    id: "food-kenkey-fish",
    kind: "food",
    name: "Kenkey & Fried Fish",
    description:
      "Fermented corn dough wrapped in banana leaves, served with crispy fried fish and pepper",
    image:
      "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Traditional",
    category: "Main Dish",
    pricePesewas: 38_00,
  },
  {
    id: "food-yam-ampesi",
    kind: "food",
    name: "Yam Ampesi",
    description: "Boiled yam served with kontomire (cocoyam leaves) stew and palm oil",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    category: "Main Dish",
    pricePesewas: 44_00,
  },
  {
    id: "food-grilled-tilapia",
    kind: "food",
    name: "Grilled Tilapia",
    description: "Whole tilapia marinated in special spices and grilled to smoky perfection",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Best Seller",
    category: "Grills",
    pricePesewas: 95_00,
  },
];

export const JUICE_ITEMS: JuiceMenuItem[] = [
  {
    id: "juice-ginger-pineapple",
    kind: "juice",
    name: "Ginger Pineapple Blast",
    description:
      "Sweet tropical pineapple blended with fiery ginger for the ultimate immunity boost",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Best Seller",
    benefits: ["Immunity Boost", "Anti-inflammatory"],
    pricePesewas: 22_00,
  },
  {
    id: "juice-orange-ginger",
    kind: "juice",
    name: "Orange Ginger Sunrise",
    description:
      "Fresh-squeezed oranges with a zingy ginger kick - your daily vitamin C powerhouse",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Popular",
    benefits: ["Vitamin C", "Energy Boost"],
    pricePesewas: 20_00,
  },
  {
    id: "juice-watermelon-ginger",
    kind: "juice",
    name: "Watermelon Ginger Chill",
    description: "Hydrating watermelon with subtle ginger warmth - summer in a glass",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    benefits: ["Hydration", "Refreshing"],
    pricePesewas: 18_00,
  },
  {
    id: "juice-mango-paradise",
    kind: "juice",
    name: "Mango Paradise",
    description: "Creamy African mango blended to perfection with a hint of lime",
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "New",
    benefits: ["Fiber Rich", "Digestive Health"],
    pricePesewas: 24_00,
  },
  {
    id: "juice-green-detox",
    kind: "juice",
    name: "Green Detox Power",
    description:
      "Spinach, cucumber, apple & ginger - a cleansing blend for your wellness journey",
    image:
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Healthy",
    benefits: ["Detox", "Nutrient Dense"],
    pricePesewas: 23_00,
  },
  {
    id: "juice-passion-zing",
    kind: "juice",
    name: "Passion Fruit Zing",
    description: "Tangy passion fruit with tropical notes - bold, exotic, and energizing",
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    benefits: ["Antioxidants", "Mood Boost"],
    pricePesewas: 24_00,
  },
  {
    id: "juice-coconut-bliss",
    kind: "juice",
    name: "Coconut Bliss",
    description:
      "Fresh coconut water blended with coconut flesh - tropical hydration at its finest",
    image:
      "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "New",
    benefits: ["Electrolytes", "Natural Hydration"],
    pricePesewas: 21_00,
  },
  {
    id: "juice-beetroot-energy",
    kind: "juice",
    name: "Beetroot Energy",
    description: "Earthy beetroot with apple and ginger - a natural pre-workout powerhouse",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Healthy",
    benefits: ["Stamina", "Blood Flow"],
    pricePesewas: 25_00,
  },
  {
    id: "juice-carrot-sunrise",
    kind: "juice",
    name: "Carrot Sunrise",
    description: "Sweet carrots with orange and a touch of turmeric for golden wellness",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    benefits: ["Eye Health", "Vitamin A"],
    pricePesewas: 19_00,
  },
  {
    id: "juice-tropical-fusion",
    kind: "juice",
    name: "Tropical Fusion",
    description: "A vibrant mix of mango, pineapple, and papaya - pure paradise in every sip",
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Popular",
    benefits: ["Tropical Vitamins", "Mood Lift"],
    pricePesewas: 23_00,
  },
  {
    id: "juice-cucumber-mint",
    kind: "juice",
    name: "Cucumber Mint Cooler",
    description: "Refreshing cucumber with fresh mint and lime - the ultimate thirst quencher",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: null,
    benefits: ["Cooling", "Low Calorie"],
    pricePesewas: 18_00,
  },
  {
    id: "juice-sobolo",
    kind: "juice",
    name: "Sobolo (Hibiscus)",
    description: "Traditional Ghanaian hibiscus drink with ginger and natural spices",
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "Traditional",
    benefits: ["Heart Health", "Antioxidants"],
    pricePesewas: 15_00,
  },
];

const BY_ID: Record<string, MenuItem> = {};
for (const x of FOOD_ITEMS) BY_ID[x.id] = x;
for (const x of JUICE_ITEMS) BY_ID[x.id] = x;

export function getMenuItem(id: string): MenuItem | undefined {
  return BY_ID[id];
}
