import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">UI Engineering Notes</h1>

      <p className="text-zinc-400 max-w-2xl">
        A living log of frontend and UI engineering concepts, patterns, and
        practical code snippets — generated and curated daily.
      </p>

      <div className="flex gap-4 pt-4">
        <Link
          href="/logs"
          className="px-4 py-2 bg-white text-black rounded-md text-sm">
          Read Logs
        </Link>
        <Link
          href="/snippets"
          className="px-4 py-2 border border-zinc-700 rounded-md text-sm">
          View Snippets
        </Link>
      </div>
    </section>
  );
}
