// app/products/page.tsx

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;

  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          {search && (
            <p className="text-muted-foreground mt-2">
              Searching for: "{search}"
            </p>
          )}
        </div>

        <div className="text-center py-12">
          <p className="text-lg">Products page is working!</p>
          {search && <p className="text-sm mt-2">Search term: {search}</p>}
        </div>
      </div>
    </div>
  );
}
