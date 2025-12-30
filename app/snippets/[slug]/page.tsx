import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

interface SnippetPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // مهم جدًا 👈

export default async function SnippetPage({ params }: SnippetPageProps) {
  const filePath = path.join(
    process.cwd(),
    "content/snippets",
    `${params.slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    return <div className="text-red-500">Snippet not found</div>;
  }

  const file = fs.readFileSync(filePath, "utf8");
  const processed = await remark().use(html).process(file);

  return (
    <article className="prose prose-invert max-w-none container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippet: {params.slug}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: processed.toString(),
        }}
      />
    </article>
  );
}
