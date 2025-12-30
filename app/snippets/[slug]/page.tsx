import { remark } from "remark";
import html from "remark-html";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const dynamic = "force-dynamic";

interface SnippetPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getSnippet(slug: string) {
  try {
    // Try multiple path resolutions for compatibility with different environments
    const basePath = process.cwd();
    const filePath = resolve(basePath, "content", "snippets", `${slug}.md`);
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error("Error reading snippet file:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    console.error(
      "Attempted path:",
      resolve(process.cwd(), "content", "snippets", `${slug}.md`)
    );
    console.error("Current working directory:", process.cwd());
    return null;
  }
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { slug } = await params;
  const file = await getSnippet(slug);

  if (!file) {
    return <div className="text-red-500">Snippet not found</div>;
  }

  const processed = await remark().use(html).process(file);

  return (
    <article className="prose prose-invert max-w-none container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippet: {slug}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: processed.toString(),
        }}
      />
    </article>
  );
}
