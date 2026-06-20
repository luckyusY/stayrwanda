export type Property = {
  slug: string;
  title: string;
  location: string;
  neighborhood: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  image: string;
  images: string[];
  badge?: string;
  amenities: string[];
  description: string;
  host: string;
};

const images = {
  kigali: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  villa: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
  loft: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  hills: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
  suite: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
  garden: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
};

export const featuredProperties: Property[] = [
  { slug: "serene-kimihurura-apartment", title: "Serene Kimihurura Apartment", location: "Kigali, Rwanda", neighborhood: "Kimihurura", type: "Apartment", price: 84, rating: 4.92, reviews: 68, guests: 4, bedrooms: 2, beds: 2, baths: 2, image: images.kigali, images: [images.kigali, images.loft, images.suite], badge: "Guest favourite", amenities: ["Fast WiFi", "City view", "Kitchen", "Free parking", "Workspace", "24/7 security"], description: "A calm, light-filled apartment in one of Kigali's most loved neighborhoods. Walk to cafés and restaurants, then come home to wide city views and considered local details.", host: "Aline" },
  { slug: "rebero-hillside-villa", title: "Rebero Hillside Villa", location: "Kigali, Rwanda", neighborhood: "Rebero", type: "Villa", price: 156, rating: 4.97, reviews: 41, guests: 6, bedrooms: 3, beds: 4, baths: 3, image: images.villa, images: [images.villa, images.hills, images.garden], badge: "Top rated", amenities: ["Private garden", "Mountain view", "Kitchen", "Free parking", "Washer", "Housekeeping"], description: "A private hillside retreat with generous indoor-outdoor living and sweeping views across Kigali. Designed for families, groups and slow mornings.", host: "Patrick" },
  { slug: "nyarutarama-design-loft", title: "Nyarutarama Design Loft", location: "Kigali, Rwanda", neighborhood: "Nyarutarama", type: "Loft", price: 112, rating: 4.89, reviews: 52, guests: 2, bedrooms: 1, beds: 1, baths: 1, image: images.loft, images: [images.loft, images.suite, images.kigali], amenities: ["Fast WiFi", "Pool", "Gym", "Air conditioning", "Workspace", "Doorman"], description: "Contemporary loft living close to Kigali Golf Resort. Clean architecture, warm textures and everything you need for a polished business or leisure stay.", host: "Diane" },
  { slug: "musanze-mountain-house", title: "Musanze Mountain House", location: "Musanze, Rwanda", neighborhood: "Ruhengeri", type: "Guesthouse", price: 96, rating: 4.95, reviews: 37, guests: 5, bedrooms: 2, beds: 3, baths: 2, image: images.hills, images: [images.hills, images.garden, images.villa], badge: "Rare find", amenities: ["Volcano view", "Fireplace", "Breakfast", "Garden", "Parking", "Tour booking"], description: "Wake up to volcano views from a warm, characterful guesthouse near Rwanda's most unforgettable mountain adventures.", host: "Eric" },
  { slug: "kacyiru-business-suite", title: "Kacyiru Business Suite", location: "Kigali, Rwanda", neighborhood: "Kacyiru", type: "Serviced apartment", price: 72, rating: 4.86, reviews: 93, guests: 2, bedrooms: 1, beds: 1, baths: 1, image: images.suite, images: [images.suite, images.kigali, images.loft], amenities: ["Fast WiFi", "Workspace", "Daily cleaning", "Generator", "Airport pickup", "Security"], description: "A reliable, comfortable base near embassies and offices, with excellent connectivity and thoughtful service for business travelers.", host: "Mireille" },
  { slug: "kibagabaga-garden-home", title: "Kibagabaga Garden Home", location: "Kigali, Rwanda", neighborhood: "Kibagabaga", type: "House", price: 128, rating: 4.91, reviews: 29, guests: 6, bedrooms: 3, beds: 3, baths: 2, image: images.garden, images: [images.garden, images.villa, images.hills], amenities: ["Private garden", "Family friendly", "Kitchen", "Parking", "Washer", "Patio"], description: "A welcoming family home with a peaceful garden, plenty of room, and easy access to eastern Kigali.", host: "Sandrine" },
];

export function getProperty(slug: string) {
  return featuredProperties.find((property) => property.slug === slug);
}
