import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "UI Engineering Notes",
  description: "Daily UI & Frontend engineering logs and code snippets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex gap-6">
            <Link href="/" className="font-semibold">
              UI Engineering Notes
            </Link>
            <Link href="/logs" className="text-zinc-400 hover:text-white">
              Logs
            </Link>
            <Link href="/snippets" className="text-zinc-400 hover:text-white">
              Snippets
            </Link>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>

        <footer className="border-t border-zinc-800 mt-20">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} Ammar — UI Engineering Notes
          </div>
        </footer>
      </body>
    </html>
  );
}
