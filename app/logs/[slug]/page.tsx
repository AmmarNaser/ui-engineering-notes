interface LogPageProps {
  params: {
    slug: string;
  };
}

export default function LogPage({ params }: LogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Log: {params.slug}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Individual log content will be displayed here.
      </p>
    </div>
  );
}

