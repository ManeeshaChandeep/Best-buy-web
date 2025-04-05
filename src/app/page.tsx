import Image from "next/image";
import Header from "@/components/Header";
import React from "react";

// images
import mainImage from "@/../public/images/main-imge.png"
import categoryOne from "@/../public/images/tv.png"
import categoryTwo from "@/../public/images/smartPhone.png"
import categoryThree from "@/../public/images/soundSystems.jpg"
import categoryFour from "@/../public/images/Refrigerators.jpg"
import categoryFive from "@/../public/images/washingMashing.jpg"

import CategoryCard from "@/components/ItemCategory";
import HeroSection from "@/components/HeroSection";
import ItemCard from "@/components/ItemCard";
export default function Home() {
  return (
    <div>
      <Header/>

      <HeroSection/>

        <section className='flex justify-center overflow-x-auto no-scrollbar space-x-6 '>
        <CategoryCard imageSrc={categoryOne} title="Tv & Home" />
        <CategoryCard imageSrc={categoryTwo} title="Smart Phones" />
        <CategoryCard imageSrc={categoryThree} title="soundSy Systems" />
        <CategoryCard imageSrc={categoryFour} title="Frigerators" />
        <CategoryCard imageSrc={categoryFive} title="Washing Machines" />
        </section>


        <section className='flex justify-center  flex-wrap'>
          <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
          <ItemCard
              imageSrc={categoryOne}
              title="Smart Ultra HD LED TV"
              oldPrice="240000"
              newPrice="240000"
              inStock={true}/>

            <ItemCard
                imageSrc={categoryOne}
                title="Smart Ultra HD LED TV"
                oldPrice="240000"
                newPrice="240000"
                inStock={true}/>

            <ItemCard
                imageSrc={categoryOne}
                title="Smart Ultra HD LED TV"
                oldPrice="240000"
                newPrice="240000"
                inStock={true}/>

            <ItemCard
                imageSrc={categoryOne}
                title="Smart Ultra HD LED TV"
                oldPrice="240000"
                newPrice="240000"
                inStock={true}/>

            <ItemCard
                imageSrc={categoryOne}
                title="Smart Ultra HD LED TV"
                oldPrice="240000"
                newPrice="240000"
                inStock={true}/>

            <ItemCard
                imageSrc={categoryOne}
                title="Smart Ultra HD LED TV"
                oldPrice="240000"
                newPrice="240000"
                inStock={true}/>
          </div>

        </section>
    </div>
  );
}
