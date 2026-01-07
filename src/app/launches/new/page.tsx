import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import LaunchWizard from '@/components/launch/LaunchWizard';

// Get products for the dropdown (in real app, filter by user's company)
async function getMyProducts() {
    await dbConnect();
    // Simplified: getting all products for demo
    const products = await Product.find({}, 'name _id');
    return JSON.parse(JSON.stringify(products));
}

export default async function NewLaunchPage() {
    const products = await getMyProducts();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Create New Launch</h1>
                <p className="text-gray-600">Showcase your latest product update to the world.</p>
            </div>

            <LaunchWizard products={products} />
        </div>
    );
}
