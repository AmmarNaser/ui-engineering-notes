import Link from "next/link";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";

export const dynamic = "force-dynamic";

function extractTitle(content: string): string {
  const lines = content.split("\n");
  
  // Look for the first heading (###, ##, or #)
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("###")) {
      // Extract title from format like: ### `useFetch.js` - Custom Hook for Data Fetching
      let title = trimmed.replace(/^###\s*/, "");
      // Remove backticks around code blocks but keep the text
      title = title.replace(/`([^`]+)`/g, "$1");
      return title.trim();
    }
    if (trimmed.startsWith("##")) {
      let title = trimmed.replace(/^##\s*/, "");
      title = title.replace(/`([^`]+)`/g, "$1");
      return title.trim();
    }
    if (trimmed.startsWith("#")) {
      let title = trimmed.replace(/^#\s*/, "");
      title = title.replace(/`([^`]+)`/g, "$1");
      return title.trim();
    }
  }
  
  // If no heading found, use the first meaningful line (skip comments and empty lines)
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("<!--")) {
      // Take first sentence or first 60 characters
      const firstSentence = trimmed.split(/[.!?]/)[0];
      return firstSentence.length > 60 
        ? firstSentence.substring(0, 60) + "..." 
        : firstSentence;
    }
  }
  
  return "Untitled Snippet";
}

async function getSnippets() {
  try {
    const snippetsDir = join(process.cwd(), "content", "snippets");
    const files = await readdir(snippetsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));
    
    const snippets = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(".md", "");
        const filePath = resolve(snippetsDir, file);
        const content = await readFile(filePath, "utf-8");
        const title = extractTitle(content);
        return { name: file, slug, title };
      })
    );
    
    return snippets.sort((a, b) => b.name.localeCompare(a.name)); // Sort newest first
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
            const displayDate = formatDate(file.slug);
            return (
              <Link
                key={file.slug}
                href={`/snippets/${file.slug}`}
                className="group block p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-1">
                      {file.title}
                    </h2>
                    <p className="text-sm text-zinc-400 font-mono">{displayDate}</p>
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
