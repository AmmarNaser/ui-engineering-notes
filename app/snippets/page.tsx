import Link from "next/link";
import { readdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

async function getSnippets() {
  try {
    const snippetsDir = join(process.cwd(), "content", "snippets");
    const files = await readdir(snippetsDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({ name: file }))
      .sort((a, b) => b.name.localeCompare(a.name)); // Sort newest first
  } catch (error) {
    console.error("Error reading snippets directory:", error);
    return [];
  }
}

function formatDate(slug: string): string {
  // Try to parse as date (YYYY-MM-DD format)
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

export default async function SnippetsPage() {
  const files = await getSnippets();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Code Snippets
        </h1>
        <p className="text-zinc-400 text-lg">
          Practical code examples and reusable components
        </p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No snippets found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => {
            const slug = file.name.replace(".md", "");
            const displayDate = formatDate(slug);
            return (
              <Link
                key={slug}
                href={`/snippets/${slug}`}
                className="group block p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-1">
                      {displayDate}
                    </h2>
                    <p className="text-sm text-zinc-400 font-mono">{slug}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
