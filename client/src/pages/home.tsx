import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ProductCard } from '../components/product-card';
import { Skeleton } from '../components/ui/skeleton';
import testimonials from '../data/testimonials.json';
import '../globals.css'

const categories = [
  {
    category: 'aromatherapy',
    name: 'Aromatherapy',
    description: 'Soothe your senses with essential oil blends.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'decorative',
    name: 'Decorative',
    description: 'Add a touch of elegance to any room.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'gift-sets',
    name: 'Gift Sets',
    description: 'Perfect presents for every occasion.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  },
];

type Product = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock?: boolean;
  quantity?: number;
  featured?: boolean;
  scent?: string;
  isVisiable: boolean;
};

const BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_LATEST_API = `${BASE_URL}/api/products?sort=createdAt:desc&populate=image`;

const fetchLatestProducts = async (): Promise<Product[]> => {
  const res = await fetch(STRAPI_LATEST_API);
  if (!res.ok) throw new Error('Failed to fetch products');

  const json = await res.json();

  const products: Product[] = json.data
    .map((item: any) => {
      const imageFormats = item.image?.formats || {};
      const imageUrl = imageFormats.medium?.url || item.image?.url || imageFormats.thumbnail?.url;

      return {
        id: item.id,
        documentId: item.documentId ?? '',
        name: item.name ?? '',
        price: item.Price ?? 0,
        description: item.description ?? '',
        image: imageUrl ? `${BASE_URL}${imageUrl}` : '',
        inStock: item.inStock ?? false,
        quantity: item.quantity ?? 0,
        featured: item.featured ?? false,
        scent: item.scent ?? '',
        isVisiable: item.isVisiable ?? true,
      };
    })
    .filter((product: Product) =>
      product.isVisiable &&
      product.inStock &&
      product.quantity! > 0
    );

  return products;
};

export default function Home() {
  const {
    data: latestProducts,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ['latest-products'],
    queryFn: fetchLatestProducts,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-light to-purple-accent py-12 sm:py-16 lg:py-20 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-purple-dark mb-4 sm:mb-6 leading-tight">
                Illuminate Your Space with <span className="text-purple-primary">Essia</span>
              </h2>
              <p className="text-lg sm:text-xl text-purple-dark/80 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover our collection of premium handcrafted candles, carefully made with 
                natural ingredients to create the perfect ambiance for your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button className="bg-purple-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    className="border-2 border-purple-primary text-purple-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-primary hover:text-white transition-all duration-200 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1612293905607-b003de9e54fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbmRsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Lavender candles"
                className="rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[450px] xl:w-[550px] h-auto aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              New Arrivals
            </h3>
            <p className="text-base sm:text-lg text-purple-dark/70 max-w-2xl mx-auto">
              Discover our latest handcrafted creations, fresh from the studio.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80 sm:h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError || !latestProducts?.length ? (
            <div className="text-red-500 text-center text-base sm:text-lg">
              Failed to load latest products. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestProducts?.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/products">
              <Button className="bg-purple-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-purple-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Shop by Category
            </h3>
            <p className="text-base sm:text-lg text-purple-dark/70">
              Find the perfect candle for every mood and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => (
              <Link key={category.category} href={`/products?category=${category.category}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 sm:mb-6">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                      <h4 className="text-xl sm:text-2xl font-serif font-bold mb-2">{category.name}</h4>
                      <p className="text-white/90 text-sm sm:text-base">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4 sm:mb-6">
                The Art of Candle Making
              </h3>
              <p className="text-base sm:text-lg text-purple-dark/80 mb-4 sm:mb-6 leading-relaxed">
                At Essia, we believe in the transformative power of handcrafted candles. 
                Each candle is carefully made using premium natural wax, cotton wicks, and 
                thoughtfully selected fragrances that create moments of tranquility in your daily life.
              </p>
              <p className="text-base sm:text-lg text-purple-dark/80 mb-6 sm:mb-8 leading-relaxed">
                Our commitment to sustainability means we use eco-friendly materials and 
                recyclable packaging, ensuring that your relaxation doesn't come at the cost of our planet.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-primary mb-2">500+</div>
                  <div className="text-purple-dark/70 text-sm sm:text-base">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-primary mb-2">50+</div>
                  <div className="text-purple-dark/70 text-sm sm:text-base">Unique Scents</div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1687799273658-c96432c7ee77?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FuZGxlJTIwd2F4fGVufDB8fDB8fHww"
                alt="Crafting candles"
                className="rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[400px] xl:w-[450px] h-auto aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-purple-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              What Our Customers Say
            </h3>
            <p className="text-base sm:text-lg text-purple-dark/70">
              Real experiences from real people who love Essia candles
            </p>
          </div>

          {/* viewport */}
          <div className="overflow-hidden">
            {/* track (twice the testimonials!) */}
            <div className="flex space-x-4 sm:space-x-8 animate-testimonial-scroll">
              {[...testimonials, ...testimonials].map((t, i) => (
                <Card key={i} className="bg-white shadow-lg flex-shrink-0 w-72 sm:w-80">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-purple-dark/80 mb-4 sm:mb-6 italic text-sm sm:text-base">
                      "{t.comment}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                      />
                      <div>
                        <div className="font-semibold text-purple-dark text-sm sm:text-base">{t.name}</div>
                        <div className="text-purple-dark/60 text-xs sm:text-sm">Verified Customer</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-primary to-purple-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-white shadow-2xl">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
                Stay in the Loop
              </h3>
              <p className="text-base sm:text-lg text-purple-dark/70 mb-6 sm:mb-8">
                Be the first to know about new arrivals, exclusive offers, and candle care tips. 
                Join our community of candle lovers!
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 border-purple-secondary focus:ring-purple-primary focus:border-purple-primary"
                />
                <Button
                  type="submit"
                  className="bg-purple-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs sm:text-sm text-purple-dark/50 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}