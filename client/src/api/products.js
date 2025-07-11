const STRAPI_URL = import.meta.env.VITE_STRAPI_DATA_URL;

export const fetchProducts = async () => {
  const res = await fetch(STRAPI_URL);
  if (!res.ok) throw new Error("Failed to fetch products");

  const json = await res.json();

  return json.data.map((item) => {
    const attr = item.attributes;
    const imageUrl = attr.image?.data?.attributes?.url;
    return {
        id: json.data.id,
        name: attr.name,
        price: attr.price,
        description: attr.description,
        image: imageUrl ? `${STRAPI_URL}${imageUrl}` : '',
        inStock: true,
        featured: false,
        scent: '',
        size: '',
        burnTime: 0,
        ingredients: '',
    };
  });
};
