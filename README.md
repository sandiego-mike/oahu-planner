# Oahu Family Vacation Planner

A polished, mobile-friendly Next.js website for the May 22-29 Oahu family trip based at Marriott's Ko Olina Beach Club.

## Features

- Tropical home page with countdown, weather note, resort details, and quick day links
- Dark/light mode toggle and rotating featured activities
- Expandable daily itinerary cards with drive times, parking, crowd tips, difficulty, walking distance, teen-friendly notes, and no-permit badges
- Family suggestions, comments, emoji votes, and interest levels
- Firebase-ready dynamic storage with local browser fallback when Firebase is not configured
- Google Maps embed with filters for beaches, trails, food, shave ice, Made in Hawaii stops, golf, and resort locations
- Made in Hawaii explorer for local production experiences, including coffee, cacao/chocolate, pineapple, macadamia, breweries, distilleries, shave ice, poke, and shrimp trucks
- Golf on Oahu explorer with course map, pricing notes, difficulty, scenic rating, rentals, driving range info, twilight notes, booking links, and Ko Olina route-fit recommendations
- Searchable food explorer for local Hawaiian food, shrimp trucks, poke, coffee, breweries, farmers markets, desserts, and shaved ice
- Farmers Markets section populated from the Oʻahu weekly market schedule, with day filters, hours, regions, addresses, route-fit logic, Google Maps embeds, and add-to-itinerary suggestions
- Reusable route map system with clickable pins, color-coded day layers, drive-time estimates, leave-by notes, parking warnings, scenic pins, and market overlays
- Beach explorer with crowd, parking, snorkeling, swimming, amenities, family fit, and sunset ratings
- Trail explorer with distance, estimated time, mud, stream crossings, parking, crowd, nearby food, beach pairings, and permit status
- Activity filters for easy, teen-friendly, waterfall, beach, low crowds, early morning, relaxing, adventure, and scenic
- Optional memory wall with captions, photo URLs, and favorite moments
- Interactive packing checklist, collaborative grocery list, trip timing helpers, and editable shared budget estimate
- Admin-style planning panel with reorder controls and modular structure for future trips
- Responsive layout for phones, tablets, and desktop

Note: Lulumahu Falls is included as a permit-required candidate, not a default no-permit recommendation. Official Hawaii DOFAW materials state that Lulumahu requires a reservation/permit, so the planner flags it for review.

Farmers market source: the recurring market names, operating days, and hours are based on Waikīkī Beach Stays' "Oʻahu Farmers & Local Markets: Weekly Schedule" page, updated Apr 14, 2026. Address, region, coordinate, and route-fit fields are app data enrichments for mapping and itinerary recommendations.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

The site works immediately with local browser storage. Add Firebase variables when you want shared family submissions across devices.

## Firebase Setup

Create a Firebase web app and enable Firestore. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firestore collections used:

- `suggestions`
- `comments`

For a private family planner, start with authenticated or invite-only rules before sharing the URL broadly.

## Google Maps

The route map uses the Google Maps JavaScript API, which requires a browser API key.

1. In Google Cloud Console, create or select a project.
2. Enable **Maps JavaScript API**.
3. Add billing for the project.
4. Create an API key and restrict it to your local/deployed domains.
5. Add the key to `.env.local`:

   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
   ```

6. Restart the local server.

Without a valid key, the app now falls back to an embedded public Google map, but the full interactive route and marker map requires the JavaScript API key.

The map supports road map, satellite, and terrain modes, route polylines, numbered itinerary stops, nearby starred attractions, and click cards.

## Deploying on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

Recommended Vercel settings:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: leave default

## Editing The Trip

Most trip content lives in:

- `lib/trip-data.ts`

The main interface lives in:

- `app/page.tsx`

Update itinerary days, restaurants, places, tags, and packing items there.
