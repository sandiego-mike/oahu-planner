"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  Heart,
  Loader2,
  Star,
  Sun,
  TentTree,
  Trash2,
  Waves,
  X
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { addMemory, deleteMemory, uploadMemoryPhoto } from "@/lib/store";
import { useData } from "@/components/DataProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Memory } from "@/lib/types";

const CHALLENGES = [
  {
    dayId: "fri-arrival",
    date: "Friday, May 22",
    shortDate: "May 22",
    emoji: "🌺",
    title: "Arrival Day",
    mission: "Snap your first Oahu moment — the resort, the ocean view, a welcome drink, or just your happy face stepping off the plane."
  },
  {
    dayId: "sat-north-shore",
    date: "Saturday, May 23",
    shortDate: "May 23",
    emoji: "🌊",
    title: "North Shore",
    mission: "Capture something epic on the North Shore. Giant waves, shrimp truck plates, Matsumoto's, or that priceless reaction face on the first bite."
  },
  {
    dayId: "sun-windward",
    date: "Sunday, May 24",
    shortDate: "May 24",
    emoji: "🥾",
    title: "Into the Wild",
    mission: "Best nature shot of the day. A trail, waterfall, jungle canopy, or something breathtakingly beautiful you almost walked past."
  },
  {
    dayId: "mon-town",
    date: "Monday, May 25",
    shortDate: "May 25",
    emoji: "🌆",
    title: "City Vibes",
    mission: "Find something uniquely Hawaiian in the city. A mural, a local shop, a street sign, or a moment that just screams Aloha spirit."
  },
  {
    dayId: "tue-beach",
    date: "Tuesday, May 26",
    shortDate: "May 26",
    emoji: "🤙",
    title: "Beach Day",
    mission: "The best sunset photo of the trip. Golden hour, silhouettes, kids in the waves — whatever makes you feel like you never want to leave."
  },
  {
    dayId: "wed-flex",
    date: "Wednesday, May 27",
    shortDate: "May 27",
    emoji: "🎯",
    title: "Flex Wednesday",
    mission: "Choose your own adventure — capture whatever surprised you most today. Something you didn't plan but ended up being the best part."
  },
  {
    dayId: "thu-adventure",
    date: "Thursday, May 28",
    shortDate: "May 28",
    emoji: "📸",
    title: "History + Nature",
    mission: "One meaningful photo. History, nature, or a quiet family moment. Make it the kind of photo you'll still show people in 10 years."
  },
  {
    dayId: "fri-last",
    date: "Friday, May 29",
    shortDate: "May 29",
    emoji: "💙",
    title: "Last Aloha",
    mission: "What will you miss most? A place, a person, a view, a food. The best memory of the whole trip — make it count."
  }
];

function getTodayChallenge() {
  const today = new Date();
  const tripDates: Record<string, string> = {
    "fri-arrival": "2026-05-22",
    "sat-north-shore": "2026-05-23",
    "sun-windward": "2026-05-24",
    "mon-town": "2026-05-25",
    "tue-beach": "2026-05-26",
    "wed-flex": "2026-05-27",
    "thu-adventure": "2026-05-28",
    "fri-last": "2026-05-29"
  };
  const todayStr = today.toISOString().split("T")[0];
  return Object.entries(tripDates).find(([, d]) => d === todayStr)?.[0] ?? null;
}

function AddPhotoModal({
  defaultDayId,
  onClose
}: {
  defaultDayId: string;
  onClose: () => void;
}) {
  const [dayId, setDayId] = useState(defaultDayId);
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pastedUrl, setPastedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadError("");
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearFile() {
    setSelectedFile(null);
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const photoReady = uploadMode === "file" ? !!selectedFile : !!pastedUrl.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !photoReady) return;
    setSaving(true);
    setUploadError("");

    let finalUrl = "";
    if (uploadMode === "file" && selectedFile) {
      const url = await uploadMemoryPhoto(selectedFile);
      if (!url) {
        setUploadError("Upload failed — the storage bucket may not be set up yet. See setup instructions below, or paste a URL instead.");
        setSaving(false);
        return;
      }
      finalUrl = url;
    } else {
      finalUrl = pastedUrl.trim();
    }

    await addMemory({ dayId, author: author.trim(), photoUrl: finalUrl, caption: caption.trim() || null });
    setSaving(false);
    window.dispatchEvent(new Event("oahu-data-refresh"));
    onClose();
  }

  const challenge = CHALLENGES.find((c) => c.dayId === dayId);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-float overflow-hidden">
        <div className="flex items-center justify-between border-b border-reef/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-hibiscus">Add Photo</p>
            <h3 className="text-xl font-bold text-ink">Memory Wall</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/40 hover:bg-sand hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5 grid gap-4">
          {/* Day selector */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
              Which day?
            </label>
            <select
              className="w-full rounded-2xl border border-reef/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
              value={dayId}
              onChange={(e) => setDayId(e.target.value)}
            >
              {CHALLENGES.map((c) => (
                <option key={c.dayId} value={c.dayId}>
                  {c.emoji} {c.shortDate} — {c.title}
                </option>
              ))}
            </select>
            {challenge && (
              <p className="mt-2 rounded-2xl bg-lagoon/8 px-3 py-2 text-xs leading-5 text-ink/60 italic">
                Mission: {challenge.mission}
              </p>
            )}
          </div>

          {/* Upload area */}
          {uploadMode === "file" ? (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                Photo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div>
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-44 w-full rounded-2xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute right-2 top-2 rounded-full bg-ink/60 p-1.5 text-white backdrop-blur-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs font-bold text-reef underline"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-reef/30 py-10 text-center transition hover:border-reef hover:bg-reef/5 active:scale-[0.98]"
                >
                  <div className="rounded-2xl bg-reef/10 p-4 text-reef">
                    <Camera size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-ink">Tap to add a photo</p>
                    <p className="mt-0.5 text-xs text-ink/45">Camera or photo library</p>
                  </div>
                </button>
              )}
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className="mt-2 text-[11px] text-ink/40 underline"
              >
                Or paste a URL instead
              </button>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                Photo URL
              </label>
              <input
                className="w-full rounded-2xl border border-reef/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
                placeholder="Paste a direct image link (.jpg, .png, etc.)"
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className="mt-2 text-[11px] text-ink/40 underline"
              >
                ← Back to file upload
              </button>
            </div>
          )}

          {uploadError && (
            <p className="rounded-2xl bg-hibiscus/10 px-3 py-2 text-xs text-hibiscus">{uploadError}</p>
          )}

          {/* Your name */}
          <input
            className="rounded-2xl border border-reef/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          {/* Caption */}
          <textarea
            className="min-h-16 rounded-2xl border border-reef/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
            placeholder="Caption — optional"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-sand px-4 py-3 text-sm font-bold text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!author.trim() || !photoReady || saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-4 py-3 text-sm font-bold text-white disabled:opacity-50 transition hover:-translate-y-0.5"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {uploadMode === "file" ? "Uploading…" : "Saving…"}
                </>
              ) : (
                <>
                  <Camera size={16} />
                  Add to Memory Wall
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MemoryPhoto({ memory, challenge }: { memory: Memory; challenge: typeof CHALLENGES[number] | undefined }) {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [imgError, setImgError] = useState(false);

  async function handleDelete() {
    if (nameInput.trim().toLowerCase() !== memory.author.trim().toLowerCase()) {
      setNameInput("");
      return;
    }
    setDeleting(true);
    await deleteMemory(memory.id);
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <div className="group relative overflow-hidden rounded-[24px] bg-sand shadow-soft">
      {imgError ? (
        <div className="flex h-56 items-center justify-center bg-lagoon/10 text-reef">
          <Camera size={36} />
        </div>
      ) : (
        <img
          src={memory.photoUrl}
          alt={memory.caption ?? ""}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}
      <div className="p-3">
        {challenge && (
          <span className="text-xs font-bold text-hibiscus">
            {challenge.emoji} {challenge.shortDate} — {challenge.title}
          </span>
        )}
        {memory.caption && (
          <p className="mt-1 text-sm font-semibold text-ink leading-5">{memory.caption}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-ink/45">{memory.author}</p>
          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              className="rounded-full p-1 text-ink/20 transition hover:bg-hibiscus/10 hover:text-hibiscus"
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                className="w-24 rounded-xl border border-reef/10 bg-white px-2 py-1 text-xs outline-none"
                placeholder={memory.author}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-hibiscus px-2 py-1 text-[11px] font-bold text-white"
              >
                {deleting ? "…" : "Delete"}
              </button>
              <button
                onClick={() => { setConfirm(false); setNameInput(""); }}
                className="rounded-xl bg-sand px-2 py-1 text-[11px] font-bold text-ink"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DayChallengeCard({
  challenge,
  memories,
  isToday
}: {
  challenge: typeof CHALLENGES[number];
  memories: Memory[];
  isToday: boolean;
}) {
  const [open, setOpen] = useState(isToday);
  const [modalOpen, setModalOpen] = useState(false);
  const dayMemories = memories.filter((m) => m.dayId === challenge.dayId);

  return (
    <div className={twMerge(
      "rounded-[28px] overflow-hidden shadow-soft ring-1",
      isToday ? "ring-reef bg-gradient-to-br from-white to-lagoon/8" : "ring-white/70 bg-white/85"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={twMerge(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl",
            isToday ? "bg-reef/15" : "bg-sand"
          )}>
            {challenge.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-hibiscus">{challenge.date}</p>
              {isToday && <Badge className="bg-reef text-white text-[10px] px-2 py-0.5">Today</Badge>}
            </div>
            <h3 className="text-lg font-bold text-ink">{challenge.title}</h3>
            <p className="mt-0.5 text-sm leading-5 text-ink/60 line-clamp-1">{challenge.mission}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {dayMemories.length > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-lagoon/10 px-2.5 py-1 text-xs font-bold text-reef">
              <Camera size={12} /> {dayMemories.length}
            </span>
          )}
          <ChevronDown
            size={18}
            className={twMerge("text-reef/70 transition", open && "rotate-180")}
          />
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-reef/10"
        >
          <div className="p-5">
            {/* Mission box */}
            <div className={twMerge(
              "mb-4 rounded-2xl p-4",
              isToday ? "bg-reef/10" : "bg-sand/70"
            )}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-hibiscus mb-1">Photo Challenge</p>
              <p className="text-sm leading-6 text-ink/75">{challenge.mission}</p>
            </div>

            {/* Photos grid */}
            {dayMemories.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 mb-4">
                {dayMemories.map((m) => (
                  <MemoryPhoto key={m.id} memory={m} challenge={challenge} />
                ))}
              </div>
            ) : (
              <p className="mb-4 rounded-2xl bg-sand/50 py-6 text-center text-sm text-ink/45">
                No photos yet — be the first to add one!
              </p>
            )}

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-reef/30 px-5 py-3 text-sm font-bold text-reef transition hover:border-reef hover:bg-reef/5"
            >
              <Camera size={16} /> Add Photo
            </button>
          </div>
        </motion.div>
      )}

      {modalOpen && (
        <AddPhotoModal
          defaultDayId={challenge.dayId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function MemoryPage() {
  const { memories } = useData();
  const todayChallenge = getTodayChallenge();
  const [showAll, setShowAll] = useState(false);

  const allPhotos = [...memories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const visiblePhotos = showAll ? allPhotos : allPhotos.slice(0, 12);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-br from-lagoon/20 via-reef/10 to-sunrise/15" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-hibiscus">May 22–29, 2026</p>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-6xl">
            Memory Wall 📸
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/65 max-w-xl mx-auto">
            Every day has a photo mission. Add your shots, see the family&apos;s moments, and build the trip scrapbook together.
          </p>
          {todayChallenge && (() => {
            const c = CHALLENGES.find((ch) => ch.dayId === todayChallenge);
            return c ? (
              <div className="mx-auto mt-6 max-w-md rounded-[24px] bg-white/90 p-5 shadow-soft ring-1 ring-reef/30">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-reef">Today&apos;s Mission</p>
                <p className="mt-2 text-2xl font-bold text-ink">{c.emoji} {c.title}</p>
                <p className="mt-2 text-sm leading-6 text-ink/70">{c.mission}</p>
              </div>
            ) : null;
          })()}
        </div>
      </section>

      {/* Daily challenges */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="8 days, 8 missions"
          title="Daily photo challenges"
          text="Click any day to see the mission and add your photo. Today's challenge is open by default."
        />
        <div className="mx-auto max-w-4xl grid gap-4">
          {CHALLENGES.map((challenge) => (
            <DayChallengeCard
              key={challenge.dayId}
              challenge={challenge}
              memories={memories}
              isToday={challenge.dayId === todayChallenge}
            />
          ))}
        </div>
      </section>

      {/* Full gallery */}
      {allPhotos.length > 0 && (
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="All memories"
            title="The full wall"
            text="Every photo from every family member, in one place."
          />
          <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePhotos.map((m) => (
              <MemoryPhoto
                key={m.id}
                memory={m}
                challenge={CHALLENGES.find((c) => c.dayId === m.dayId)}
              />
            ))}
          </div>
          {allPhotos.length > 12 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-6 py-3 font-bold text-ink shadow-soft transition hover:-translate-y-0.5"
              >
                {showAll ? "Show less" : `Show all ${allPhotos.length} photos`}
              </button>
            </div>
          )}
        </section>
      )}

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
