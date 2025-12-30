import Link from "next/link";

export const dynamic = "force-dynamic";

type GitHubFile = {
  name: string;
  path: string;
  type: string;
};

async function getSnippets() {
  const api =
    "https://api.github.com/repos/AmmarNaser/ui-engineering-notes/contents/content/snippets";
  const res = await fetch(api, { cache: "no-store" });

  if (!res.ok) return [];

  const data = (await res.json()) as GitHubFile[];
  return data.filter((f) => f.name.endsWith(".md"));
}

export default async function SnippetsPage() {
  const files = await getSnippets();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippets</h1>

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
    </div>
  );
}
