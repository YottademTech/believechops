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

function publicAsset(folder: "foods" | "beverages", filename: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${folder}/${filename}`;
}

function foodImage(filename: string): string {
  return publicAsset("foods", filename);
}

function beverageImage(filename: string): string {
  return publicAsset("beverages", filename);
}

export const FOOD_ITEMS: FoodMenuItem[] = [
  {
    id: "food-jollof-chicken",
    kind: "food",
    name: "Jollof Rice with Chicken",
    description:
      "Smoky party-style jollof rice cooked in rich tomato and spice, served with tender chicken",
    image: foodImage("jollof-rice-with-chicken.jpeg"),
    tag: "Best Seller",
    category: "Main Dish",
    pricePesewas: 100,
  },
  {
    id: "food-assorted-fried-rice-chicken",
    kind: "food",
    name: "Assorted Fried Rice with Chicken",
    description:
      "Colourful fried rice with vegetables and assorted toppings, finished with seasoned chicken",
    image: foodImage("assorted-fried-rice-with-chicken.jpeg"),
    tag: "Popular",
    category: "Main Dish",
    pricePesewas: 52_00,
  },
  {
    id: "food-plain-rice-stew-chicken",
    kind: "food",
    name: "Plain Rice with Stew & Chicken",
    description:
      "Fluffy steamed rice with hearty Ghanaian stew and well-seasoned chicken — homestyle comfort",
    image: foodImage("plain-rice-with-stew-and-chicken.jpeg"),
    tag: null,
    category: "Main Dish",
    pricePesewas: 45_00,
  },
];

/** Full beverage menu collages for marketing (home page showcase). */
export const ALL_BEVERAGES_SHOWCASE = {
  redBackground: beverageImage("all-beverages-red-background.jpeg"),
  whiteBackground: beverageImage("all-beverages-white-background.jpeg"),
} as const;

export const JUICE_ITEMS: JuiceMenuItem[] = [
  {
    id: "juice-ginger-apple",
    kind: "juice",
    name: "Ginger Apple",
    description: "Crisp apple blended with fresh ginger — naturally sweet and refreshing",
    image: beverageImage("ginger-apple.jpeg"),
    tag: null,
    benefits: ["Vitamin C", "Refreshing"],
    pricePesewas: 20_00,
  },
  {
    id: "juice-ginger-carrot-pineapple",
    kind: "juice",
    name: "Ginger Carrot Pineapple",
    description: "Carrot and pineapple with a ginger kick — golden, earthy, and energizing",
    image: beverageImage("ginger-carrot-pineapple.jpeg"),
    tag: "Healthy",
    benefits: ["Vitamin A", "Immunity Boost"],
    pricePesewas: 22_00,
  },
  {
    id: "juice-ginger-mango",
    kind: "juice",
    name: "Ginger Mango",
    description: "Creamy mango and fiery ginger — tropical comfort in every sip",
    image: beverageImage("ginger-mango.jpeg"),
    tag: null,
    benefits: ["Tropical Vitamins", "Digestive Health"],
    pricePesewas: 24_00,
  },
  {
    id: "juice-ginger-mango-pineapple",
    kind: "juice",
    name: "Ginger Mango Pineapple",
    description: "Mango meets pineapple with ginger warmth — our island-style favourite",
    image: beverageImage("ginger-mango-pineapple.jpeg"),
    tag: "Popular",
    benefits: ["Tropical Blend", "Energy Boost"],
    pricePesewas: 24_00,
  },
  {
    id: "juice-ginger-orange-pineapple",
    kind: "juice",
    name: "Ginger Orange Pineapple",
    description: "Bright orange and pineapple with ginger — your daily vitamin C powerhouse",
    image: beverageImage("ginger-orange-pineapple.jpeg"),
    tag: null,
    benefits: ["Vitamin C", "Citrus Zing"],
    pricePesewas: 20_00,
  },
  {
    id: "juice-ginger-pineapple",
    kind: "juice",
    name: "Ginger Pineapple",
    description: "Sweet tropical pineapple blended with fiery ginger for an immunity boost",
    image: beverageImage("ginger-pineapple.jpeg"),
    tag: "Best Seller",
    benefits: ["Immunity Boost", "Anti-inflammatory"],
    pricePesewas: 22_00,
  },
  {
    id: "juice-ginger-pineapple-bissap",
    kind: "juice",
    name: "Ginger Pineapple Bissap",
    description: "Pineapple and ginger layered with bissap (hibiscus) — bold Ghanaian flavour",
    image: beverageImage("ginger-pineapple-bissap.jpeg"),
    tag: "Traditional",
    benefits: ["Antioxidants", "Heart Health"],
    pricePesewas: 18_00,
  },
  {
    id: "juice-ginger-watermelon-pineapple",
    kind: "juice",
    name: "Ginger Watermelon Pineapple",
    description: "Hydrating watermelon and pineapple with ginger — summer in a glass",
    image: beverageImage("ginger-watermelon-pineapple.jpeg"),
    tag: null,
    benefits: ["Hydration", "Refreshing"],
    pricePesewas: 20_00,
  },
];

const BY_ID: Record<string, MenuItem> = {};
for (const x of FOOD_ITEMS) BY_ID[x.id] = x;
for (const x of JUICE_ITEMS) BY_ID[x.id] = x;

export function getMenuItem(id: string): MenuItem | undefined {
  return BY_ID[id];
}
