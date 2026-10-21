"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveWorkshopAction } from "@/actions/admin-workshops";
import {
  inputClass,
  labelClass,
  Notice,
  panelClass,
  primaryButton,
  secondaryButton,
  Spinner,
} from "@/components/ui";

export type WorkshopFormInitial = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  price: string;
  startsAt: string;
  endsAt: string;
  location: string;
  meetingUrl: string;
  capacity: string;
  coverImageUrl: string;
  published: boolean;
};

export function WorkshopForm({
  initial,
}: {
  initial?: WorkshopFormInitial;
}) {
  const [state, formAction, pending] = useActionState(saveWorkshopAction, null);
  const [type, setType] = useState(initial?.type ?? "PUBLIC");

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={initial?.id ?? ""} />

      {state?.error ? <Notice tone="error">{state.error}</Notice> : null}

      <section className={`${panelClass} p-6`}>
        <h2 className="text-base font-semibold text-white">Workshop details</h2>
        <p className="mt-1 text-sm text-white/35">
          These fields control what members see on the public workshop page.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={120}
              defaultValue={initial?.title}
              className={inputClass}
              placeholder="Intro to System Design"
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="font-normal text-white/25">(optional)</span>
            </label>
            <input
              id="slug"
              name="slug"
              maxLength={80}
              defaultValue={initial?.slug}
              className={inputClass}
              placeholder="intro-to-system-design"
            />
            <p className="mt-1.5 text-xs text-white/35">
              Generated from the title when left empty.
            </p>
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Access type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className={inputClass}
            >
              <option value="PUBLIC">Public - free, visible to everyone</option>
              <option value="PRIVATE">Private - paid access</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="summary" className={labelClass}>
              Short summary
            </label>
            <input
              id="summary"
              name="summary"
              required
              minLength={10}
              maxLength={300}
              defaultValue={initial?.summary}
              className={inputClass}
              placeholder="One or two sentences shown on cards and notifications."
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Full description
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={10000}
              rows={10}
              defaultValue={initial?.description}
              className={inputClass}
              placeholder="Agenda, prerequisites, who this is for, and what to bring."
            />
          </div>

          <div>
            <label htmlFor="coverImageUrl" className={labelClass}>
              Cover image URL <span className="font-normal text-white/25">(optional)</span>
            </label>
            <input
              id="coverImageUrl"
              name="coverImageUrl"
              type="url"
              defaultValue={initial?.coverImageUrl}
              className={inputClass}
              placeholder="https://images.example.com/cover.jpg"
            />
          </div>

          <div>
            <label htmlFor="capacity" className={labelClass}>
              Capacity <span className="font-normal text-white/25">(optional)</span>
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              max={100000}
              step={1}
              defaultValue={initial?.capacity}
              className={inputClass}
              placeholder="25"
            />
          </div>
        </div>
      </section>

      <section className={`${panelClass} p-6`}>
        <h2 className="text-base font-semibold text-white">Schedule and access</h2>
        <p className="mt-1 text-sm text-white/35">
          The meeting link is only revealed to attendees who are allowed in.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={labelClass}>
              Starts at
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              defaultValue={initial?.startsAt}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="endsAt" className={labelClass}>
              Ends at <span className="font-normal text-white/25">(optional)</span>
            </label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              defaultValue={initial?.endsAt}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Location label <span className="font-normal text-white/25">(optional)</span>
            </label>
            <input
              id="location"
              name="location"
              maxLength={200}
              defaultValue={initial?.location}
              className={inputClass}
              placeholder="Online or a city/venue"
            />
          </div>

          <div>
            <label htmlFor="meetingUrl" className={labelClass}>
              Meeting / access link
            </label>
            <input
              id="meetingUrl"
              name="meetingUrl"
              type="url"
              required
              defaultValue={initial?.meetingUrl}
              className={inputClass}
              placeholder="https://meet.example.com/session"
            />
          </div>

          {type === "PRIVATE" ? (
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (USD)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/35">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  defaultValue={initial?.price}
                  className={`${inputClass} pl-7`}
                  placeholder="49.00"
                />
              </div>
              <p className="mt-1.5 text-xs text-white/35">
                Minimum $1.00. Public workshops are always free.
              </p>
            </div>
          ) : (
            <input type="hidden" name="price" value="0" />
          )}
        </div>
      </section>

      <section className={`${panelClass} p-6`}>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? false}
            className="mt-1 size-4 rounded border-white/20 text-violet-300 focus:ring-violet-400/40"
          />
          <span>
            <span className="block text-sm font-medium text-white">Published</span>
            <span className="mt-0.5 block text-xs leading-5 text-white/35">
              Published workshops are visible to members. Publishing a public
              workshop for the first time sends an in-app notification to every
              member.
            </span>
          </span>
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : initial ? (
            "Save changes"
          ) : (
            "Create workshop"
          )}
        </button>
        <Link href="/admin/workshops" className={secondaryButton}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
