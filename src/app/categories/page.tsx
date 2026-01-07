import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Box, BarChart, ShoppingCart, Zap, MessageSquare } from 'lucide-react'; // Example icons

async function getCategories() {
    await dbConnect();
    // Fetch top-level categories
    const categories = await Category.find({ parentId: null })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
    return JSON.parse(JSON.stringify(categories));
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Mapping simplified icons for demo
    const getIcon = (slug: string) => {
        if (slug.includes('marketing')) return <BarChart className="w-6 h-6" />;
        if (slug.includes('sales')) return <ShoppingCart className="w-6 h-6" />;
        if (slug.includes('dev')) return <Zap className="w-6 h-6" />;
        if (slug.includes('support')) return <MessageSquare className="w-6 h-6" />;
        return <Box className="w-6 h-6" />;
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category: any) => (
                    <Link key={category._id} href={`/categories/${category.slug}`} className="group">
                        <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    {getIcon(category.slug)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{category.description}</p>
                                    <span className="text-xs font-semibold text-primary flex items-center">
                                        Explore <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
