import { grammarLessons } from "@/data/grammar";
import { notFound } from "next/navigation";
import Link from "next/link";
import GrammarExercises from "@/components/GrammarExercise";

export function generateStaticParams() {
  return grammarLessons.map((lesson) => ({ lesson: lesson.id }));
}

export default async function GrammarLessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: lessonId } = await params;
  const lesson = grammarLessons.find((l) => l.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const sorted = [...grammarLessons].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextLesson = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/grammatica"
        className="text-green-light/50 hover:text-green-light text-sm mb-4 inline-block"
      >
        ← Terug naar overzicht
      </Link>

      <div className="mb-8">
        <div className="text-sm text-green font-medium mb-1">Les {lesson.order}</div>
        <h1 className="text-3xl font-bold text-green-lightest">{lesson.title}</h1>
        <p className="text-green-light/50 mt-2">{lesson.summary}</p>
      </div>

      <div className="space-y-8">
        {lesson.sections.map((section, sIndex) => (
          <div key={sIndex} className="gradient-card rounded-xl border border-green-darkest/50 p-6">
            <h2 className="text-xl font-semibold text-green-lightest mb-3">{section.heading}</h2>
            <div className="text-green-light/60 whitespace-pre-line mb-4">{section.content}</div>

            {section.table && (
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {section.table.headers.map((header, i) => (
                        <th
                          key={i}
                          className="bg-surface border border-green-darkest/40 px-3 py-2 text-left font-semibold text-green-light"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rIndex) => (
                      <tr key={rIndex}>
                        {row.map((cell, cIndex) => (
                          <td
                            key={cIndex}
                            className="border border-green-darkest/40 px-3 py-2 text-green-light/70"
                          >
                            <span className={cell.match(/[\u0590-\u05FF]/) ? "hebrew text-lg text-green" : ""}>
                              {cell}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.examples && section.examples.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-semibold text-green-light/50 uppercase tracking-wide">
                  Voorbeelden
                </h4>
                {section.examples.map((example, eIndex) => (
                  <div key={eIndex} className="bg-surface rounded-lg p-3 border border-green-darkest/30">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="hebrew text-xl text-green">{example.hebrew}</span>
                      <span className="text-sm text-green-light/40">({example.transliteration})</span>
                      <span className="text-sm font-medium text-green-lightest">= {example.dutch}</span>
                    </div>
                    {example.explanation && (
                      <p className="text-xs text-green-light/40 mt-1">{example.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {lesson.exercises && lesson.exercises.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-green-lightest mb-4">Oefeningen</h2>
          <GrammarExercises exercises={lesson.exercises} lessonId={lesson.id} />
        </div>
      )}

      <div className="flex justify-between mt-8">
        {prevLesson ? (
          <Link href={`/grammatica/${prevLesson.id}`} className="text-green hover:text-green-light font-medium">
            ← {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link href={`/grammatica/${nextLesson.id}`} className="text-green hover:text-green-light font-medium">
            {nextLesson.title} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
