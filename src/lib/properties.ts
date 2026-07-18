import kagaramaGallery from "../../public/images/properties/kagarama/metadata.json";
import kibagabagaOneGallery from "../../public/images/properties/kibagabaga-1/metadata.json";
import kibagabagaTwoGallery from "../../public/images/properties/kibagabaga-2/metadata.json";
import kimironkoGallery from "../../public/images/properties/kimironko-1/metadata.json";
import mamaLinaGallery from "../../public/images/properties/kimironko-mama-lina/metadata.json";
import rebeccaGallery from "../../public/images/properties/rebeccas-apartment/metadata.json";
import tgaGallery from "../../public/images/properties/tga-apartment-1/metadata.json";

export type Property = {
  slug: string;
  title: string;
  location: string;
  neighborhood: string;
  type: string;
  price?: number;
  rating?: number;
  reviews?: number;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  image: string;
  images: string[];
  badge?: string;
  amenities: string[];
  description: string;
  host: string;
  sourceUrl: string;
  photoCount: number;
};

type Gallery = typeof kagaramaGallery;

function galleryImages(gallery: Gallery) {
  return gallery.images.map((image) => {
    const cloud = (image as { cloudinaryUrl?: string }).cloudinaryUrl;
    return cloud || image.localPath;
  });
}

function propertyFromGallery(
  gallery: Gallery,
  details: Omit<Property, "image" | "images" | "sourceUrl" | "photoCount">,
): Property {
  const images = galleryImages(gallery);
  return {
    ...details,
    image: images[0],
    images,
    sourceUrl: gallery.sourceUrl,
    photoCount: gallery.photoCount,
  };
}

const sharedAmenities = ["Fully furnished", "Equipped kitchen", "Private living area", "On-site parking"];

export const featuredProperties: Property[] = [
  propertyFromGallery(kibagabagaOneGallery, {
    slug: "kibagabaga-apartment-one",
    title: "Kibagabaga Garden Apartment I",
    location: "Kigali, Rwanda",
    neighborhood: "Kibagabaga",
    type: "Furnished apartment",
    price: 85000,
    badge: "New listing",
    amenities: [...sharedAmenities, "Landscaped entrance", "Gated compound"],
    description: "A fully furnished stay in Kibagabaga, presented in the original property gallery with bright living spaces, a landscaped entrance and private compound parking.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(kibagabagaTwoGallery, {
    slug: "kibagabaga-apartment-two",
    title: "Kibagabaga Garden Apartment II",
    location: "Kigali, Rwanda",
    neighborhood: "Kibagabaga",
    type: "Furnished apartment",
    price: 90000,
    badge: "Featured",
    amenities: [...sharedAmenities, "Gated compound", "Outdoor space"],
    description: "A welcoming furnished home in Kibagabaga with a secure private compound and a complete gallery of indoor and outdoor spaces.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(kimironkoGallery, {
    slug: "kimironko-twin-apartment",
    title: "Kimironko Twin Apartment",
    location: "Kigali, Rwanda",
    neighborhood: "Kimironko",
    type: "Furnished apartment",
    price: 80000,
    badge: "Twin residence",
    amenities: [...sharedAmenities, "Private balcony", "Gated entrance"],
    description: "A contemporary twin residence in Kimironko with furnished interiors, private balconies and secure off-street access.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(kagaramaGallery, {
    slug: "kagarama-furnished-residence",
    title: "Kagarama Furnished Residence",
    location: "Kigali, Rwanda",
    neighborhood: "Kagarama",
    type: "Furnished apartment",
    price: 75000,
    amenities: [...sharedAmenities, "Secure entrance", "Residential setting"],
    description: "A furnished residential stay in Kagarama with a secure entrance and a full photographic tour of the property.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(tgaGallery, {
    slug: "tg-executive-apartment",
    title: "TG Executive Apartment",
    location: "Kigali, Rwanda",
    neighborhood: "Kigali",
    type: "Serviced apartment",
    price: 120000,
    badge: "Executive stay",
    amenities: [...sharedAmenities, "Balcony", "Secure parking"],
    description: "A modern multi-level apartment in Kigali with generous balconies, contemporary finishes and secure courtyard parking.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(rebeccaGallery, {
    slug: "rebeccas-furnished-apartment",
    title: "Rebecca's Furnished Apartment",
    location: "Kigali, Rwanda",
    neighborhood: "Kigali",
    type: "Furnished apartment",
    price: 100000,
    amenities: [...sharedAmenities, "Balcony", "Secure compound"],
    description: "A spacious furnished apartment in a secure Kigali compound, documented across a complete 36-photo property gallery.",
    host: "Fully Furnished Apartments",
  }),
  propertyFromGallery(mamaLinaGallery, {
    slug: "mama-lina-kimironko-home",
    title: "Mama Lina Kimironko Home",
    location: "Kigali, Rwanda",
    neighborhood: "Kimironko",
    type: "Furnished home",
    price: 110000,
    amenities: [...sharedAmenities, "Garden", "Private compound"],
    description: "A private furnished home in Kimironko with mature greenery, a walled compound and an extensive gallery of the residence.",
    host: "Fully Furnished Apartments",
  }),
];

export function getProperty(slug: string) {
  return featuredProperties.find((property) => property.slug === slug);
}
