export default function DiagramLoading() {
  return (
    <main className="min-h-screen bg-gray-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-72 animate-pulse rounded-3xl bg-white sm:h-96" />
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="h-96 animate-pulse rounded-2xl bg-white" />
          <div className="h-52 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    </main>
  );
}
