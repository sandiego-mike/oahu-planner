"use client";

import { useState } from "react";
import { Heart, Search, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { golfCourses } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function GolfPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(golfCourses[0]?.id ?? "");
  const filters = [
    "all",
    "Near Ko Olina",
    "Ocean Views",
    "Jungle Course",
    "Beginner Friendly",
    "Practice Facilities",
    "Rental Clubs",
    "More Affordable",
    "Resort Luxury",
    "Mountain Views"
  ];

  const visible = golfCourses.filter((course) => {
    const matchesFilter =
      filter === "all" ||
      course.tags.includes(filter) ||
      course.recommendationLabels.includes(filter);
    const haystack =
      `${course.name} ${course.tags.join(" ")} ${course.recommendationLabels.join(" ")} ${course.notes}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  const selected =
    golfCourses.find((c) => c.id === selectedId) ?? visible[0] ?? golfCourses[0];
  const premium = golfCourses.filter((c) => !c.tags.includes("More Affordable"));
  const casual = golfCourses.filter((c) => c.tags.includes("More Affordable"));

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Scenic tee times"
          title="Golf on Oahu"
          text="Approachable vacation golf focused on Ko Olina convenience, scenery, transparent rate notes, family fit, and realistic drive times."
        />
        <div className="mx-auto mb-5 grid max-w-6xl gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-3xl bg-white/85 px-4 py-3 shadow-soft text-ink/70">
            <Search size={18} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search ocean views, jungle, rentals, twilight, beginner..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            className="rounded-3xl border border-reef/10 bg-white/85 px-4 py-3 font-bold text-ink shadow-soft outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {filters.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="overflow-hidden p-3">
            <iframe
              title="Golf course map"
              className="h-[390px] w-full rounded-[24px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${selected.name} ${selected.address}`)}&output=embed`}
            />
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {selected.recommendationLabels.map((label) => (
                  <Badge
                    key={label}
                    className={label === "Most Convenient Option" ? "bg-sunrise/20 text-hibiscus" : ""}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
              <h3 className="mt-3 text-3xl font-bold text-ink">{selected.name}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{selected.notes}</p>
              <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
                <p><strong className="text-ink">18 holes:</strong> {selected.price18}</p>
                <p><strong className="text-ink">9 holes:</strong> {selected.price9 ?? "Check course"}</p>
                <p><strong className="text-ink">Twilight:</strong> {selected.twilight ?? "Check course"}</p>
                <p><strong className="text-ink">Drive:</strong> {selected.driveFromKoOlina}</p>
                <p><strong className="text-ink">Rentals:</strong> {selected.rentalClubs}</p>
                <p><strong className="text-ink">Range:</strong> {selected.drivingRange}</p>
                <p><strong className="text-ink">Best tee time:</strong> {selected.bestTeeTime}</p>
                <p><strong className="text-ink">Weather:</strong> {selected.weatherWindNote}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>Scenic {selected.scenicRating}/5</Badge>
                <Badge>Beginner {selected.beginnerRating}/5</Badge>
                <Badge>Family {selected.familyRating}/5</Badge>
                <Badge>{selected.access}</Badge>
              </div>
              <a
                href={selected.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-2xl bg-reef px-4 py-3 font-bold text-white"
              >
                Book/check current rates
              </a>
            </div>
          </Card>
          <div className="flex max-h-[760px] flex-col gap-3 overflow-auto pr-1 soft-scroll">
            {visible.map((course) => (
              <Card
                key={course.id}
                className={twMerge(
                  "cursor-pointer p-4 transition hover:-translate-y-0.5",
                  selected.id === course.id && "ring-2 ring-reef"
                )}
              >
                <button onClick={() => setSelectedId(course.id)} className="block w-full text-left">
                  <div className="flex gap-3">
                    <img
                      src={course.photo}
                      alt=""
                      className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-ink">{course.name}</h3>
                      <p className="mt-1 text-sm text-ink/65">
                        {course.driveFromKoOlina} from Ko Olina · {course.difficulty}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink/65">{course.price18}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {course.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-sand px-2 py-1 text-[11px] font-bold text-ink"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-6xl gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-2xl font-bold text-ink">Premium scenic picks</h3>
            <div className="mt-4 grid gap-2">
              {premium.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-sand/70 p-3 text-sm font-bold text-ink"
                >
                  {course.name} · {course.recommendationLabels[0]}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-2xl font-bold text-ink">More affordable / casual options</h3>
            <div className="mt-4 grid gap-2">
              {casual.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-sand/70 p-3 text-sm font-bold text-ink"
                >
                  {course.name} · {course.driveFromKoOlina}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[28px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Ready for Ko Olina.</p>
            <p className="mt-1 text-sm text-white/65">
              Early mornings, flexible afternoons, and a shared place for every good idea.
            </p>
          </div>
          <div className="flex gap-2 text-sunrise">
            <Sun /><Waves /><TentTree /><Heart /><Star />
          </div>
        </div>
      </footer>
    </main>
  );
}
