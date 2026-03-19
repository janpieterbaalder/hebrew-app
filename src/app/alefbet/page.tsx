"use client";

import Link from "next/link";
import { useState } from "react";
import { alphabet, nikkud } from "@/data/alphabet";

type Tab = "letters" | "nikkud" | "info";

export default function AlefbetPage() {
  const [activeTab, setActiveTab] = useState<Tab>("letters");
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-lightest">Het Alefbet</h1>
          <p className="text-green-light/50 mt-1">
            De 22 letters van het Hebreeuwse alfabet
          </p>
        </div>
        <Link
          href="/alefbet/quiz"
          className="gradient-green text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md shadow-green-darkest/50"
        >
          Start Quiz
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {(["letters", "nikkud", "info"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "gradient-green text-white shadow-md"
                : "bg-surface-light text-green-light/60 border border-green-darkest/50 hover:bg-surface-lighter hover:text-green-light"
            }`}
          >
            {tab === "letters"
              ? "Letters"
              : tab === "nikkud"
              ? "Klinkers (Nikkud)"
              : "Uitleg"}
          </button>
        ))}
      </div>

      {activeTab === "letters" && (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3 mb-8">
            {alphabet.map((letter, index) => (
              <button
                key={letter.id}
                onClick={() =>
                  setSelectedLetter(selectedLetter === index ? null : index)
                }
                className={`gradient-card rounded-xl border-2 p-3 text-center transition-all hover:shadow-lg hover:shadow-green-darkest/30 ${
                  selectedLetter === index
                    ? "border-green shadow-lg shadow-green-darkest/40"
                    : "border-green-darkest/30 hover:border-green-dark/50"
                }`}
              >
                <div className="hebrew-xl leading-none mb-1 text-green-lightest">
                  {letter.letter}
                </div>
                <div className="text-xs text-green-light/50 font-medium">
                  {letter.name}
                </div>
              </button>
            ))}
          </div>

          {selectedLetter !== null && (
            <LetterDetail letter={alphabet[selectedLetter]} />
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-green-lightest mb-3">
              Eindletters (Sofit)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {alphabet
                .filter((l) => l.sofit)
                .map((letter) => (
                  <div
                    key={`sofit-${letter.id}`}
                    className="gradient-card rounded-xl border border-green-darkest/50 p-4 text-center"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <div className="hebrew text-3xl text-green-light">{letter.letter}</div>
                        <div className="text-xs text-green-light/30">normaal</div>
                      </div>
                      <span className="text-green-dark text-xl">→</span>
                      <div>
                        <div className="hebrew text-3xl text-green">{letter.sofit}</div>
                        <div className="text-xs text-green-light/30">sofit</div>
                      </div>
                    </div>
                    <div className="text-sm text-green-light/60 mt-2 font-medium">
                      {letter.sofitName}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "nikkud" && (
        <div className="space-y-4">
          {(["short", "long", "reduced", "special"] as const).map((type) => (
            <div key={type}>
              <h3 className="text-lg font-semibold text-green-lightest mb-3">
                {type === "short"
                  ? "Korte klinkers"
                  : type === "long"
                  ? "Lange klinkers"
                  : type === "reduced"
                  ? "Ultra-korte klinkers (Chataf)"
                  : "Speciaal"}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nikkud
                  .filter((n) => n.type === type)
                  .map((n) => (
                    <div
                      key={n.id}
                      className="gradient-card rounded-xl border border-green-darkest/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="hebrew text-4xl text-green w-16 text-center">
                          {n.example}
                        </div>
                        <div>
                          <div className="font-semibold text-green-lightest">
                            {n.name}
                          </div>
                          <div className="text-sm text-green-light/60">
                            Klank: {n.sound}
                          </div>
                          <div className="text-xs text-green-light/40 mt-1">
                            {n.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "info" && (
        <div className="gradient-card rounded-xl border border-green-darkest/50 p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-green-lightest mb-2">
              Over het Hebreeuwse alfabet
            </h3>
            <p className="text-green-light/60">
              Het Hebreeuwse alfabet (alefbet) bestaat uit 22 medeklinkers. Het
              wordt van rechts naar links gelezen. Klinkers worden aangegeven
              door kleine tekens (nikkud) boven of onder de letters.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-green-lightest mb-2">
              Begadkefat letters
            </h3>
            <p className="text-green-light/60 mb-2">
              Zes letters veranderen van klank met of zonder een dagesh (punt in
              de letter): <span className="hebrew text-lg text-green">בּ גּ דּ כּ פּ תּ</span>.
            </p>
            <p className="text-green-light/60">
              Met dagesh (punt): harde klank (b, g, d, k, p, t).
              <br />
              Zonder dagesh: zachte klank (v, gh, dh, ch, f, th).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-green-lightest mb-2">
              Gutturale letters
            </h3>
            <p className="text-green-light/60">
              De gutturalen zijn <span className="hebrew text-lg text-green">א ה ח ע</span>{" "}
              (en soms <span className="hebrew text-lg text-green">ר</span>). Ze accepteren
              geen dagesh en hebben speciale regels voor klinkers.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-green-lightest mb-2">
              Dagesh
            </h3>
            <p className="text-green-light/60">
              Een punt in een letter. <strong className="text-green-light">Dagesh lene</strong> komt voor in
              begadkefat-letters en verandert de uitspraak.{" "}
              <strong className="text-green-light">Dagesh forte</strong> verdubbelt de letter (kan in bijna
              elke letter voorkomen, behalve gutturalen).
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

function LetterDetail({ letter }: { letter: (typeof alphabet)[0] }) {
  return (
    <div className="gradient-card rounded-xl border-2 border-green-dark/40 p-6 shadow-lg shadow-green-darkest/30">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="text-center">
          <div className="hebrew-xl text-green text-7xl leading-none">
            {letter.letter}
          </div>
          {letter.sofit && (
            <div className="mt-2 text-green-light/40 text-sm">
              Sofit: <span className="hebrew text-2xl text-green-light">{letter.sofit}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-green-lightest">
            {letter.name}{" "}
            <span className="text-green-light/40 font-normal text-lg">
              ({letter.nameNL})
            </span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-surface rounded-lg p-3 border border-green-darkest/30">
              <div className="text-xs text-green-light/40 uppercase tracking-wide">
                Klank
              </div>
              <div className="text-green-light font-medium">{letter.sound}</div>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-green-darkest/30">
              <div className="text-xs text-green-light/40 uppercase tracking-wide">
                Getalwaarde
              </div>
              <div className="text-green-light font-medium">
                {letter.gematria}
              </div>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-green-darkest/30">
              <div className="text-xs text-green-light/40 uppercase tracking-wide">
                Categorie
              </div>
              <div className="text-green-light font-medium capitalize">
                {letter.category}
              </div>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-green-darkest/30">
              <div className="text-xs text-green-light/40 uppercase tracking-wide">
                Voorbeeldwoord
              </div>
              <div className="text-green-light">
                <span className="hebrew text-xl text-green">{letter.exampleWord}</span>{" "}
                <span className="text-sm text-green-light/50">
                  ({letter.exampleTransliteration}) = {letter.exampleTranslation}
                </span>
              </div>
            </div>
          </div>
          <p className="text-green-light/50 mt-3 text-sm">{letter.description}</p>
        </div>
      </div>
    </div>
  );
}
