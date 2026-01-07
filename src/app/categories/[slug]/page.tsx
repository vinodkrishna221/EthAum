import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import ProductCard from '@/components/product/ProductCard';
import { Breadcrumb } from '@/components/ui/breadcrumb'; // Assuming component doesn't exist, will use simple div for now

async function getCategoryData(slug: string) {
    await dbConnect();
    const category = await Category.findOne({ slug });
    if (!category) return null;

    // Ideally, find all products in this category AND subcategories. 
    // For MVP, simplistic check:
    // 1. Find subcategories
    const subCats = await Category.find({ parentId: category._id });
    const catIds = [category._id, ...subCats.map(c => c._id)];

    // 2. Find companies in these categories (Product schema doesn't have categoryId, Company does)
    // ... Wait, Product schema doesn't link to category directly. 
    // We need to fetch Companies by Category, then Products by Companies. 
    // OR, if Venu's previous requirement implied Products serve 'Categories' directly, maybe I missed a schema field.
    // Checking Schema: Company has `categoryId`. Product has `tags`.
    // So: Find Companies in these categories -> Get their products.

    // This is expensive for a large app, but fine for MVP demo.
    // Alternatively, products might have tags matching category slug. Let's try that too? 
    // No, let's stick to Company relations.

    // Actually, Mongoose 'aggregate' or 'populate' is better.
    const products = await Product.find({})
        .populate({
            path: 'companyId',
            match: { categoryId: { $in: catIds } },
            select: 'name slug logoUrl categoryId' // select fields
        });

    // Filter out products where companyId is null (because match failed)
    const validProducts = products.filter(p => p.companyId);

    return {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(validProducts))
    };
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
    const data = await getCategoryData(params.slug);

    if (!data) return notFound();

    const { category, products } = data;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <a href="/categories" className="hover:text-primary">Categories</a>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-900">{category.name}</span>
                </div>

                <div className="bg-primary/5 rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                    <p className="text-gray-600 max-w-2xl">{category.description}</p>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">Top Products in {category.name}</h2>
                <span className="text-sm text-gray-500">{products.length} results</span>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 dashed rounded-xl">
                    <p className="text-gray-500">No products found in this category yet.</p>
                </div>
            )}
        </div>
    );
}
