"use client";

import Link from "next/link";
import { useState } from "react";
import { vocabulary, categories } from "@/data/vocabulary";

export default function WoordenSchatPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = vocabulary.filter((word) => {
    const matchesCategory = filter === "all" || word.category === filter;
    const matchesSearch =
      search === "" ||
      word.dutch.toLowerCase().includes(search.toLowerCase()) ||
      word.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      word.hebrew.includes(search);
    return matchesCategory && matchesSearch;
  });

  const categoryKeys = [...new Set(vocabulary.map((w) => w.category))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-lightest">Woordenschat</h1>
          <p className="text-green-light/50 mt-1">
            De {vocabulary.length} meest voorkomende woorden in de Hebreeuwse Bijbel
          </p>
        </div>
        <Link
          href="/woordenschat/oefenen"
          className="gradient-green text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Oefenen met flashcards
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Zoek een woord..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-green-darkest/50 bg-surface-light text-green-lightest placeholder-green-light/30 focus:outline-none focus:ring-2 focus:ring-green-dark/50 focus:border-green-dark"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-green-darkest/50 bg-surface-light text-green-light focus:outline-none focus:ring-2 focus:ring-green-dark/50"
        >
          <option value="all">Alle categorieën</option>
          {categoryKeys.map((key) => (
            <option key={key} value={key}>
              {categories[key]}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-green-light/40 mb-3">{filtered.length} woorden</div>

      <div className="space-y-2">
        {filtered.map((word) => (
          <div
            key={word.id}
            className="gradient-card rounded-xl border border-green-darkest/50 p-4 hover:border-green-dark/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="hebrew text-3xl text-green w-32 text-right shrink-0">
                {word.hebrew}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-green-lightest">{word.dutch}</span>
                  <span className="text-sm text-green-light/40">({word.transliteration})</span>
                  <span className="text-xs bg-green-darkest/40 text-green-light/60 px-2 py-0.5 rounded-full border border-green-darkest/30">
                    {categories[word.category]}
                  </span>
                </div>
                {word.notes && (
                  <p className="text-xs text-green-light/30 mt-1">{word.notes}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-green-light/30">Frequentie</div>
                <div className="text-sm font-medium text-green-light/60">
                  {word.frequency.toLocaleString("nl-NL")}x
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
