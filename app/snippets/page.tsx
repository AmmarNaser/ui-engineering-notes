import fs from "fs";
import path from "path";
import Link from "next/link";

export const revalidate = 60; // 👈 مهم جدًا

const snippetsDir = path.join(process.cwd(), "content/snippets");

export default function SnippetsPage() {
  const files = fs.existsSync(snippetsDir)
    ? fs.readdirSync(snippetsDir).filter((f) => f.endsWith(".md"))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippets</h1>

      {files.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No snippets yet.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const slug = file.replace(".md", "");
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
