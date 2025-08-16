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

    const formatPrice = (price: number | string) => {
        const num = Number(price);
        return `Rs. ${num.toLocaleString("en-LK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };


    return (
        <Link href={`/details/${id}`} className="no-underline text-inherit">
            <div
                className="bg-white rounded-md transition-all duration-200 flex flex-col items-center
                hover:scale-[1.03] hover:shadow-md group min-w-[110px] w-[43vw] sm:w-[31vw]
                md:w-[22vw] lg:w-[16vw] h-[180px] md:mx-auto mb-4">


                {/* Image Section */}
                <div
                    className="relative w-[90%] h-[140px] sm:h-[160px] md:h-[180px] lg:h-[190px] flex justify-center items-center overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-300">
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
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 font-medium line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
                        {title}
                    </p>
                </div>

                {/* Price Row */}
                <div className="flex justify-center items-center gap-2 mt-0.5">
                    <span className="text-[11px] sm:text-[15px] text-gray-400 line-through">
                        {formatPrice(oldPrice)}
                    </span>
                    <span className="text-[12px] sm:text-[17px] text-red-600 font-semibold">
                        {formatPrice(newPrice)}
                    </span>
                </div>

            </div>
        </Link>
    );
};

export default ProductCard;
