import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/cart-context';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, Clock, Package, Leaf } from 'lucide-react';

const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL;

type Product = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  scent?: string;
  size?: string;
  burnTime?: number;
  ingredients?: string;
  category?: string;
  isVisiable?: boolean;
};

const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${STRAPI_URL}/api/products/${id}?populate=image`);
  if (!res.ok) throw new Error('Product not found');

  const json = await res.json();
  const item = json.data;

  const attrs = item.attributes;

  const imageFormats = attrs?.image?.data?.attributes?.formats;
  const rawImageUrl = imageFormats?.medium?.url || attrs?.image?.data?.attributes?.url;

  return {
    id: item.id,
    documentId: attrs?.documentId ?? '', 
    name: attrs?.Name ?? '',
    price: attrs?.Price ?? 0,
    description: attrs?.description ?? '',
    image: rawImageUrl ? `${STRAPI_URL}${rawImageUrl}` : '',
    inStock: attrs?.inStock ?? true,
    featured: attrs?.featured ?? false,
    scent: attrs?.scent ?? '',
    size: attrs?.size ?? '',
    burnTime: attrs?.burnTime ?? 0,
    ingredients: attrs?.ingredients ?? '',
    category: attrs?.category ?? 'Random',
    isVisiable: attrs?.isVisiable ?? true,
  };
};

export default function ProductDetail() {
  const [, params] = useRoute('/products/:id');
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ['product', params?.id],
    queryFn: () => fetchProductById(params!.id),
    enabled: !!params?.id,
  });

  const cartItem = cartItems.find((item) => item.productId === product?.id);
  const cartQty = cartItem?.quantity ?? 0;

  const handleAdd = async () => {
    if (!product || !product.inStock) return;
    try {
      if (!cartItem) {
        await addToCart(product, 1);
        toast({ title: 'Added to Cart', description: `${product.name} added to your cart.` });
      } else {
        await updateQuantity(cartItem.id, cartQty + 1);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async () => {
    if (!cartItem) return;
    try {
      await updateQuantity(cartItem.id, cartQty - 1);
    } catch {
      toast({
        title: 'Error',
        description: 'Unable to update cart item.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="h-80 sm:h-96 lg:h-[600px] rounded-2xl" />
            <div className="space-y-4 sm:space-y-6">
              <Skeleton className="h-6 sm:h-8 w-3/4" />
              <Skeleton className="h-4 sm:h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 sm:h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product || !product.isVisiable) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-4xl sm:text-6xl mb-4">🕯️</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-dark mb-4">Product Not Available</h1>
          <p className="text-purple-dark/70 mb-6 sm:mb-8 text-base sm:text-lg">
            The product you're looking for is not visible or has been removed.
          </p>
          <Link href="/products">
            <Button className="bg-purple-primary text-white hover:bg-purple-primary/90">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6 sm:mb-8 text-purple-dark hover:text-purple-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 sm:h-96 lg:h-[600px] object-cover rounded-2xl shadow-2xl"
            />
            {product.featured && (
              <Badge className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-purple-primary text-white">
                Best Seller
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <Badge variant="secondary" className="text-white bg-gray-800 text-base sm:text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-2">
                {product.name}
              </h1>

              <p className="text-sm text-purple-dark/60 mb-4">
                🏷️ Category:{' '}
                <Badge variant="outline" className="text-purple-primary border-purple-primary ml-1">
                  {product.category}
                </Badge>
              </p>

              <p className="text-xl sm:text-2xl font-bold text-purple-primary mb-4">
                {formatPrice(product.price)}
              </p>
            </div>

            <p className="text-base sm:text-lg text-purple-dark/80 leading-relaxed">
              {product.description}
            </p>

            {product.scent && (
              <div>
                <h3 className="font-semibold text-purple-dark mb-2">Scent Profile</h3>
                <Badge variant="outline" className="text-purple-primary border-purple-primary">
                  {product.scent}
                </Badge>
              </div>
            )}

            {/* Product Details Card */}
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h3 className="font-semibold text-purple-dark mb-4">Product Details</h3>
                {product.size && (
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-purple-primary" />
                    <span className="text-purple-dark/80">Size: {product.size}</span>
                  </div>
                )}
                {(product.burnTime ?? 0) > 0 && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-primary" />
                    <span className="text-purple-dark/80">Burn Time: {product.burnTime} hours</span>
                  </div>
                )}
                {product.ingredients && (
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-5 w-5 text-purple-primary mt-0.5" />
                    <div>
                      <p className="text-purple-dark/80 font-medium mb-1">Ingredients:</p>
                      <p className="text-purple-dark/70 text-sm">{product.ingredients}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {product.inStock ? (
                cartQty === 0 ? (
                  <Button
                    onClick={handleAdd}
                    className="w-full bg-purple-primary text-white hover:bg-purple-primary/90 py-3 text-base sm:text-lg font-semibold"
                    size="lg"
                  >
                    Add to Cart - {formatPrice(product.price)}
                  </Button>
                ) : (
                  <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                    <Button 
                      onClick={handleRemove} 
                      size="icon" 
                      variant="outline" 
                      className="text-purple-primary border-purple-primary h-10 w-10"
                    >
                      –
                    </Button>
                    <span className="text-lg font-medium text-purple-dark">{cartQty}</span>
                    <Button 
                      onClick={handleAdd} 
                      size="icon" 
                      variant="outline" 
                      className="text-purple-primary border-purple-primary h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                )
              ) : (
                <Button disabled className="w-full bg-gray-400 text-white py-3 text-base sm:text-lg font-semibold">
                  Out of Stock
                </Button>
              )}

              <p className="text-sm text-purple-dark/60 text-center">
                Free shipping on orders over ₹50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}