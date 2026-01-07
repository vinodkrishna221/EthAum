import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/product/ProductCard';
import SearchFilters from '@/components/product/SearchFilters';

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    await dbConnect();

    const q = searchParams.q as string;
    const sort = searchParams.sort as string || 'newest';

    const query: any = {};

    if (q) {
        const searchRegex = new RegExp(q, 'i');
        query.$or = [
            { name: searchRegex },
            { tagline: searchRegex },
            { description: searchRegex },
            { tags: { $in: [searchRegex] } }
        ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'name') sortOptions = { name: 1 };

    const products = await Product.find(query)
        .populate('companyId', 'name slug logoUrl')
        .sort(sortOptions)
        .limit(50); // Pagination for later

    // Serialization for server component -> client component prop passing
    return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const products = await getProducts(searchParams);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Discover Products</h1>
                    <p className="text-gray-600 mt-2">Find the best AI tools, SaaS, and software.</p>
                </div>
                <div className="text-sm text-gray-500 mt-4 md:mt-0">
                    Showing {products.length} results
                </div>
            </div>

            <SearchFilters />

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}
