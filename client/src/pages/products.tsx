import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ProductCard } from '../components/product-card';
import { Skeleton } from '../components/ui/skeleton';
import { Search } from 'lucide-react';

type Product = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  scent?: string;
  category?: string;
  isVisiable?: boolean;
};

const BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API = import.meta.env.VITE_STRAPI_DATA_URL;

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(STRAPI_API);
  if (!res.ok) throw new Error('Failed to fetch products');

  const json = await res.json();
  return json.data
    .filter((item: any) => item?.isVisiable !== false)
    .map((item: any) => {
      const attr = item || {};
      const imageAttr = attr.image;

      const imageUrl =
        imageAttr?.formats?.medium?.url ||
        imageAttr?.url ||
        imageAttr?.formats?.thumbnail?.url;

      return {
        id: item.id,
        documentId: attr.documentId || '',
        name: attr.Name || 'Unnamed Product',
        price: attr.Price ?? 0,
        description: attr.description || '',
        image: imageUrl ? `${BASE_URL}${imageUrl}` : '',
        inStock: attr.inStock ?? true,
        featured: attr.featured ?? false,
        scent: attr.scent ?? '',
        category: attr.category ?? 'random',
        isVisiable: attr.isVisiable ?? true,
      };
    });
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filteredProducts = products
    .filter((p) => p?.name)
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' ||
        (p.category?.toLowerCase() === selectedCategory.toLowerCase());
      return matchSearch && matchCategory;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'oldest':
        return a.id - b.id;
      case 'stock':
        return Number(b.inStock) - Number(a.inStock);
      case 'featured':
        return Number(b.featured) - Number(a.featured);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'random', label: 'Random' },
    { value: 'lavender', label: 'Lavender' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'fruit', label: 'Fruity' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-purple-dark mb-4">Our Collection</h1>
          <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
            Discover our complete range of premium handcrafted candles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={(e) => e.preventDefault()} className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search candles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A–Z)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="stock">In Stock First</SelectItem>
                <SelectItem value="featured">Featured First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isLoading && (
          <div className="mb-8">
            <p className="text-purple-dark/70">
              Showing {sortedProducts.length} product
              {sortedProducts.length !== 1 && 's'}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' &&
                ` in ${categories.find((c) => c.value === selectedCategory)?.label}`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-600">Failed to load products. Please try again.</div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕯️</div>
            <h3 className="text-2xl font-serif font-bold text-purple-dark mb-2">No Products Found</h3>
            <p className="text-purple-dark/70 mb-6">
              We couldn't find any products matching your criteria. Try adjusting your search or filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-purple-primary text-white hover:bg-purple-primary/90"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
