'use client'
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";


const Footer: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        policies: false,
        help: false,
        company: false
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section: string) => {
        if (isMobile) {
            setExpandedSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        }
    };

    const socialLinks = [
        { icon: <FaFacebook size={20} />, color: 'hover:text-blue-600', label: 'Facebook' },
        { icon: <FaTwitter size={20} />, color: 'hover:text-blue-400', label: 'Twitter' },
        { icon: <FaInstagram size={20} />, color: 'hover:text-pink-600', label: 'Instagram' },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 pt-1 pb-6">

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/*<div className=" text-white pb-6">
                    <div className=" mx-auto grid grid-cols-2 md:grid-cols-4 gap-0.5 text-center">
                         Customer Support
                        <div className='bg-red-600 p-3 flex lg:flex-col items-center gap-5 flex-wrap'>
                            <div className="flex justify-center mb-2 w-f">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 15a3 3 0 0 0 3-3V9a6 6 0 0 0-12 0v3a3 3 0 0 0 3 3h6zm-6 4v2m-6-2a6 6 0 0 0 12 0" />
                                </svg>
                            </div>
                            <p className="text-sm text-white font-medium">Customer Support<br />8am - 5pm</p>
                        </div>

                         Island-wide Delivery
                        <div className='bg-red-600 p-3 flex lg:flex-col items-center gap-5 flex-wrap'>
                            <div className="flex justify-center mb-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                            </div>
                            <p className="text-sm text-white font-medium">Island-wide<br />Delivery</p>
                        </div>

                         Express Delivery
                        <div className='bg-red-600 p-3 flex lg:flex-col items-center gap-5 flex-wrap'>
                            <div className="flex justify-center mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M13 16h-1v-4h-1M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-white font-medium">Express<br />Delivery</p>
                        </div>

                         100+ Service Centers
                        <div className='bg-red-600 p-3 flex lg:flex-col items-center gap-5 flex-wrap'>
                            <div className="flex justify-center mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M12 8v4l3 3M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-white font-medium">100+ Service<br />Centers</p>
                        </div>
                    </div>
                </div>*/}

                <div className="pt-6 grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"> {/* Reduced gap from gap-6 md:gap-10 */}


                    {/* Policies */}
                    <div className="mt-0 border-b-2 border-gray-200 md:border-none">
                        <h3
                            className={`text-base font-medium text-gray-800 flex justify-between items-center py-3 cursor-pointer ${
                                !isMobile || expandedSections.policies ? 'mb-1' : ''
                            }`}
                            onClick={() => toggleSection('policies')}
                        >
                            Policies
                            {isMobile && (
                                expandedSections.policies
                                    ? <IoMdArrowDropup size={18} className="text-gray-600" />
                                    : <IoMdArrowDropdown size={18} className="text-gray-600" />
                            )}
                        </h3>
                        {(expandedSections.policies || !isMobile) && (
                            <ul className="space-y-1 pb-3">
                                {[
                                    { label: 'Shipping Policy', url: '/shipping' },
                                    { label: 'Return Policy', url: '/returns' },
                                    { label: 'Refund Policy', url: '/refunds' },
                                    { label: 'Warranty', url: '/warranty' },
                                    { label: 'Terms of Service', url: '/terms' }
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.url}
                                            className="text-gray-600 hover:text-red-600 text-sm transition-colors duration-200 flex items-center"
                                        >
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Help Center */}
                    <div className="mt-0 border-b-2 border-gray-200 md:border-none">
                        <h3
                            className={`text-base font-medium text-gray-800 flex justify-between items-center py-3 cursor-pointer ${
                                !isMobile || expandedSections.help ? 'mb-1' : ''
                            }`}
                            onClick={() => toggleSection('help')}
                        >
                            Help
                            {isMobile && (
                                expandedSections.help
                                    ? <IoMdArrowDropup size={18} className="text-gray-600" />
                                    : <IoMdArrowDropdown size={18} className="text-gray-600" />
                            )}
                        </h3>
                        {(expandedSections.help || !isMobile) && (
                            <ul className="space-y-1 pb-3">
                                {[
                                    { label: 'FAQs', url: '/faq' },
                                    { label: 'Track Order', url: '/track-order' },
                                    { label: 'Contact Us', url: '/contact' },
                                    { label: 'Live Chat', url: '/chat' },
                                    { label: 'Feedback', url: '/feedback' }
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.url}
                                            className="text-gray-600 hover:text-red-600 text-sm transition-colors duration-200 flex items-center"
                                        >
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Company */}
                    <div className="mt-0 md:mt-0 border-b-2 border-gray-200 md:border-none">
                        <h3
                            className={`text-base font-medium text-gray-800 flex justify-between items-center py-3 cursor-pointer ${
                                !isMobile || expandedSections.company ? 'mb-1' : ''
                            }`}
                            onClick={() => toggleSection('company')}
                        >
                            About
                            {isMobile && (
                                expandedSections.company
                                    ? <IoMdArrowDropup size={18} className="text-gray-600" />
                                    : <IoMdArrowDropdown size={18} className="text-gray-600" />
                            )}
                        </h3>
                        {(expandedSections.company || !isMobile) && (
                            <div className="space-y-3 pb-3">
                                <ul className="space-y-1">
                                    {[
                                        { label: 'About Us', url: '/about' },
                                        { label: 'Careers', url: '/careers' },
                                        { label: 'Blog', url: '/blog' },
                                        { label: 'Press', url: '/press' }
                                    ].map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.url}
                                                className="text-gray-600 hover:text-red-600 text-sm transition-colors duration-200 flex items-center"
                                            >
                                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>


                                {/* Social Links */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-800 mb-1">Connect With Us</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className={`p-2 rounded-full bg-white shadow-sm ${social.color} transition-colors duration-200`}
                                                aria-label={social.label}
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Brand Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <span className="text-3xl font-bold text-red-600 mr-2">BestBuy</span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Premium</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            Your trusted destination for cutting-edge electronics, premium gadgets, and exceptional service since 2010.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <MdLocationOn className="mr-2 text-red-500" />
                                <span className="text-sm">Wanchawala Galle, Sri Lanka</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MdPhone className="mr-2 text-red-500" />
                                <span className="text-sm">+94 76 123 4567</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MdEmail className="mr-2 text-red-500" />
                                <span className="text-sm">support@bestbuy.lk</span>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="border-t border-gray-200 my-4 md:my-6"></div> {/* Reduced my-6 md:my-8 to my-4 md:my-6 */}

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-xs mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} BestBuy Electronics. All rights reserved.
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-4"> {/* Reduced space-x-4 md:space-x-6 */}
                        <a href="/privacy" className="text-gray-500 hover:text-red-600 text-xs">Privacy Policy</a>
                        <a href="/terms" className="text-gray-500 hover:text-red-600 text-xs">Terms of Service</a>
                        <a href="/cookies" className="text-gray-500 hover:text-red-600 text-xs">Cookie Policy</a>
                    </div>

                    <div className="mt-3 md:mt-0"> {/* Reduced mt-4 to mt-3 */}
                        <div className="flex items-center">
                            <span className="text-gray-500 text-xs mr-2">Secure payments:</span>
                            <div className="flex space-x-1"> {/* Reduced space-x-2 to space-x-1 */}
                                <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;