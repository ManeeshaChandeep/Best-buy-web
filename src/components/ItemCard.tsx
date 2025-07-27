import Image, {StaticImageData} from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    imageSrc: StaticImageData;
    imageUrl?: string;
    title: string;
    oldPrice: number | string;
    newPrice: number | string;
    inStock: boolean;
}

const ProductCard = ({
                         id,
                         imageSrc,
                         imageUrl,
                         title,
                         oldPrice,
                         newPrice,
                         inStock,
                     }: ProductCardProps) => {
    return (
        <Link href={`/details/${id}`} className="no-underline text-inherit">
            <div
                className="bg-white rounded-md transition-all duration-200 flex flex-col items-center justify-between
                p-2 hover:scale-[1.03] hover:shadow-md group w-full min-w-[130px] max-w-[43vw] sm:max-w-[190px]
                md:max-w-[200px] lg:max-w-[220px] h-[220px] md:mx-auto">


                {/* Image Section */}
                <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[190px] flex justify-center items-center overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={imageUrl || imageSrc}
                        alt={title}
                        width={230}
                        height={190}
                        className="object-contain w-full h-full"
                        unoptimized
                    />
                </div>



                {/* Title */}
                <div className="text-center mt-1 px-1">
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 leading-tight font-medium line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
                        {title}
                    </p>
                </div>

                {/* Price Row */}
                <div className="flex justify-center items-center gap-2 mt-1">
                    <span className="text-[10px] sm:text-[14px] text-gray-400 line-through">Rs. {oldPrice}</span>
                    <span className="text-[11px] sm:text-[16px] text-red-600 font-semibold">Rs. {newPrice}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
