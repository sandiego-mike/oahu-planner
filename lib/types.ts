export type Category =
  | "trail"
  | "beach"
  | "food"
  | "farmers-market"
  | "brewery"
  | "distillery"
  | "resort"
  | "shaved-ice"
  | "made-in-hawaii"
  | "golf"
  | "scenic";

export type Interest = "maybe" | "interested" | "must-do";

export type TripComment = {
  id: string;
  itemId: string;
  author: string;
  text: string;
  reaction?: string;
  interest?: Interest;
  createdAt: string;
};

export type Suggestion = {
  id: string;
  author: string;
  title: string;
  category: Category | "memory" | "general";
  notes: string;
  link?: string;
  imageUrl?: string;
  votes: Record<string, number>;
  createdAt: string;
};

export type Place = {
  id: string;
  name: string;
  category: Category;
  day?: string;
  address: string;
  driveFromResort: string;
  tags: string[];
  lat: number;
  lng: number;
};

export type Beach = {
  id: string;
  name: string;
  image: string;
  crowd: "Low" | "Medium" | "High";
  parking: "Easy" | "Medium" | "Hard";
  snorkeling: string;
  swimming: string;
  amenities: string;
  familyScore: number;
  sunsetScore: number;
  notes: string;
  tags: string[];
};

export type Trail = {
  id: string;
  name: string;
  image: string;
  distance: string;
  time: string;
  difficulty: "Easy" | "Easy-Moderate" | "Moderate";
  permit: "No permit" | "Permit required";
  mud: "Low" | "Medium" | "High";
  streams: string;
  crowd: "Low" | "Medium" | "High";
  parking: "Easy" | "Medium" | "Hard";
  nearbyFood: string;
  beachPairing: string;
  notes: string;
  tags: string[];
};

export type FarmerMarket = {
  id: string;
  name: string;
  days: string[];
  hours: string;
  location: string;
  address: string;
  region: "West Side" | "Central" | "North Shore" | "Windward" | "Honolulu" | "Waikiki" | "East Honolulu";
  lat: number;
  lng: number;
  photo: string;
  nearby: {
    beaches: string[];
    trails: string[];
    food: string[];
  };
  bestItineraryDays: string[];
  recommendedStop: string;
  driveFromResort: string;
  parkingWarning?: string;
};

export type RoutePlan = {
  dayId: string;
  label: string;
  color: string;
  leaveBy: string;
  totalDrive: string;
  trafficNote: string;
  parkingWarnings: string[];
  scenicPins: string[];
  stops: string[];
};

export type MadeInHawaiiLocation = {
  id: string;
  name: string;
  category: "coffee" | "macadamia" | "cacao" | "brewery" | "distillery" | "pineapple" | "food-production" | "shave-ice" | "poke" | "shrimp";
  address: string;
  region: string;
  lat: number;
  lng: number;
  photoGallery: string[];
  onsiteProduction: boolean;
  familyFriendly: boolean;
  tasting: string;
  duration: string;
  itineraryCompatibility: string[];
  scenicValue: number;
  notes: string;
  mapQuery: string;
};

export type Memory = {
  id: string;
  dayId: string;
  author: string;
  photoUrl: string;
  caption: string | null;
  createdAt: string;
};

export type SavedPlace = {
  id: string;
  foodCategory: string;
  name: string;
  address: string | null;
  familyRating: number | null;
  photoUrl: string | null;
  mapsUrl: string | null;
  website: string | null;
  placeType: string | null;
  userNote: string | null;
  addedBy: string;
  createdAt: string;
};

export type GolfCourse = {
  id: string;
  name: string;
  website: string;
  address: string;
  lat: number;
  lng: number;
  access: "Public" | "Resort/Public" | "Municipal" | "Military-affiliated" | "Semi-private";
  driveFromKoOlina: string;
  price18: string;
  price9?: string;
  twilight?: string;
  rentalClubs: string;
  drivingRange: string;
  difficulty: "Beginner-friendly" | "Intermediate" | "Challenging";
  scenicRating: number;
  beginnerRating: number;
  familyRating: number;
  duration: string;
  bestTeeTime: string;
  weatherWindNote: string;
  itineraryCompatibility: string[];
  tags: string[];
  recommendationLabels: string[];
  photo: string;
  notes: string;
  pricingUpdated: string;
};

export type ItineraryDay = {
  id: string;
  date: string;
  title: string;
  theme: string;
  wakeUp: string;
  hero: string;
  difficulty: "Easy" | "Easy-Moderate" | "Flexible";
  walking: string;
  teenFriendly: boolean;
  noPermit: boolean;
  driveTime: string;
  parking: string;
  crowdTip: string;
  trail: string;
  beach: string;
  food: string[];
  optional: string[];
  tags: string[];
  schedule: { time: string; plan: string }[];
};
