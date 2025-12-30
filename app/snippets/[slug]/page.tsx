import { remark } from "remark";
import html from "remark-html";

export const dynamic = "force-dynamic";

interface SnippetPageProps {
  params: {
    slug: string;
  };
}

async function getSnippet(slug: string) {
  const url = `https://raw.githubusercontent.com/AmmarNaser/ui-engineering-notes/main/content/snippets/${slug}.md`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return null;

  return await res.text();
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
