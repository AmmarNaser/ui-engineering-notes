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
      .map((file) => ({ name: file }));
  } catch (error) {
    console.error("Error reading snippets directory:", error);
    return [];
  }
}

export default async function SnippetsPage() {
  const files = await getSnippets();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippets</h1>

      {files.length === 0 ? (
        <p className="text-zinc-400">No snippets found.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const slug = file.name.replace(".md", "");
            return (
              <li key={slug}>
                <Link
                  href={`/snippets/${slug}`}
                  className="text-blue-500 hover:underline">
                  {slug}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
