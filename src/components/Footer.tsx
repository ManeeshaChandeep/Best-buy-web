'use client'
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showPolicies, setShowPolicies] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 700);
        };

        handleResize(); // Check initially
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <footer className="bg-white py-10 drop-shadow-lg mt-14">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-red-600">BestBuy</h2>
                    <p className="text-sm">
                        Discover the latest in electronics – from cutting-edge gadgets to premium accessories.
                    </p>
                    <p className="text-sm mt-7">
                        Wanchawala Galle, Sri Lanka.
                    </p>
                </div>

                {/* Policies */}
                <div>
                    <h3
                        className="text-xl font-semibold mb-3 cursor-pointer flex justify-between items-center"
                        onClick={() => isMobile && setShowPolicies(!showPolicies)}
                    >
                        Policies
                        {isMobile && <span>{showPolicies ? '−' : '+'}</span>}
                    </h3>
                    {(showPolicies || !isMobile) && (
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:underline">Customer Support</a></li>
                            <li><a href="/shop" className="hover:underline">Terms & Conditions</a></li>
                            <li><a href="/about" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="/contact" className="hover:underline">Return and Refund Policy</a></li>
                        </ul>
                    )}
                </div>

                {/* Help */}
                <div>
                    <h3
                        className="text-xl font-semibold mb-3 cursor-pointer flex justify-between items-center"
                        onClick={() => isMobile && setShowHelp(!showHelp)}
                    >
                        Help
                        {isMobile && <span>{showHelp ? '−' : '+'}</span>}
                    </h3>
                    {(showHelp || !isMobile) && (
                        <ul className="space-y-2 text-sm">
                            <li><a href="/faq" className="hover:underline">Customer Support</a></li>
                            <li><a href="/returns" className="hover:underline">Terms & Conditions</a></li>
                            <li><a href="/support" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="/track-order" className="hover:underline">Return and Refund Policy</a></li>
                        </ul>
                    )}
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-blue-500"><FaFacebook size={20} /></a>
                        <a href="#" className="hover:text-blue-400"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-pink-500"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-red-600"><FaYoutube size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Bottom line */}
            <div className="text-center text-sm text-gray-400 mt-10">
                &copy; {new Date().getFullYear()} BestBuy. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
