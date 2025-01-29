import { urlFor } from "@/sanity/lib/image";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { getImageDimensions, SanityImageSource } from "@sanity/asset-utils";
import AddtoBasketButton from "@/components/AddtoBasketButton";

const SampleImageComponent = ({
  value,
  isInline,
}: {
  value: SanityImageSource & { alt?: string };
  isInline: boolean;
}) => {
  const { width, height } = getImageDimensions(value);
  const dataset = process.env.SANITY_STUDIO_DATASET!;
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;

  return (
    <Image
      src={urlBuilder({ dataset, projectId })
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        display: isInline ? "inline-block" : "block",
        aspectRatio: width / height,
      }}
    />
  );
};

const components = {
  types: {
    image: SampleImageComponent,
  },
};

export const dynamic = "force-static";
export const revalidate = 60;

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          {product.image && (
            <Image
              src={urlFor(product.image).url() || ""}
              alt={product.name || "Product image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-lg font-bold text-white">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            <div className="mb-4 text-xl font-semibold">
              ${product.price?.toFixed(2)}
            </div>
            <div className="prose mb-6 max-w-none">
              {Array.isArray(product.description) && (
                <PortableText
                  value={product.description}
                  components={components}
                />
              )}
            </div>
          </div>
          <div className="mt-6">
            <AddtoBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
