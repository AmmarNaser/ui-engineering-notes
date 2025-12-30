interface SnippetPageProps {
  params: {
    slug: string;
  };
}

export default function SnippetPage({ params }: SnippetPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Snippet: {params.slug}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Individual snippet content will be displayed here.
      </p>
    </div>
  );
}

