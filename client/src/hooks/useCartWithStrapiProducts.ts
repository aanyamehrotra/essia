import { useEffect, useState } from 'react';
import { useCart } from '../context/cart-context';

const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL;

export function useCartWithStrapiProducts() {
  const { cartItems, ...rest } = useCart();
  const [enrichedItems, setEnrichedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const enriched = await Promise.all(
        cartItems.map(async (cartItem) => {
          try {
            const res = await fetch(`${STRAPI_URL}/api/products?filters[id][$eq]=${cartItem.productId}&populate=image`);
            const json = await res.json();
            const item = json?.data?.[0];

            const imageUrl =
              item?.image?.formats?.medium?.url ||
              item?.image?.url ||
              item?.image?.formats?.thumbnail?.url;

            return {
              cartItemId: cartItem.id,
              productId: item?.id ?? cartItem.productId,
              name: item?.Name ?? 'Unavailable',
              price: item?.Price ?? 0,
              description: item?.description ?? '',
              image: imageUrl ? `${STRAPI_URL}${imageUrl}` : '',
              inStock: item?.inStock ?? false,
              featured: item?.featured ?? false,
              category: item?.category ?? 'Unknown',
              isVisiable: item?.isVisiable ?? true,
              quantity: cartItem.quantity,
            };
          } catch (err) {
            console.error('Error fetching product', err);
            return {
              cartItemId: cartItem.id,
              productId: cartItem.productId,
              name: 'Unavailable',
              price: 0,
              description: '',
              image: '',
              inStock: false,
              featured: false,
              category: 'Unknown',
              isVisiable: false,
              quantity: cartItem.quantity,
            };
          }
        })
      );

      setEnrichedItems(enriched.filter(Boolean));
    };

    if (cartItems.length > 0) fetchProducts();
    else setEnrichedItems([]);
  }, [cartItems]);

  return {
    cartItems: enrichedItems,
    ...rest,
  };
}
