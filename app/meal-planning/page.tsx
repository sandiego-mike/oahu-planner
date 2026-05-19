"use client";

import { useState, useEffect } from "react";
import {
  Apple,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Coffee,
  Flame,
  Heart,
  Moon,
  Printer,
  Sparkles,
  Star,
  Sun,
  TentTree,
  Users,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShoppingCategory = {
  id: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  items: string[];
};

type BreakfastCard = {
  id: string;
  name: string;
  emoji: string;
  prepTime: string;
  cleanup: "Easy" | "Medium";
  quantities: string;
  ingredients: string[];
  tips: string[];
  optional: string[];
};

type DinnerCard = {
  id: string;
  name: string;
  emoji: string;
  cookTime: string;
  prep: "Easy" | "Medium";
  cleanup: "Easy" | "Medium";
  grillFriendly: boolean;
  leftovers: "High" | "Medium" | "Low";
  quantities: string;
  ingredients: string[];
  servingStation: string;
  tips: string[];
};

type LunchIdea = {
  id: string;
  name: string;
  emoji: string;
  note: string;
  items: string[];
};

type SnackCategory = {
  label: string;
  emoji: string;
  items: string[];
};

type DiningOption = {
  name: string;
  location: string;
  vibe: string;
  note: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const shoppingCategories: ShoppingCategory[] = [
  {
    id: "protein",
    category: "Protein",
    icon: Flame,
    iconColor: "text-hibiscus",
    iconBg: "bg-hibiscus/10",
    items: [
      "Steaks — NY Strip or Ribeye bulk pack",
      "Carne asada (pre-marinated)",
      "Chicken thighs — family pack",
      "Chicken breasts — family pack",
      "Ground beef patties — pre-made",
      "Hot dogs (2 packs)",
      "Bacon (2–3 lbs)",
      "Breakfast sausage links",
      "Eggs (4–5 dozen)",
      "Deli meats — turkey + ham",
    ],
  },
  {
    id: "breakfast",
    category: "Breakfast Staples",
    icon: Coffee,
    iconColor: "text-sunrise",
    iconBg: "bg-sunrise/20",
    items: [
      "Bagels — 24 count bag",
      "Cream cheese (2 blocks)",
      "Bread (2 loaves)",
      "Greek yogurt multi-pack",
      "Granola — large bag",
      "Fresh fruit — bananas, strawberries, grapes",
      "Pancake mix — large box",
      "Frozen waffles (2 boxes)",
      "Frozen breakfast sandwiches (2 boxes)",
      "Bakery muffins — large pack",
      "Cereal (2 varieties)",
      "Oatmeal packets",
      "Orange juice — large",
      "Coffee + creamer",
      "Butter + syrup",
    ],
  },
  {
    id: "sides",
    category: "Sides & Starches",
    icon: Utensils,
    iconColor: "text-palm",
    iconBg: "bg-palm/10",
    items: [
      "Potatoes — 10 lb bag",
      "Rice — large bag",
      "Pasta — 4–5 lbs assorted",
      "Pasta sauce — 3–4 large jars",
      "Salad kits — 4–5 bags",
      "Chips — variety pack",
      "Hawaiian rolls (2 packs)",
      "Flour tortillas — 30 count pack",
      "Black beans — canned (4)",
      "Costco deli macaroni salad",
      "Costco deli pasta salad",
      "Garlic bread — frozen (3 loaves)",
    ],
  },
  {
    id: "snacks",
    category: "Snacks & Beach Food",
    icon: Apple,
    iconColor: "text-lagoon",
    iconBg: "bg-lagoon/10",
    items: [
      "Granola bars — variety box",
      "Trail mix — large bag",
      "Chips — variety individual bags",
      "Crackers — variety pack",
      "Fruit snacks / gummies",
      "Cookies — variety assortment",
      "Bananas (bunch)",
      "Apples or oranges",
      "String cheese",
      "Hummus + veggie tray",
      "Mixed nuts",
      "Zip-lock bags for portioning",
    ],
  },
  {
    id: "condiments",
    category: "Condiments & Sauces",
    icon: Sparkles,
    iconColor: "text-reef",
    iconBg: "bg-lagoon/10",
    items: [
      "Ketchup",
      "Mustard",
      "Mayonnaise",
      "BBQ sauce — large bottle",
      "Chipotle / adobo sauce",
      "Salsa — large jar",
      "Guacamole or avocados",
      "Sour cream",
      "Butter",
      "Olive oil",
      "Salt + pepper shakers",
      "Minced garlic — jar",
      "Teriyaki sauce",
      "Hot sauce",
    ],
  },
  {
    id: "desserts",
    category: "Desserts",
    icon: Star,
    iconColor: "text-hibiscus",
    iconBg: "bg-hibiscus/10",
    items: [
      "Cookies — large assortment pack",
      "Brownies — bakery pack",
      "Ice cream — large tub",
      "Cheesecake — Kirkland",
      "Fresh fruit trays (x2)",
      "Popsicles / ice bars",
    ],
  },
  {
    id: "drinks",
    category: "Drinks",
    icon: Waves,
    iconColor: "text-lagoon",
    iconBg: "bg-lagoon/10",
    items: [
      "Bottled water — 2 cases (40 count)",
      "Gatorade variety — 2 packs",
      "Soda variety — 2 packs",
      "Sparkling water",
      "Orange juice — large",
      "Apple juice",
      "Coffee — ground or pods",
      "Creamer — large",
      "Lemonade mix",
    ],
  },
];

const breakfastCards: BreakfastCard[] = [
  {
    id: "eggs-bacon",
    name: "Eggs, Bacon + Fruit",
    emoji: "🍳",
    prepTime: "20–25 min",
    cleanup: "Medium",
    quantities: "3 dozen eggs · 3–4 lbs bacon · 2 large fruit platters",
    ingredients: [
      "3 dozen eggs",
      "3–4 lbs bacon (Costco pack)",
      "2 large fruit platters or mixed bowls",
      "Butter / cooking spray",
      "Salt + pepper",
      "Toast (optional)",
    ],
    tips: [
      "Cook bacon in the oven at 400°F on a sheet pan — no pan babysitting and crispier results.",
      "Scramble eggs in the largest pan available in two batches.",
      "Set out fruit and bread while hot items finish — self-serve style.",
    ],
    optional: ["Toast", "Hot sauce", "Salsa on eggs", "Shredded cheese"],
  },
  {
    id: "bagel-bar",
    name: "Bagel Bar",
    emoji: "🥯",
    prepTime: "5–10 min",
    cleanup: "Easy",
    quantities: "24 bagels · 2 blocks cream cheese · 1 large fruit tray",
    ingredients: [
      "Costco bagel bag — 24 count",
      "2 blocks cream cheese (plain + flavored)",
      "Deli meats — optional add-on",
      "Fruit platter or mixed bowl",
      "Butter + jam (optional)",
    ],
    tips: [
      "Easiest breakfast on the list — zero cooking required.",
      "Set out a self-serve station and let everyone build their own.",
      "Slice all bagels the night before to save morning time.",
    ],
    optional: ["Smoked salmon", "Deli turkey or ham", "Sliced tomatoes", "Capers"],
  },
  {
    id: "yogurt-parfait",
    name: "Yogurt Parfait Bar",
    emoji: "🫙",
    prepTime: "5 min",
    cleanup: "Easy",
    quantities: "18–24 yogurt cups · 1 large granola bag · 2 fruit bowls",
    ingredients: [
      "Greek yogurt multi-pack (Costco)",
      "Large bag granola",
      "Mixed berries or fruit bowl",
      "Honey packets",
      "Granola bars as backup",
    ],
    tips: [
      "Zero cooking — set it out and walk away.",
      "Best for early departure mornings when people leave at different times.",
      "Prep fruit the night before to save even more time.",
    ],
    optional: ["Honey drizzle", "Nut butter packets", "Chia seeds", "Coconut flakes"],
  },
  {
    id: "breakfast-sandwiches",
    name: "Breakfast Sandwiches",
    emoji: "🥪",
    prepTime: "10–15 min",
    cleanup: "Easy",
    quantities: "2–3 Costco boxes (24–36 total) · fruit sides",
    ingredients: [
      "Costco frozen breakfast sandwiches (Jimmy Dean or similar)",
      "Fresh fruit sides",
      "OJ or juice",
      "Hot sauce (optional)",
    ],
    tips: [
      "Microwave in batches — fastest hot breakfast option on the list.",
      "Best for early departure days: 5:45 AM Lanikai, 6:15 AM Waimea Bay, 6:45 AM Lulumahu.",
      "Stock the freezer at check-in and pull as needed any morning.",
    ],
    optional: ["Extra fried eggs alongside", "Hot sauce bar", "Fruit smoothie if blender available"],
  },
  {
    id: "pancakes-sausage",
    name: "Pancakes + Sausage",
    emoji: "🥞",
    prepTime: "30–40 min",
    cleanup: "Medium",
    quantities: "2 large Costco pancake mix boxes · 3 lbs sausage links",
    ingredients: [
      "Pancake mix — large Costco box",
      "Eggs + milk (for batter)",
      "Sausage links or patties — 3 lbs",
      "Butter + syrup",
      "Fruit platter on the side",
    ],
    tips: [
      "Assembly-line pancake station: one person flipping continuously while others plate.",
      "Cook sausage first — keep warm in oven at 200°F while pancakes finish.",
      "Best for a slower morning — not ideal for early departure days.",
    ],
    optional: ["Blueberries in batter", "Whipped cream", "Banana slices", "Maple vs. regular syrup choice"],
  },
  {
    id: "waffles-fruit",
    name: "Waffles + Fruit",
    emoji: "🧇",
    prepTime: "15–20 min",
    cleanup: "Easy",
    quantities: "2–3 boxes frozen waffles (24–36 count) · 2 large fruit trays",
    ingredients: [
      "Frozen waffles — Costco Eggo-style, 2–3 boxes",
      "Butter + syrup",
      "Fresh fruit trays",
      "Whipped cream (optional)",
    ],
    tips: [
      "Rotate waffles through the toaster — very low effort, very high payoff.",
      "Set out a topping station: syrup, fruit, whipped cream.",
      "Great mid-week option when energy and motivation are lower.",
    ],
    optional: ["Peanut butter", "Fresh strawberries + cream", "Honey", "Nutella"],
  },
  {
    id: "grab-go",
    name: "Grab-and-Go Station",
    emoji: "🎒",
    prepTime: "2–5 min (set up night before)",
    cleanup: "Easy",
    quantities: "Pre-packed — set out the night before for maximum speed",
    ingredients: [
      "Granola bars — 1–2 boxes",
      "Bakery muffins — large pack",
      "Bananas or apples",
      "Individual yogurt cups",
      "Juice boxes or water bottles",
      "Single-serve cereal cups",
    ],
    tips: [
      "Best for early departure days: everything ready before anyone wakes up.",
      "Set everything out the night before in one visible spot.",
      "Pack extras into a small cooler bag for car breakfast on the road.",
      "No cooking, zero cleanup — pure grab and go.",
    ],
    optional: ["Trail mix bags", "String cheese", "Protein bars", "Hard-boiled eggs (pre-made)"],
  },
];

const dinnerCards: DinnerCard[] = [
  {
    id: "chipotle-bowls",
    name: "BBQ Chicken Chipotle Bowls",
    emoji: "🌶️",
    cookTime: "30–40 min",
    prep: "Medium",
    cleanup: "Easy",
    grillFriendly: true,
    leftovers: "High",
    quantities: "12–15 lbs chicken · 8–10 cups dry rice · 3–4 cans black beans",
    ingredients: [
      "12–15 lbs chicken thighs (Costco)",
      "8–10 cups rice (large pot or cooker)",
      "3–4 cans black beans — heated",
      "Chipotle / adobo sauce",
      "Salsa + sour cream",
      "Shredded cheese",
      "Lime wedges",
      "Cilantro (optional)",
    ],
    servingStation: "Station-style: rice → chicken → beans → toppings bar. Each person builds their own bowl — eliminates plating for 18.",
    tips: [
      "Grill or oven-bake chicken — both work for groups this size.",
      "A rice cooker is a game-changer for 18 people. Start rice first.",
      "Pre-mix chipotle sauce into cooked chicken for easy serving — no extra bowl.",
    ],
  },
  {
    id: "taco-night",
    name: "Carne Asada Taco Night",
    emoji: "🌮",
    cookTime: "25–35 min",
    prep: "Easy",
    cleanup: "Easy",
    grillFriendly: true,
    leftovers: "High",
    quantities: "12–15 lbs carne asada · 30-count tortilla pack · rice + beans sides",
    ingredients: [
      "Carne asada — pre-marinated Costco pack",
      "30-count flour tortillas",
      "Salsa — large jar",
      "Guacamole or avocados",
      "Sour cream + lime wedges",
      "Cilantro (optional)",
      "Rice (side)",
      "Refried or black beans (side)",
    ],
    servingStation: "Taco bar: warm tortillas → sliced meat → guac → salsa → toppings. Classic build-your-own format — works perfectly for all ages.",
    tips: [
      "Grill carne asada in batches, 6–8 min per side. Rest before slicing.",
      "Keep tortillas warm wrapped in foil on a low section of the grill.",
      "Put toppings in bowls or ramekins — self-serve bar keeps the line moving.",
    ],
  },
  {
    id: "steak-potatoes",
    name: "Steak + Potatoes + Salad",
    emoji: "🥩",
    cookTime: "40–50 min",
    prep: "Medium",
    cleanup: "Medium",
    grillFriendly: true,
    leftovers: "Medium",
    quantities: "18–22 steaks or 15 lbs bulk · 10 lb potatoes · 3–4 salad kits",
    ingredients: [
      "NY Strip or Ribeye — Costco bulk pack",
      "Potatoes — 10 lb bag",
      "3–4 Caesar or garden salad kits",
      "Butter + garlic",
      "Olive oil",
      "Salt + pepper + steak seasoning",
    ],
    servingStation: "Family-style: steaks on a large serving tray, potatoes in a bowl, salad kit in its bag. Simple and minimal dishes.",
    tips: [
      "Roast potatoes in the oven at 425°F while steaks grill — they finish at the same time.",
      "Season steaks simply: salt, pepper, garlic butter. That's all you need.",
      "Salad kits take 3 minutes to prep — perfect zero-effort side.",
    ],
  },
  {
    id: "burger-night",
    name: "Burger + Hot Dog Night",
    emoji: "🍔",
    cookTime: "25–35 min",
    prep: "Easy",
    cleanup: "Easy",
    grillFriendly: true,
    leftovers: "Low",
    quantities: "24 burger patties · 24 hot dogs · 24 Hawaiian rolls · chips + mac salad",
    ingredients: [
      "Ground beef patties — Costco pre-made",
      "24 hot dogs",
      "Hawaiian rolls — 2 packs",
      "Cheese slices",
      "Ketchup, mustard, mayo",
      "Lettuce, tomato, onion",
      "Chips — variety bags",
      "Costco deli macaroni salad",
    ],
    servingStation: "Classic cookout setup: grill station for burgers + dogs, toppings bar on the table, chips + salad off to the side.",
    tips: [
      "Easiest group dinner on the list — almost no prep required.",
      "Hawaiian rolls as buns are a crowd favorite for both burgers and sliders.",
      "Adults do burgers, kids love hot dogs — crowd-pleases every age group.",
    ],
  },
  {
    id: "hawaiian-bbq",
    name: "Hawaiian BBQ Chicken Night",
    emoji: "🍍",
    cookTime: "30–40 min",
    prep: "Easy",
    cleanup: "Easy",
    grillFriendly: true,
    leftovers: "High",
    quantities: "12–15 lbs chicken · 8–10 cups rice · 3–5 lbs Costco mac salad",
    ingredients: [
      "Chicken thighs or breasts — 12–15 lbs",
      "Teriyaki sauce — large bottle",
      "Rice — large pot",
      "Costco deli macaroni salad — 3–5 lbs",
      "Pineapple chunks (optional)",
      "Hawaiian rolls (side)",
    ],
    servingStation: "Plate-style: teriyaki chicken + rice + mac salad scoop. Simple, filling, Hawaii-themed — everyone loves this one.",
    tips: [
      "Marinate chicken in teriyaki for 30 min minimum — overnight is better.",
      "Costco deli mac salad is genuinely great and saves 20 min of prep.",
      "Grill pineapple rings alongside chicken for instant Hawaii vibes.",
    ],
  },
  {
    id: "pasta-night",
    name: "Pasta Night",
    emoji: "🍝",
    cookTime: "25–35 min",
    prep: "Easy",
    cleanup: "Medium",
    grillFriendly: false,
    leftovers: "High",
    quantities: "4–5 lbs pasta · 3–4 large sauce jars · 3–4 garlic bread loaves · 3 salad kits",
    ingredients: [
      "Spaghetti or penne — 4–5 lbs",
      "Pasta sauce — 3–4 large jars",
      "Ground beef or Italian sausage — 3 lbs (optional)",
      "Garlic bread — 3–4 frozen loaves",
      "Caesar or garden salad kits — 3",
      "Parmesan cheese shaker",
    ],
    servingStation: "Buffet style: large pasta pot, sauce ladle, bread basket, salad bowl. Self-serve eliminates plating chaos for 18.",
    tips: [
      "Cook pasta in two large pots simultaneously — one pot is never enough for 18 people.",
      "Keep sauce on low heat while everyone serves.",
      "Best on a tired evening — low effort and universally loved.",
    ],
  },
  {
    id: "leftover-night",
    name: "Leftover + Easy Night",
    emoji: "🍕",
    cookTime: "20–30 min",
    prep: "Easy",
    cleanup: "Easy",
    grillFriendly: false,
    leftovers: "Low",
    quantities: "4–6 frozen pizzas · whatever remains from previous nights",
    ingredients: [
      "Frozen pizzas — Costco, 4–6",
      "Leftover meats from previous dinners",
      "Chips + dip spread",
      "Salad kits",
      "Hawaiian rolls + deli cheese and meats",
    ],
    servingStation: "Completely unstructured — fridge raid + pizza in the oven. Set out a chips + snack spread while pizza bakes.",
    tips: [
      "Intentionally build one 'whatever we have' night to reduce mid-week pressure.",
      "Frozen pizzas in the oven while everyone showers = zero effort dinner.",
      "Best used after the longest excursion days — nobody wants to cook after 12 hours out.",
    ],
  },
];

const lunchIdeas: LunchIdea[] = [
  {
    id: "sandwich-station",
    name: "Sandwich Station",
    emoji: "🥪",
    note: "Set out all components and let everyone build their own. Pre-bag them for the beach.",
    items: ["Deli turkey + ham", "Bread or Hawaiian rolls", "Cheese slices", "Lettuce, tomato", "Mustard + mayo"],
  },
  {
    id: "wraps",
    name: "Wraps To Go",
    emoji: "🌯",
    note: "Pre-wrap the night before. Store in a cooler. Grab in the morning and go.",
    items: ["Large flour tortillas", "Deli meats + cheese", "Lettuce", "Ranch or chipotle sauce"],
  },
  {
    id: "sliders",
    name: "Hawaiian Roll Sliders",
    emoji: "🥖",
    note: "Fast crowd-pleaser. Great for pool or beach days when lunch is back at the resort.",
    items: ["Hawaiian rolls (2 packs)", "Deli meats + cheese", "Mustard + mayo"],
  },
  {
    id: "pasta-salad-cooler",
    name: "Pasta Salad Cooler",
    emoji: "🥗",
    note: "Costco pasta salad travels perfectly in a cooler. No prep — just scoop and serve.",
    items: ["Costco deli pasta salad — 5 lb tub", "Plastic bowls + forks", "Drinks + ice"],
  },
  {
    id: "snack-packs",
    name: "Snack Pack Bags",
    emoji: "🎒",
    note: "Pre-made individual bags. Ideal for hike days — no lunch stop needed on the trail.",
    items: ["Crackers + string cheese", "Trail mix portion", "Whole fruit or apple", "Granola bar"],
  },
  {
    id: "chips-fruit",
    name: "Chips + Fruit Spread",
    emoji: "🍉",
    note: "Simplest beach lunch. Lay everything out on a beach blanket.",
    items: ["Chips — variety individual bags", "Cut fruit or fruit tray", "Hummus + dip", "Water + drinks"],
  },
];

const snackCategories: SnackCategory[] = [
  {
    label: "Beach Snacks",
    emoji: "🌊",
    items: ["Granola bars", "Chips — individual bags", "Fruit slices or whole fruit", "Trail mix portions", "String cheese", "Water + Gatorade"],
  },
  {
    label: "Post-Hike Snacks",
    emoji: "🥾",
    items: ["Protein bars", "Mixed nuts", "Banana + peanut butter", "Gatorade / electrolyte drinks", "Crackers + hummus", "String cheese"],
  },
  {
    label: "Kid Snacks",
    emoji: "👦",
    items: ["Fruit snacks / gummies", "Goldfish crackers", "Apple slices", "String cheese", "Juice boxes", "Animal crackers"],
  },
  {
    label: "Pool Snacks",
    emoji: "🏊",
    items: ["Chips + dip", "Fruit trays", "Popsicles / ice bars", "Cookies", "Sparkling water", "Snack mix"],
  },
  {
    label: "Late-Night Snacks",
    emoji: "🌙",
    items: ["Cookies or brownies", "Chips", "Ice cream", "Crackers + cheese", "Popcorn", "Cut fruit"],
  },
];

const diningOutOptions: DiningOption[] = [
  {
    name: "Monkeypod Kitchen",
    location: "Ko Olina",
    vibe: "Upscale casual — best resort splurge dinner of the week",
    note: "Walking distance from the resort. Reservation strongly recommended for 18.",
  },
  {
    name: "Longboards Bar & Grill",
    location: "Ko Olina",
    vibe: "Relaxed and beachy — good for a casual lunch or happy hour",
    note: "At the Ko Olina marina. Laid-back atmosphere, no reservation usually needed.",
  },
  {
    name: "Monkeypod Kapolei",
    location: "Kapolei (10–15 min)",
    vibe: "Same brand, local vibe — more accessible for large groups",
    note: "Near Ka Makana Aliʻi mall. Call ahead for party of 18.",
  },
  {
    name: "Giovanni's Shrimp Truck",
    location: "Haleʻiwa (North Shore)",
    vibe: "Legendary garlic shrimp — pairs with Tuesday Waimea Bay day",
    note: "Cash-friendly, outdoor picnic tables. Worth every minute of the wait.",
  },
  {
    name: "Adela's Country Eatery",
    location: "Waimānalo",
    vibe: "Local favorite — natural fit with Monday Halona Beach day",
    note: "Small and casual. Get there before the lunch rush for the best experience.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhilosophyCard({
  icon: Icon,
  title,
  text,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-3xl bg-white/80 p-5 shadow-soft ring-1 ring-white/70">
      <div className={twMerge("mb-3 inline-flex rounded-2xl p-3", iconBg)}>
        <Icon size={20} className={iconColor} />
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-ink/65">{text}</p>
    </div>
  );
}

function GroceryItem({
  itemKey,
  label,
  isChecked,
  onToggle,
}: {
  itemKey: string;
  label: string;
  isChecked: boolean;
  onToggle: (key: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(itemKey)}
      className={twMerge(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition hover:bg-sand/60 active:scale-[0.98]",
        isChecked && "opacity-50"
      )}
    >
      {isChecked ? (
        <CheckCircle2 size={17} className="shrink-0 text-palm" />
      ) : (
        <Circle size={17} className="shrink-0 text-ink/25" />
      )}
      <span className={twMerge("font-medium text-ink/80 leading-snug", isChecked && "line-through")}>
        {label}
      </span>
    </button>
  );
}

function BreakfastCardComp({ card }: { card: BreakfastCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{card.emoji}</span>
          <div>
            <h3 className="font-bold text-ink">{card.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge className="bg-sunrise/20 text-hibiscus">
                <Clock size={10} className="mr-1 inline" />
                {card.prepTime}
              </Badge>
              <Badge
                className={
                  card.cleanup === "Easy"
                    ? "bg-palm/10 text-palm"
                    : "bg-sunrise/20 text-hibiscus"
                }
              >
                Cleanup: {card.cleanup}
              </Badge>
            </div>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={twMerge("mt-1 shrink-0 text-reef transition", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="border-t border-reef/10 p-5 pt-4">
          <div className="mb-4 rounded-2xl bg-sand/70 px-4 py-3 text-sm">
            <span className="font-bold text-ink">For 18 people: </span>
            <span className="text-ink/70">{card.quantities}</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-ink/40">
                Ingredients
              </p>
              <ul className="space-y-1.5">
                {card.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2 text-sm text-ink/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-reef" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-ink/40">
                Quick tips
              </p>
              <ul className="space-y-2.5">
                {card.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-ink/70 leading-5">
                    <Sparkles size={13} className="mt-0.5 shrink-0 text-sunrise" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {card.optional.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/40">
                Optional add-ons
              </p>
              <div className="flex flex-wrap gap-2">
                {card.optional.map((opt) => (
                  <span
                    key={opt}
                    className="rounded-full bg-lagoon/10 px-3 py-1 text-xs font-semibold text-reef"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function DinnerCardComp({ card }: { card: DinnerCard }) {
  const [expanded, setExpanded] = useState(false);

  const leftoversStyle = {
    High: "bg-palm/10 text-palm",
    Medium: "bg-sunrise/20 text-hibiscus",
    Low: "bg-sand text-ink/50",
  }[card.leftovers];

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{card.emoji}</span>
          <div>
            <h3 className="font-bold text-ink">{card.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge className="bg-hibiscus/10 text-hibiscus">
                <Clock size={10} className="mr-1 inline" />
                {card.cookTime}
              </Badge>
              {card.grillFriendly && (
                <Badge className="bg-orange-50 text-orange-500">
                  <Flame size={10} className="mr-1 inline" />
                  Grill-friendly
                </Badge>
              )}
              <Badge className={leftoversStyle}>Leftovers: {card.leftovers}</Badge>
            </div>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={twMerge("mt-1 shrink-0 text-reef transition", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="border-t border-reef/10 p-5 pt-4">
          <div className="mb-3 rounded-2xl bg-sand/70 px-4 py-3 text-sm">
            <span className="font-bold text-ink">For 18 people: </span>
            <span className="text-ink/70">{card.quantities}</span>
          </div>

          <div className="mb-3 rounded-2xl bg-lagoon/10 px-4 py-3 text-sm">
            <span className="font-bold text-ink">Serving station: </span>
            <span className="text-ink/70">{card.servingStation}</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-ink/40">
                Ingredients
              </p>
              <ul className="space-y-1.5">
                {card.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2 text-sm text-ink/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-reef" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-ink/40">
                Tips
              </p>
              <ul className="space-y-2.5">
                {card.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-ink/70 leading-5">
                    <Sparkles size={13} className="mt-0.5 shrink-0 text-sunrise" />
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className={
                    card.cleanup === "Easy" ? "bg-palm/10 text-palm" : "bg-sunrise/20 text-hibiscus"
                  }
                >
                  Cleanup: {card.cleanup}
                </Badge>
                <Badge
                  className={
                    card.prep === "Easy" ? "bg-palm/10 text-palm" : "bg-sunrise/20 text-hibiscus"
                  }
                >
                  Prep: {card.prep}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "oahu-grocery-checked";

export default function MealPlanningPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        const s = new Set<string>();
        parsed.forEach((k) => s.add(k));
        setChecked(s);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  function toggleItem(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function resetChecked() {
    setChecked(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const totalItems = shoppingCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = shoppingCategories.reduce(
    (sum, cat) =>
      sum + cat.items.filter((item) => checked.has(`${cat.id}-${item}`)).length,
    0
  );
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <main className="min-h-screen">
      {/* ── SECTION 1: Overview ─────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="18 people · Ko Olina"
          title="Group meal planning"
          text="Cook simple, maximize beach time, and minimize stress. Flexible meal cards for 18 people — no strict day schedule, just good food and easy logistics."
        />

        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PhilosophyCard
            icon={Users}
            title="18 people"
            text="All quantities sized for the full group. Mix and match meals based on energy level, weather, and how the day went."
            iconBg="bg-lagoon/15"
            iconColor="text-lagoon"
          />
          <PhilosophyCard
            icon={Sun}
            title="Cook simple"
            text="Easy prep, minimal cleanup, no complicated recipes. Vacation cooking should feel enjoyable — not like work."
            iconBg="bg-sunrise/20"
            iconColor="text-hibiscus"
          />
          <PhilosophyCard
            icon={Waves}
            title="Maximize beach time"
            text="No meals assigned to specific days. Choose what sounds good based on how hungry and tired everyone is."
            iconBg="bg-reef/10"
            iconColor="text-reef"
          />
          <PhilosophyCard
            icon={ChefHat}
            title="Easy cleanup"
            text="Station-style serving for most meals reduces dishes significantly. Cook once, everyone serves themselves."
            iconBg="bg-palm/10"
            iconColor="text-palm"
          />
        </div>
      </section>

      {/* ── SECTION 2: Costco Shopping List ─────────────────────────────── */}
      <section className="bg-sand/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-hibiscus">
                Bulk shopping
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Costco master list
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Tap any item to mark it purchased. Progress saves automatically.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-sand"
              >
                <Printer size={14} />
                Print list
              </button>
              {checkedCount > 0 && (
                <button
                  onClick={resetChecked}
                  className="inline-flex items-center gap-2 rounded-full bg-hibiscus/10 px-4 py-2.5 text-sm font-bold text-hibiscus transition hover:-translate-y-0.5"
                >
                  <X size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 rounded-3xl bg-white/85 p-5 shadow-soft ring-1 ring-white/70">
            <div className="mb-2.5 flex items-center justify-between text-sm">
              <span className="font-bold text-ink">
                {checkedCount} of {totalItems} items checked
              </span>
              <span className="font-bold text-reef">{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lagoon to-reef transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {checkedCount === totalItems && totalItems > 0 && (
              <p className="mt-2.5 text-center text-sm font-bold text-palm">
                ✓ All items checked — you&apos;re ready to cook!
              </p>
            )}
          </div>

          {/* Category grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shoppingCategories.map((cat) => {
              const Icon = cat.icon;
              const catChecked = cat.items.filter((item) =>
                checked.has(`${cat.id}-${item}`)
              ).length;

              return (
                <Card key={cat.id} className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={twMerge("rounded-xl p-2", cat.iconBg)}>
                        <Icon size={15} className={cat.iconColor} />
                      </span>
                      <h3 className="font-bold text-ink">{cat.category}</h3>
                    </div>
                    <span className="text-xs font-bold text-ink/35">
                      {catChecked}/{cat.items.length}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {hydrated &&
                      cat.items.map((item) => (
                        <GroceryItem
                          key={item}
                          itemKey={`${cat.id}-${item}`}
                          label={item}
                          isChecked={checked.has(`${cat.id}-${item}`)}
                          onToggle={toggleItem}
                        />
                      ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Breakfasts ────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sunrise">
              Flexible · no day assignments
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Breakfast options
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Choose based on energy level and departure time. Grab-and-Go on early start
              mornings, cooked breakfasts on slow days.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {breakfastCards.map((card) => (
              <BreakfastCardComp key={card.id} card={card} />
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-sunrise/15 p-5">
            <div className="flex items-start gap-3">
              <Sun size={18} className="mt-0.5 shrink-0 text-hibiscus" />
              <div>
                <p className="font-bold text-ink">Early departure tip</p>
                <p className="mt-1 text-sm text-ink/70">
                  On Saturday (5:45 AM Lanikai), Tuesday (6:15 AM Waimea Bay), and Monday (6:45 AM
                  Lulumahu) — use the Grab-and-Go Station or pre-pack Breakfast Sandwiches. Set
                  everything out the night before so there is zero morning friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Dinners ──────────────────────────────────────────── */}
      <section className="bg-sand/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-reef">
              Flexible · choose based on energy
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Dinner options
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              After hike days or long beach days: easy meals. After shorter or relaxed days: full
              grill nights. All designed for 18 with station-style serving.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dinnerCards.map((card) => (
              <DinnerCardComp key={card.id} card={card} />
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-lagoon/10 p-5">
            <div className="flex items-start gap-3">
              <Flame size={18} className="mt-0.5 shrink-0 text-hibiscus" />
              <div>
                <p className="font-bold text-ink">Grill strategy for 18</p>
                <p className="mt-1 text-sm text-ink/70">
                  Cook in batches and keep finished food warm in the oven at 200°F. Station-style
                  serving eliminates the chaos of plating for 18. Always put chips + drinks out
                  first — people graze while the main course finishes cooking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Lunches ──────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-palm">
              Pack and go
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Beach + excursion lunches
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Simple, portable, and cooler-friendly. Most can be packed the night before for
              early beach and hike departure days.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lunchIdeas.map((lunch) => (
              <Card key={lunch.id} className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl leading-none">{lunch.emoji}</span>
                  <h3 className="font-bold text-ink">{lunch.name}</h3>
                </div>
                <p className="mb-3 text-sm leading-6 text-ink/65">{lunch.note}</p>
                <div className="space-y-1.5">
                  {lunch.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-ink/65">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-palm" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-palm/10 p-5">
            <div className="flex items-start gap-3">
              <TentTree size={18} className="mt-0.5 shrink-0 text-palm" />
              <div>
                <p className="font-bold text-ink">Cooler packing tip</p>
                <p className="mt-1 text-sm text-ink/70">
                  Dedicate one large soft cooler as the &ldquo;lunch cooler&rdquo; — pre-packed each morning.
                  Keeps sandwiches, fruit, drinks, and snack bags cold without having to open the
                  main food cooler all day at the beach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Snacks ───────────────────────────────────────────── */}
      <section className="bg-sand/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-hibiscus">
              Always available
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Snack guide
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Organized by when and where. Stock the resort kitchen on arrival day and
              they&apos;ll disappear fast.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snackCategories.map((cat) => (
              <Card key={cat.label} className="p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="text-2xl leading-none">{cat.emoji}</span>
                  <h3 className="font-bold text-ink">{cat.label}</h3>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-ink/70">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lagoon" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Optional Dining Out ──────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
              Occasional treat
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Optional dining out
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Not the focus — but 1–2 restaurant nights make a nice break from resort cooking.
              These pair naturally with the itinerary.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diningOutOptions.map((place) => (
              <Card key={place.name} className="p-5">
                <h3 className="font-bold text-ink">{place.name}</h3>
                <Badge className="mt-2">{place.location}</Badge>
                <p className="mt-3 text-sm leading-6 text-ink/65">{place.vibe}</p>
                <p className="mt-2 text-xs leading-5 text-ink/40">{place.note}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white/70 p-5 shadow-soft ring-1 ring-white/70">
            <div className="flex items-start gap-3">
              <Moon size={18} className="mt-0.5 shrink-0 text-reef" />
              <div>
                <p className="font-bold text-ink">Dining out philosophy</p>
                <p className="mt-1 text-sm text-ink/70">
                  Aim for 1–2 restaurant nights max. The goal is to spend money on experiences, not
                  every meal. Cooking at the resort keeps the group together, saves significantly on
                  cost for 18 people, and makes mornings and evenings feel like actual vacation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[28px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Ready for Ko Olina.</p>
            <p className="mt-1 text-sm text-white/65">
              Cook simple, eat well, and spend more time where it counts — the beach.
            </p>
          </div>
          <div className="flex gap-2 text-sunrise">
            <Sun />
            <Waves />
            <TentTree />
            <Heart />
            <Star />
          </div>
        </div>
      </footer>
    </main>
  );
}
