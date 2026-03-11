"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Please enter a topic to research.");
      return;
    }

    setIsLoading(true);
    setReport("");
    setError(null);

    try {
      const response = await fetch(
        `https://langgraph-research-assistant-1.onrender.com/research?topic=${encodeURIComponent(query)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();
      if (data && typeof data.report === "string") {
        setReport(data.report);
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 p-4 pt-12 sm:p-8 md:pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            Research Assistant
          </h1>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Enter a topic and let the AI generate a 2000 word report for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'The future of renewable energy'"
              className="flex-grow rounded-md border border-zinc-300 bg-white px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-blue-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-black sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Researching..." : "Submit"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 w-full rounded-md border border-red-400 bg-red-100 p-4 text-red-800 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300">
            <p>
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {report && (
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Generated Report
            </h2>
            <div className="mt-4 w-full rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <p className="whitespace-pre-wrap font-sans leading-relaxed text-zinc-700 dark:text-zinc-300">
                {report}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
