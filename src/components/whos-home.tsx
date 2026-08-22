"use client";

import { useState } from "react";

type Person = {
  name: string;
  status: string;
};

type Place = {
  icon: string;
  label: string;
};

const defaultPlaces: Record<string, Place> = {
  Home: { icon: "🏡", label: "At home" },
  Church: { icon: "⛪", label: "At church" },
  Work: { icon: "💼", label: "At work" },
  "Soccer Practice": { icon: "⚽", label: "At soccer practice" },
  Gymnastics: { icon: "🤸", label: "At gymnastics" },
  Karate: { icon: "🥋", label: "At karate" },
  Volleyball: { icon: "🏐", label: "At volleyball" },
  School: { icon: "🎒", label: "At school" },
};

export default function WhosHome({ people }: { people: Person[] }) {
  const [selectedName, setSelectedName] = useState(people[0]?.name ?? "");
  const [places, setPlaces] = useState(defaultPlaces);
  const [newPlace, setNewPlace] = useState("");
  const [currentPlaces, setCurrentPlaces] = useState(
    Object.fromEntries(people.map((person) => [person.name, person.status])),
  );
  const selectedPerson = people.find((person) => person.name === selectedName);
  const selectedStatus = selectedName ? currentPlaces[selectedName] : undefined;
  const selectedPlace = selectedStatus
    ? places[selectedStatus] ?? { icon: "📍", label: `At ${selectedStatus.toLowerCase()}` }
    : null;

  function changePlace(status: string) {
    setCurrentPlaces((places) => ({ ...places, [selectedName]: status }));
  }

  function addPlace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = newPlace.trim();
    if (!label) return;
    setPlaces((currentPlaces) => ({
      ...currentPlaces,
      [label]: { icon: "📍", label: `At ${label}` },
    }));
    changePlace(label);
    setNewPlace("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {people.map((person) => {
          const isSelected = person.name === selectedName;
          const isHome = currentPlaces[person.name] === "Home";
          return (
            <button
              key={person.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedName(person.name)}
              className={`flex min-w-0 items-center justify-between rounded-xl border px-2.5 py-2 text-left text-sm transition-colors sm:px-3 ${
                isSelected
                  ? "border-[#ff715b]/40 bg-[#fff1ed] text-[#172033] dark:bg-[#ff715b]/15 dark:text-white"
                  : "border-black/5 hover:border-[#ff715b]/30 hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              <span className="truncate font-semibold">{person.name}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isHome ? "bg-[#63c7b2]" : "bg-[#f6c85f]"
                }`}
                aria-label={currentPlaces[person.name]}
              />
            </button>
          );
        })}
      </div>
      {selectedPerson && selectedPlace && (
        <div className="flex items-center gap-3 rounded-xl bg-[#172033] px-3 py-2.5 text-white">
          <span className="text-xl" aria-hidden>
            {selectedPlace.icon}
          </span>
          <div>
            <p className="text-xs text-white/60">{selectedPerson.name} is</p>
            <p className="text-sm font-semibold">{selectedPlace.label}</p>
          </div>
        </div>
      )}
      <div className="border-t border-black/5 pt-3 dark:border-white/10">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45 dark:text-white/45">
          Set their place
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(places).map(([status, place]) => (
            <button
              key={status}
              type="button"
              aria-pressed={selectedStatus === status}
              onClick={() => changePlace(status)}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors sm:px-2.5 ${
                selectedStatus === status
                  ? "border-[#ff715b] bg-[#ff715b] text-white"
                  : "border-black/10 text-black/60 hover:border-[#ff715b]/50 hover:text-[#ff715b] dark:border-white/15 dark:text-white/60"
              }`}
            >
              <span aria-hidden>{place.icon}</span> {place.label}
            </button>
          ))}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={addPlace}>
          <label className="sr-only" htmlFor="new-place">
            Add a place
          </label>
          <input
            id="new-place"
            value={newPlace}
            onChange={(event) => setNewPlace(event.target.value)}
            placeholder="Add a place..."
            className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none transition-colors placeholder:text-black/35 focus:border-[#ff715b] dark:border-white/15 dark:bg-white/5 dark:placeholder:text-white/35"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#172033] px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[#172033]"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
