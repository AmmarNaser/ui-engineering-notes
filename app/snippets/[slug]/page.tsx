import { remark } from "remark";
import html from "remark-html";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

interface SnippetPageProps {
  params: {
    slug: string;
  };
}

async function getSnippet(slug: string) {
  try {
    const filePath = join(process.cwd(), "content", "snippets", `${slug}.md`);
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error("Error reading snippet file:", error);
    return null;
  }
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const file = await getSnippet(params.slug);

  if (!file) {
    return <div className="text-red-500">Snippet not found</div>;
  }

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
