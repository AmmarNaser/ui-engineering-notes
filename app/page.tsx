import Link from "next/link";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";

export const dynamic = "force-dynamic";

function formatDate(slug: string): string {
  const dateMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const date = new Date(
      parseInt(dateMatch[1]),
      parseInt(dateMatch[2]) - 1,
      parseInt(dateMatch[3])
    );
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return slug;
}

async function getLatestSnippet() {
  try {
    const snippetsDir = join(process.cwd(), "content", "snippets");
    const files = await readdir(snippetsDir);
    const mdFiles = files
      .filter((file) => file.endsWith(".md"))
      .sort((a, b) => b.localeCompare(a));

    if (mdFiles.length === 0) return null;

    const latestFile = mdFiles[0];
    const slug = latestFile.replace(".md", "");
    const filePath = resolve(snippetsDir, latestFile);
    const content = await readFile(filePath, "utf-8");

    // Get first paragraph or first few lines as preview
    const preview = content
      .split("\n")
      .filter(
        (line) => line.trim() && !line.startsWith("#") && !line.startsWith("//")
      )
      .slice(0, 3)
      .join(" ")
      .substring(0, 150);

    return {
      slug,
      date: formatDate(slug),
      preview: preview + (preview.length >= 150 ? "..." : ""),
    };
  } catch (error) {
    console.error("Error getting latest snippet:", error);
    return null;
  }
}

async function getLatestLog() {
  try {
    const logsDir = join(process.cwd(), "content", "logs");
    const files = await readdir(logsDir);
    const mdFiles = files
      .filter((file) => file.endsWith(".md"))
      .sort((a, b) => b.localeCompare(a));

    if (mdFiles.length === 0) return null;

    const latestFile = mdFiles[0];
    const slug = latestFile.replace(".md", "");
    const filePath = resolve(logsDir, latestFile);
    const content = await readFile(filePath, "utf-8");

    // Get first paragraph or first few lines as preview
    const preview = content
      .split("\n")
      .filter(
        (line) => line.trim() && !line.startsWith("#") && !line.startsWith("_")
      )
      .slice(0, 3)
      .join(" ")
      .substring(0, 150);

    return {
      slug,
      date: formatDate(slug),
      preview: preview + (preview.length >= 150 ? "..." : ""),
    };
  } catch (error) {
    console.error("Error getting latest log:", error);
    return null;
  }
}

export default async function Home() {
  const [latestSnippet, latestLog] = await Promise.all([
    getLatestSnippet(),
    getLatestLog(),
  ]);

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          UI Engineering Notes
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          A living log of frontend and UI engineering concepts, patterns, and
          practical code snippets — generated and curated daily.
        </p>
      </div>

      <div className="flex gap-4 pt-2">
        <Link
          href="/logs"
          className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-100 transition-colors">
          Read Logs
        </Link>
        <Link
          href="/snippets"
          className="px-4 py-2 border border-zinc-700 rounded-md text-sm font-medium hover:border-zinc-600 hover:bg-zinc-900 transition-colors">
          View Snippets
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-8">
        {latestLog && (
          <Link
            href={`/logs/${latestLog.slug}`}
            className="group block p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-1">
                  Latest Log
                </h2>
                <p className="text-sm text-zinc-400">{latestLog.date}</p>
              </div>
              <svg
                className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
              {latestLog.preview}
            </p>
          </Link>
        )}

        {latestSnippet && (
          <Link
            href={`/snippets/${latestSnippet.slug}`}
            className="group block p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-1">
                  Latest Snippet
                </h2>
                <p className="text-sm text-zinc-400">{latestSnippet.date}</p>
              </div>
              <svg
                className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
              {latestSnippet.preview}
            </p>
          </Link>
        )}
      </div>
    </section>
  );
}
