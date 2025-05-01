import Image from "next/image";
import Header from "@/components/Header";
import React from "react";

// images
import categoryOne from "@/../public/images/tv.png"
import categoryTwo from "@/../public/images/smartPhone.png"
import categoryThree from "@/../public/images/soundSystems.jpg"
import categoryFour from "@/../public/images/Refrigerators.jpg"
import categoryFive from "@/../public/images/washingMashing.jpg"

import postOne from "@/../public/images/posts/postOne.png"
import postTwo from "@/../public/images/posts/postTwo.png"
import postThree from "@/../public/images/posts/postThree.png"

import itemTvOne from "@/../public/images/tvOne.png"
import itemTvTwo from "@/../public/images/tvTwo.png"
import itemTvThree from "@/../public/images/tvThree.png"
import itemTvFour from "@/../public/images/tvFour.png"
import itemTvFive from "@/../public/images/tvFive.png"
import itemTvSix from "@/../public/images/tvSix.png"

import itemMicrowaveOne from "@/../public/images/microwaveOne.png"
import itemMicrowaveTwo from "@/../public/images/microwaveTwo.png"
import itemMicrowaveThree from "@/../public/images/microwaveThree.png"

import itemWashingMashingOne from "@/../public/images/washingMashingOne.png"

import mobileOne from "@/../public/images/mobileOne.png"
import mobileTwo from "@/../public/images/mobileTwo.png"
import mobileThree from "@/../public/images/mobileThree.png"
import mobileFour from "@/../public/images/mobileFour.png"
import mobileFive from "@/../public/images/mobileFive.png"
import mobileSix from "@/../public/images/mobileSix.png"

import itemFanOne from "@/../public/images/fanOne.png"
import itemFanTwo from "@/../public/images/fanTwo.png"
import blenderFour from "@/../public/images/blenderFour.png"

import acOne from "@/../public/images/acOne.png"

import washingMachineOne from "@/../public/images/washingMashingOne.png"
import washingMachineTwo from "@/../public/images/washingMashingTwo.png"
import washingMachineThree from "@/../public/images/washingMashingThree.png"
import washingMachineFour from "@/../public/images/washingMashingFour.png"
import washingMachineFive from "@/../public/images/washingMashingFive.png"
import washingMachineSix from "@/../public/images/washingMashingSix.png"
import washingMachineSeven from "@/../public/images/washingMashingSeven.png"




import CategoryCard from "@/components/ItemCategory";
import HeroSection from "@/components/HeroSection";
import ItemCard from "@/components/ItemCard";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div>
            <Header/>

            <HeroSection/>

            <section className='flex justify-center overflow-x-auto no-scrollbar space-x-6 '>
                <CategoryCard imageSrc={categoryOne} title="Tv & Home"/>
                <CategoryCard imageSrc={categoryTwo} title="Smart Phones"/>
                <CategoryCard imageSrc={categoryThree} title="soundSy Systems"/>
                <CategoryCard imageSrc={categoryFour} title="Frigerators"/>
                <CategoryCard imageSrc={categoryFour} title="Frigerators"/>
                <CategoryCard imageSrc={categoryFive} title="Washing Machines"/>
            </section>


            <div className='w-3/4 mx-auto'>
                <div>
                    <div className="border-b border-gray-300 pb-1 mb-2 ">
                        <div className="flex justify-between items-center">
                            <h1 className=" text-gray-800 text-xs md:text-sm font-medium">New Arrived</h1>
                            <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW ALL</a>
                        </div>
                    </div>
                </div>
            </div>


            <section className='flex justify-center  flex-wrap'>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={categoryOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemMicrowaveOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemWashingMashingOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>

                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Top Selling</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={itemMicrowaveThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemMicrowaveTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvFour}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemFanOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemFanTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={blenderFour}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>

                <div className='flex gap-5 my-14 justify-center w-4/5 '>
                    <div>
                        <Image src={postOne} alt={""} className='rounded-md '/>
                    </div>
                    <div>
                        <Image src={postTwo} alt={""} className='rounded-md'/>
                    </div>
                </div>


                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Smart Phone</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={mobileOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={mobileTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={mobileThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={mobileFour}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={mobileFive}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={mobileSix}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>


                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Air Conditioners</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>


                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Air Conditioners</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={itemTvOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvFour}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvFive}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvSix}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>


                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">washing Machine</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={washingMachineSeven}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={washingMachineTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={washingMachineThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={washingMachineFour}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={washingMachineFive}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={washingMachineSix}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>



                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Air Conditioners</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={acOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>



                <div className='w-3/4 mx-auto mt-5'>
                    <div>
                        <div className="border-b border-gray-300 pb-1 mb-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className=" text-gray-800 text-xs md:text-sm font-medium">Air Conditioners</h1>
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW
                                    ALL</a>
                            </div>
                        </div>
                    </div>
                </div>



                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    <ItemCard
                        imageSrc={categoryOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvTwo}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemTvThree}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemMicrowaveOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                    <ItemCard
                        imageSrc={itemWashingMashingOne}
                        title="Smart Ultra HD LED TV"
                        oldPrice="240000"
                        newPrice="240000"
                        inStock={true}/>

                </div>

                <div>
                    <Image src={postThree} alt={""} className='rounded-md'/>
                </div>

            </section>

            <Footer/>
        </div>
    );
}
