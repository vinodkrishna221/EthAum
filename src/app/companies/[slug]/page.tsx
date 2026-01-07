import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import Product from '@/models/Product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Linkedin, Twitter, MapPin, Users } from 'lucide-react';

async function getCompany(slug: string) {
    await dbConnect();
    const company = await Company.findOne({ slug }).populate('categoryId');
    if (!company) return null;

    const products = await Product.find({ companyId: company._id });
    return { company, products };
}

export default async function CompanyProfilePage({ params }: { params: { slug: string } }) {
    const data = await getCompany(params.slug);

    if (!data) {
        notFound();
    }

    const { company, products } = data;

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
                        {company.logoUrl ? (
                            <Image src={company.logoUrl} alt={company.name} fill className="object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                                {company.name[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            {company.name}
                            {company.verified && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Verified</Badge>}
                        </h1>
                        <p className="text-xl text-gray-600 mb-4">{company.tagline}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                            {company.headquarters && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {company.headquarters}
                                </div>
                            )}
                            {company.teamSize && (
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {company.teamSize.replace('SIZE_', '').replace('_', '-')} Employees
                                </div>
                            )}
                            {company.website && (
                                <a href={company.website} target="_blank" className="flex items-center gap-1 hover:text-primary">
                                    <Globe className="w-4 h-4" /> Website
                                </a>
                            )}
                        </div>

                        <p className="text-gray-700 leading-relaxed max-w-3xl">
                            {company.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                    <Card key={product._id} className="hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-400">
                                {product.name[0]}
                            </div>
                            <div>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <p className="text-sm text-gray-500">{company.name}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {product.tagline || product.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {products.length === 0 && (
                    <p className="text-gray-500 col-span-full">No products listed yet.</p>
                )}
            </div>
        </div>
    );
}
