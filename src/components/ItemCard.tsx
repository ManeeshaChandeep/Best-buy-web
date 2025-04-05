import Image from 'next/image';

const ProductCard = ({ imageSrc, title, oldPrice, newPrice, inStock }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg  hover:shadow-lg transition-shadow  ">
            <div className="relative w-full">
                {inStock && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">IN STOCK</span>}
                <Image src={imageSrc} alt={title}  className="rounded w-32" />

                <p className="text-xs sm:text-sm  font-semibold text-gray-700 mt-1 card-description">{title}</p>
                <div className="flex items-center mt-1">
                    <span className="text-gray-400 line-through text-xs mr-2">Rs. {oldPrice}</span>
                    <span className="text-red-500 font-bold text-xs sm:text-sm ">Rs. {newPrice}</span>
                </div>

            </div>

        </div>
    );
};

export default ProductCard;
