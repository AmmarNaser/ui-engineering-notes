import Link from "next/link";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";

export const dynamic = "force-dynamic";

function extractTitle(content: string): string {
  const lines = content.split("\n");
  
  // Look for headings - skip the date heading (# YYYY-MM-DD)
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip date headings and generated at lines
    if (trimmed.match(/^#\s*\d{4}-\d{2}-\d{2}$/) || trimmed.startsWith("_Generated at:")) {
      continue;
    }
    // Look for main heading with concept/topic
    if (trimmed.startsWith("###")) {
      let title = trimmed.replace(/^###\s*/, "");
      title = title.replace(/`([^`]+)`/g, "$1");
      return title.trim();
    }
    if (trimmed.startsWith("##")) {
      let title = trimmed.replace(/^##\s*/, "");
      title = title.replace(/`([^`]+)`/g, "$1");
      // Skip section headings like "## Concept" or "## When to Use It"
      if (!title.match(/^(Concept|When to Use It|Example|Summary|Explanation):?$/i)) {
        return title.trim();
      }
    }
    if (trimmed.startsWith("#")) {
      // Skip date headings
      if (!trimmed.match(/^#\s*\d{4}-\d{2}-\d{2}$/)) {
        let title = trimmed.replace(/^#\s*/, "");
        // Look for pattern like "React Frontend Engineering Note: Topic"
        const match = title.match(/React Frontend Engineering Note:\s*(.+)/i);
        if (match) {
          return match[1].trim();
        }
        title = title.replace(/`([^`]+)`/g, "$1");
        return title.trim();
      }
    }
  }
  
  // If no heading found, use the first meaningful line
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("_") && !trimmed.startsWith("//") && !trimmed.match(/^#\s*\d{4}-\d{2}-\d{2}$/)) {
      const firstSentence = trimmed.split(/[.!?]/)[0];
      return firstSentence.length > 60 
        ? firstSentence.substring(0, 60) + "..." 
        : firstSentence;
    }
  }
  
  return "Untitled Log";
}

async function getLogs() {
  try {
    const logsDir = join(process.cwd(), "content", "logs");
    const files = await readdir(logsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));
    
    const logs = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(".md", "");
        const filePath = resolve(logsDir, file);
        const content = await readFile(filePath, "utf-8");
        const title = extractTitle(content);
        return { name: file, slug, title };
      })
    );
    
    return logs.sort((a, b) => b.name.localeCompare(a.name)); // Sort newest first
  } catch (error) {
    console.error("Error reading logs directory:", error);
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

export default async function LogsPage() {
  const files = await getLogs();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Engineering Logs
        </h1>
        <p className="text-zinc-400 text-lg">
          Daily notes on frontend concepts, patterns, and best practices
        </p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No logs found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => {
            const displayDate = formatDate(file.slug);
            return (
              <Link
                key={file.slug}
                href={`/logs/${file.slug}`}
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
