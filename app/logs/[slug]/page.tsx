import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const dynamic = "force-dynamic";

interface LogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getLog(slug: string) {
  try {
    const basePath = process.cwd();
    const filePath = resolve(basePath, "content", "logs", `${slug}.md`);
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error("Error reading log file:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    console.error(
      "Attempted path:",
      resolve(process.cwd(), "content", "logs", `${slug}.md`)
    );
    console.error("Current working directory:", process.cwd());
    return null;
  }
}

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

export default async function LogPage({ params }: LogPageProps) {
  const { slug } = await params;
  const file = await getLog(slug);

  if (!file) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-red-400 text-lg">Log not found</p>
        </div>
      </div>
    );
  }

  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(file);
  const displayDate = formatDate(slug);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 pb-6 border-b border-zinc-800">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          {displayDate}
        </h1>
        <p className="text-sm text-zinc-400 font-mono">{slug}</p>
      </header>

      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-blue-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
          prose-pre code:text-zinc-100 prose-pre code:bg-transparent prose-pre code:p-0
          prose-ul:text-zinc-300 prose-ol:text-zinc-300
          prose-li:text-zinc-300 prose-li:my-2
          prose-blockquote:border-l-4 prose-blockquote:border-zinc-700 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-400
          prose-hr:border-zinc-800"
        dangerouslySetInnerHTML={{
          __html: processed.toString(),
        }}
      />
    </article>
  );
}
