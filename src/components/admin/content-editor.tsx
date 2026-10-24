"use client";

import { useActionState, useState, useRef } from "react";
import {
  DEFAULT_WORKSHOP_PHOTOS,
  type WorkshopItem,
  type SiteContent,
} from "@/lib/site-content";
import { DailyWorkshopSection } from "@/components/marketing/daily-workshop";
import { saveSiteContentAction } from "@/actions/admin-content";
import { SubmitButton } from "@/components/submit-button";
import {
  adminInput,
  adminLabel,
  adminPanel,
  adminPrimaryButton,
  adminTextarea,
} from "@/components/admin/admin-ui";

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${adminPanel} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 border-b border-cream/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-[-0.02em] text-cream">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-cream/35">{description}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function PhotoManager({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (newPhotos: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      onChange([...photos, data.url]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (indexToRemove: number) => {
    onChange(photos.filter((_, i) => i !== indexToRemove));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const list = e.target.value
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    onChange(list);
  };

  const togglePreset = (presetUrl: string) => {
    if (photos.includes(presetUrl)) {
      onChange(photos.filter((p) => p !== presetUrl));
    } else {
      onChange([...photos, presetUrl]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className={adminLabel}>
          Workshop Photos ({photos.length})
        </label>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="photo-upload-input"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-[2px] border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-soft transition hover:border-gold hover:bg-gold/20 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-gold-soft border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <span>📷</span> Upload photo from device
              </>
            )}
          </button>
        </div>
      </div>

      <textarea
        value={photos.join("\n")}
        onChange={handleTextChange}
        className={`${adminTextarea} min-h-20`}
        placeholder="Enter photo image URLs (one per line), or use upload button / click default presets below"
      />
      <p className="mt-1.5 text-xs text-cream/35">
        One photo URL per line. These images are shown on the workshop photo showcase.
      </p>

      {uploadError ? (
        <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>
      ) : null}

      {/* 4-5 Default Pictures Section */}
      <div className="mt-4 pt-3 border-t border-cream/10">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-soft">
            Default Professional Pictures (Click to add/remove)
          </p>
          <span className="text-[10px] text-cream/40">5 Curated Presets</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {DEFAULT_WORKSHOP_PHOTOS.map((preset) => {
            const isAdded = photos.includes(preset.url);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => togglePreset(preset.url)}
                className={`group relative aspect-[16/10] overflow-hidden rounded-[2px] border text-left transition cursor-pointer ${
                  isAdded
                    ? "border-gold ring-2 ring-gold/50 shadow-md"
                    : "border-cream/15 opacity-65 hover:opacity-100 hover:border-cream/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="size-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 flex flex-col justify-end">
                  <span className="text-[10px] font-medium leading-tight text-cream line-clamp-1">
                    {preset.label}
                  </span>
                  <span
                    className={`text-[9px] font-semibold mt-0.5 ${
                      isAdded ? "text-emerald-300" : "text-gold-soft"
                    }`}
                  >
                    {isAdded ? "✓ Added" : "+ Click to add"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Photos Thumbnails */}
      {photos.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-cream/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/45">
            Current Photos for this Workshop ({photos.length})
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-video overflow-hidden rounded-[2px] border border-cream/20 bg-black/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Workshop preview ${index + 1}`}
                  className="size-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute top-1 left-1 rounded-[1px] bg-black/60 px-1.5 py-0.5 text-[9px] text-cream/80">
                  #{index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  title="Remove photo"
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-950/85 text-xs text-red-200 opacity-90 transition hover:bg-red-700 hover:opacity-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ContentEditor({ content }: { content: SiteContent }) {
  const [state, formAction] = useActionState(saveSiteContentAction, null);

  const [workshops, setWorkshops] = useState<WorkshopItem[]>(() => {
    if (content.dailyWorkshops && content.dailyWorkshops.length > 0) {
      return content.dailyWorkshops;
    }
    return [content.dailyWorkshop];
  });

  const [activeWorkshopId, setActiveWorkshopId] = useState<string>(() => {
    return workshops[0]?.id || "ws-1";
  });

  const [showLivePreview, setShowLivePreview] = useState(false);

  const currentWorkshop =
    workshops.find((w) => w.id === activeWorkshopId) ||
    workshops[0] || {
      id: "ws-1",
      title: "",
      badge: "Live Daily Workshop",
      description: "",
      photos: [],
      meetingLink: "",
      time: "",
      date: "",
      isActive: true,
    };

  const updateCurrentWorkshop = (field: keyof WorkshopItem, value: unknown) => {
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === currentWorkshop.id ? { ...w, [field]: value } : w,
      ),
    );
  };

  const addWorkshop = () => {
    const newId = `ws-${Date.now()}`;
    const newWorkshop: WorkshopItem = {
      id: newId,
      title: "New Commercial Workshop Session",
      badge: "Upcoming Workshop",
      description:
        "Practical working session covering key commercial execution skills.",
      photos: [DEFAULT_WORKSHOP_PHOTOS[0].url],
      meetingLink: "",
      time: "4:00 PM – 5:00 PM EST",
      date: "Monday to Friday",
      isActive: true,
    };
    setWorkshops((prev) => [...prev, newWorkshop]);
    setActiveWorkshopId(newId);
  };

  const removeWorkshop = (idToRemove: string) => {
    if (workshops.length <= 1) return;
    setWorkshops((prev) => {
      const remaining = prev.filter((w) => w.id !== idToRemove);
      if (activeWorkshopId === idToRemove && remaining.length > 0) {
        setActiveWorkshopId(remaining[0].id);
      }
      return remaining;
    });
  };

  return (
    <form action={formAction} className="mt-8 grid gap-6">
      {state?.error ? (
        <div
          role="alert"
          className="border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm text-red-100"
        >
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div
          role="status"
          className="border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-100"
        >
          {state.success}
        </div>
      ) : null}

      <Section
        title="Home"
        description="The opening statement on the homepage."
      >
        <div>
          <label htmlFor="homeKicker" className={adminLabel}>
            Kicker
          </label>
          <input
            id="homeKicker"
            name="homeKicker"
            defaultValue={content.home.kicker}
            maxLength={120}
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="homeTitle" className={adminLabel}>
            Headline
          </label>
          <input
            id="homeTitle"
            name="homeTitle"
            defaultValue={content.home.title}
            maxLength={220}
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="homeIntro" className={adminLabel}>
            Introduction
          </label>
          <textarea
            id="homeIntro"
            name="homeIntro"
            defaultValue={content.home.intro}
            maxLength={1400}
            className={adminTextarea}
          />
        </div>
      </Section>

      <Section
        title="Daily Workshops"
        description="Manage multiple daily commercial workshops. Add, edit, or preview how sessions look on the live site."
        action={
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`inline-flex items-center gap-1.5 rounded-[2px] border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              showLivePreview
                ? "border-gold bg-gold text-navy shadow-xs"
                : "border-cream/30 bg-cream/10 text-cream hover:border-gold hover:text-gold-soft"
            }`}
          >
            {showLivePreview ? (
              <>
                <span>✏️</span> Back to Edit Form
              </>
            ) : (
              <>
                <span>👁️</span> Preview on Site
              </>
            )}
          </button>
        }
      >
        {/* Hidden inputs transmitting full workshops data */}
        <input
          type="hidden"
          name="workshopsJson"
          value={JSON.stringify(workshops)}
        />
        <input
          type="hidden"
          name="workshopTitle"
          value={currentWorkshop.title}
        />
        <input
          type="hidden"
          name="workshopDescription"
          value={currentWorkshop.description}
        />
        <input
          type="hidden"
          name="workshopBadge"
          value={currentWorkshop.badge}
        />
        <input
          type="hidden"
          name="workshopDate"
          value={currentWorkshop.date}
        />
        <input
          type="hidden"
          name="workshopTime"
          value={currentWorkshop.time}
        />
        <input
          type="hidden"
          name="workshopMeetingLink"
          value={currentWorkshop.meetingLink}
        />
        <input
          type="hidden"
          name="workshopIsActive"
          value={currentWorkshop.isActive ? "true" : "false"}
        />

        {showLivePreview ? (
          <div className="rounded-[4px] border border-gold/40 bg-[#061827] shadow-2xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream/15 bg-navy/90 px-4 py-2.5 text-xs text-cream/70">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400/80 inline-block" />
                <span className="size-2.5 rounded-full bg-amber-400/80 inline-block" />
                <span className="size-2.5 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-cream/50">
                  http://localhost:3001/ (Daily Workshop Section)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="font-semibold text-gold-soft text-[11px] uppercase tracking-wider">
                  Interactive Live Preview
                </span>
              </div>
            </div>
            <div className="p-1">
              <DailyWorkshopSection workshops={workshops} isPreview={true} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workshop Selection Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/50">
                  All Workshops ({workshops.length})
                </p>
                <span className="text-[11px] text-cream/40">
                  {workshops.filter((w) => w.isActive).length} Active on site
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {workshops.map((w, idx) => {
                  const isSelected = w.id === currentWorkshop.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setActiveWorkshopId(w.id)}
                      className={`flex items-center gap-2 rounded-[2px] border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? "border-gold bg-gold/15 text-gold-soft shadow-xs ring-1 ring-gold/40"
                          : "border-cream/15 bg-cream/5 text-cream/65 hover:border-cream/35 hover:text-cream"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          w.isActive ? "bg-emerald-400" : "bg-cream/25"
                        }`}
                      />
                      <span className="max-w-[170px] truncate">
                        {idx + 1}. {w.title || "Untitled Workshop"}
                      </span>
                      {!w.isActive ? (
                        <span className="text-[9px] text-cream/35">(Inactive)</span>
                      ) : null}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={addWorkshop}
                  className="inline-flex items-center gap-1.5 rounded-[2px] border border-dashed border-gold/50 bg-gold/[0.06] px-3 py-2 text-xs font-semibold text-gold-soft hover:border-gold hover:bg-gold/15 transition cursor-pointer"
                >
                  <span className="text-sm font-bold">+</span> Add Workshop
                </button>
              </div>
            </div>

            {/* Current Workshop Edit Form */}
            <div className="rounded-[2px] border border-cream/15 bg-cream/[0.02] p-4 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream/10 pb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`active-toggle-${currentWorkshop.id}`}
                    checked={currentWorkshop.isActive}
                    onChange={(e) =>
                      updateCurrentWorkshop("isActive", e.target.checked)
                    }
                    className="size-4 rounded border-cream/20 bg-cream/5 text-gold focus:ring-gold cursor-pointer"
                  />
                  <label
                    htmlFor={`active-toggle-${currentWorkshop.id}`}
                    className="text-sm font-semibold text-cream cursor-pointer"
                  >
                    Active (Show this workshop on the site)
                  </label>
                </div>

                {workshops.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeWorkshop(currentWorkshop.id)}
                    className="text-xs text-red-400/80 hover:text-red-300 transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>🗑️</span> Remove this workshop
                  </button>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={adminLabel}>Badge / Status Label</label>
                  <input
                    value={currentWorkshop.badge}
                    onChange={(e) =>
                      updateCurrentWorkshop("badge", e.target.value)
                    }
                    maxLength={100}
                    className={adminInput}
                    placeholder="e.g. Today · 4:00 PM EST or Live Workshop"
                  />
                </div>
                <div>
                  <label className={adminLabel}>
                    Meeting Link (Zoom / Google Meet / Teams)
                  </label>
                  <input
                    type="url"
                    value={currentWorkshop.meetingLink}
                    onChange={(e) =>
                      updateCurrentWorkshop("meetingLink", e.target.value)
                    }
                    maxLength={1000}
                    className={adminInput}
                    placeholder="https://meet.google.com/... or https://zoom.us/j/..."
                  />
                </div>
              </div>

              <div>
                <label className={adminLabel}>Workshop Title</label>
                <input
                  value={currentWorkshop.title}
                  onChange={(e) =>
                    updateCurrentWorkshop("title", e.target.value)
                  }
                  maxLength={250}
                  className={adminInput}
                  placeholder="e.g. Daily Commercial Sprint: Live Pipeline & Deal Review"
                />
              </div>

              <div>
                <label className={adminLabel}>Workshop Description</label>
                <textarea
                  value={currentWorkshop.description}
                  onChange={(e) =>
                    updateCurrentWorkshop("description", e.target.value)
                  }
                  maxLength={4000}
                  className={`${adminTextarea} min-h-28`}
                  placeholder="Detail the agenda, live pipeline scenarios, and takeaways for this workshop."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={adminLabel}>Date / Rhythm</label>
                  <input
                    value={currentWorkshop.date}
                    onChange={(e) =>
                      updateCurrentWorkshop("date", e.target.value)
                    }
                    maxLength={120}
                    className={adminInput}
                    placeholder="e.g. Monday to Friday or Every Wednesday"
                  />
                </div>
                <div>
                  <label className={adminLabel}>Time & Duration</label>
                  <input
                    value={currentWorkshop.time}
                    onChange={(e) =>
                      updateCurrentWorkshop("time", e.target.value)
                    }
                    maxLength={120}
                    className={adminInput}
                    placeholder="e.g. 4:00 PM – 5:00 PM EST"
                  />
                </div>
              </div>

              {/* Photo Manager with Device Upload + Default 5 Presets + Thumbnail view */}
              <PhotoManager
                photos={currentWorkshop.photos}
                onChange={(newPhotos) =>
                  updateCurrentWorkshop("photos", newPhotos)
                }
              />
            </div>
          </div>
        )}
      </Section>

      <Section
        title="Consultancy & Advisory (Calendly)"
        description="Configure your 1-on-1 commercial advisory booking link. Allows clients to directly book strategy meetings via Calendly."
      >
        <div>
          <label htmlFor="consultancyCalendlyUrl" className={adminLabel}>
            Calendly Booking URL
          </label>
          <input
            id="consultancyCalendlyUrl"
            name="consultancyCalendlyUrl"
            type="url"
            defaultValue={content.consultancy.calendlyUrl}
            maxLength={1000}
            className={adminInput}
            placeholder="https://calendly.com/your-team/30min-advisory"
          />
          <p className="mt-1.5 text-xs text-cream/35">
            When set, &quot;Book Consultation&quot; buttons on the Homepage, For Companies, and Contact pages will open this Calendly link.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="consultancyHeadline" className={adminLabel}>
              Advisory Headline
            </label>
            <input
              id="consultancyHeadline"
              name="consultancyHeadline"
              defaultValue={content.consultancy.headline}
              maxLength={250}
              className={adminInput}
              placeholder="e.g. Book a Strategic Commercial Advisory Call"
            />
          </div>
          <div>
            <label htmlFor="consultancyButtonText" className={adminLabel}>
              Button Text
            </label>
            <input
              id="consultancyButtonText"
              name="consultancyButtonText"
              defaultValue={content.consultancy.buttonText}
              maxLength={120}
              className={adminInput}
              placeholder="e.g. Schedule Consultation on Calendly"
            />
          </div>
        </div>

        <div>
          <label htmlFor="consultancyDescription" className={adminLabel}>
            Advisory Description
          </label>
          <textarea
            id="consultancyDescription"
            name="consultancyDescription"
            defaultValue={content.consultancy.description}
            maxLength={3000}
            className={adminTextarea}
            placeholder="Describe the consultation scope, who it is for, and what leadership can expect."
          />
        </div>
      </Section>

      <Section
        title="First Quota"
        description="Programme facts used across the site."
      >
        <div>
          <label htmlFor="firstQuotaSummary" className={adminLabel}>
            Short summary
          </label>
          <textarea
            id="firstQuotaSummary"
            name="firstQuotaSummary"
            defaultValue={content.firstQuota.summary}
            maxLength={600}
            className={adminTextarea}
          />
        </div>
        <div>
          <label htmlFor="firstQuotaDescription" className={adminLabel}>
            Full description
          </label>
          <textarea
            id="firstQuotaDescription"
            name="firstQuotaDescription"
            defaultValue={content.firstQuota.description}
            maxLength={5000}
            className={`${adminTextarea} min-h-40`}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstQuotaFormat" className={adminLabel}>
              Format
            </label>
            <input
              id="firstQuotaFormat"
              name="firstQuotaFormat"
              defaultValue={content.firstQuota.format}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaDuration" className={adminLabel}>
              Duration
            </label>
            <input
              id="firstQuotaDuration"
              name="firstQuotaDuration"
              defaultValue={content.firstQuota.duration}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaPrice" className={adminLabel}>
              Investment
            </label>
            <input
              id="firstQuotaPrice"
              name="firstQuotaPrice"
              defaultValue={content.firstQuota.price}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaNextCohort" className={adminLabel}>
              Next cohort
            </label>
            <input
              id="firstQuotaNextCohort"
              name="firstQuotaNextCohort"
              defaultValue={content.firstQuota.nextCohort}
              maxLength={200}
              className={adminInput}
            />
          </div>
        </div>
        <div>
          <label htmlFor="firstQuotaAudience" className={adminLabel}>
            Audience
          </label>
          <textarea
            id="firstQuotaAudience"
            name="firstQuotaAudience"
            defaultValue={content.firstQuota.audience}
            maxLength={500}
            className={adminTextarea}
          />
        </div>
        <div>
          <label htmlFor="curriculum" className={adminLabel}>
            Curriculum
          </label>
          <textarea
            id="curriculum"
            name="curriculum"
            defaultValue={content.firstQuota.curriculum.join("\n")}
            className={`${adminTextarea} min-h-44`}
          />
          <p className="mt-2 text-xs text-cream/30">
            One curriculum item per line. Maximum 12 items.
          </p>
        </div>
      </Section>

      <Section
        title="Revenue Lab"
        description="Community copy used on the Revenue Lab page."
      >
        <div>
          <label htmlFor="revenueLabSummary" className={adminLabel}>
            Summary
          </label>
          <textarea
            id="revenueLabSummary"
            name="revenueLabSummary"
            defaultValue={content.revenueLab.summary}
            maxLength={1000}
            className={adminTextarea}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="revenueLabSchedule" className={adminLabel}>
              Rhythm
            </label>
            <input
              id="revenueLabSchedule"
              name="revenueLabSchedule"
              defaultValue={content.revenueLab.schedule}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="revenueLabFormat" className={adminLabel}>
              Format
            </label>
            <input
              id="revenueLabFormat"
              name="revenueLabFormat"
              defaultValue={content.revenueLab.format}
              maxLength={200}
              className={adminInput}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Contact details"
        description="These details appear in the contact page and footer. Leave blank until they are confirmed."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className={adminLabel}>
              Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={content.contact.email}
              maxLength={254}
              className={adminInput}
              placeholder="Leave blank to use the form"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className={adminLabel}>
              Phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              defaultValue={content.contact.phone}
              maxLength={80}
              className={adminInput}
              placeholder="Optional"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contactAddress" className={adminLabel}>
            Address
          </label>
          <textarea
            id="contactAddress"
            name="contactAddress"
            defaultValue={content.contact.address}
            maxLength={300}
            className={adminTextarea}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="contactResponseNote" className={adminLabel}>
            Response note
          </label>
          <textarea
            id="contactResponseNote"
            name="contactResponseNote"
            defaultValue={content.contact.responseNote}
            maxLength={400}
            className={adminTextarea}
          />
        </div>
      </Section>

      <Section
        title="About"
        description="The short brand introduction on the About page."
      >
        <div>
          <label htmlFor="aboutIntro" className={adminLabel}>
            Introduction
          </label>
          <textarea
            id="aboutIntro"
            name="aboutIntro"
            defaultValue={content.about.intro}
            maxLength={3000}
            className={`${adminTextarea} min-h-40`}
          />
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-4 border-t border-cream/10 pt-6">
        <SubmitButton
          pendingLabel="Saving content..."
          className={adminPrimaryButton}
        >
          Save site content
        </SubmitButton>
        <p className="text-xs text-cream/30">
          Changes publish on the public site immediately.
        </p>
      </div>
    </form>
  );
}
