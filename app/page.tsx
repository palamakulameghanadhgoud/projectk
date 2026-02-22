import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <h1 className="text-xl font-semibold">DAA — Design & Analysis of Algorithms</h1>
        <p className="text-sm text-slate-400">Interactive 3D visualizations for teaching</p>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-slate-200">Algorithms</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link
                href="/algorithms/merge-sort"
                className="block rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition hover:border-indigo-500 hover:bg-slate-800"
              >
                <span className="font-medium">Merge Sort</span>
                <span className="ml-2 text-sm text-slate-400">Divide & Conquer</span>
              </Link>
            </li>
            <li>
              <Link
                href="/algorithms/dijkstra"
                className="block rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition hover:border-indigo-500 hover:bg-slate-800"
              >
                <span className="font-medium">Dijkstra</span>
                <span className="ml-2 text-sm text-slate-400">Shortest path • Spheres & edges</span>
              </Link>
            </li>
            <li>
              <Link
                href="/algorithms/mst"
                className="block rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition hover:border-indigo-500 hover:bg-slate-800"
              >
                <span className="font-medium">Minimum Spanning Tree</span>
                <span className="ml-2 text-sm text-slate-400">Prim • Spheres & edges</span>
              </Link>
            </li>
          </ul>
        </section>
        <section className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 text-sm text-slate-400">
          <p>Use <strong>Student</strong> mode for guided step-by-step learning. Use <strong>Teacher</strong> mode for annotations and pause-on-step explanation.</p>
        </section>
      </main>
    </div>
  );
}
