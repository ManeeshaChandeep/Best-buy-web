"use client";

import Image from "next/image";
import categry from "../../../public/images/tv.png";
export default function ItemCategory() {

    return (
        <div>
            <div className=''>
               <div className='flex-row  justify-center'>
                   <Image src={categry}
                          alt={categry}
                          width={150}
                          height={150}
                          className="object-cover rounded-full "/>
               </div>

                <div>
                    <h1>Tv & Home</h1>
                </div>
            </div>
        </div>
    );
}
