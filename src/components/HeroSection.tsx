import Image from "next/image";
import mainImage from "../../public/images/main-imge.png";
import React from "react";

const HeroSection = () => {

  return (
      <section className="relative bg-gray-100">
          <div className="container mx-auto flex flex-col  items-center justify-between px-6 py-20">

              {/* Left Side - Text */}
              <div className="max-w-2xl text-center ">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                      Discover the Best <span className="text-red-600">Electronics</span>
                  </h1>
                  <p className="mt-4 text-gray-600 text-lg">
                      Find the latest gadgets, smartphones, laptops, and accessories at unbeatable prices.
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-6 flex justify-center  space-x-4">
                      <a href="#" className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md text-lg">
                          Shop Now
                      </a>
                      <a href="#" className="px-6 py-2 text-gray-900 border border-gray-300 hover:bg-gray-200 rounded-full text-lg">
                          Explore
                      </a>
                  </div>
              </div>

              {/* Right Side - Hero Image */}
              <div className="mt-10 ">
                  <Image
                      src={mainImage} // Replace with your actual image
                      alt="Electronics"
                      width={700}
                      height={700}
                  />
              </div>

          </div>
      </section>
  )
}

export default  HeroSection;
