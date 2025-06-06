'use client'
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

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
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"> {/* Reduced gap from gap-6 md:gap-10 */}
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

                    {/* Policies */}
                    <div className="mt-2 md:mt-0"> {/* Reduced mt-4 to mt-2 */}
                        <h3
                            className={`text-lg font-semibold text-gray-800 flex justify-between items-center cursor-pointer ${
                                !isMobile || expandedSections.policies ? 'mb-2' : '' // Reduced mb-3 to mb-2
                            }`}
                            onClick={() => toggleSection('policies')}
                        >
                            Policies
                            {isMobile && (
                                expandedSections.policies ? <IoMdArrowDropup /> : <IoMdArrowDropdown />
                            )}
                        </h3>
                        {(expandedSections.policies || !isMobile) && (
                            <ul className="space-y-1"> {/* Reduced space-y-2 to space-y-1 */}
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
                    <div className="mt-2 md:mt-0"> {/* Reduced mt-4 to mt-2 */}
                        <h3
                            className={`text-lg font-semibold text-gray-800 flex justify-between items-center cursor-pointer ${
                                !isMobile || expandedSections.help ? 'mb-2' : '' // Reduced mb-3 to mb-2
                            }`}
                            onClick={() => toggleSection('help')}
                        >
                            Help Center
                            {isMobile && (
                                expandedSections.help ? <IoMdArrowDropup /> : <IoMdArrowDropdown />
                            )}
                        </h3>
                        {(expandedSections.help || !isMobile) && (
                            <ul className="space-y-1"> {/* Reduced space-y-2 to space-y-1 */}
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
                    <div className="mt-2 md:mt-0"> {/* Reduced mt-4 to mt-2 */}
                        <h3
                            className={`text-lg font-semibold text-gray-800 flex justify-between items-center cursor-pointer ${
                                !isMobile || expandedSections.company ? 'mb-2' : '' // Reduced mb-3 to mb-2
                            }`}
                            onClick={() => toggleSection('company')}
                        >
                            Company
                            {isMobile && (
                                expandedSections.company ? <IoMdArrowDropup /> : <IoMdArrowDropdown />
                            )}
                        </h3>
                        {(expandedSections.company || !isMobile) && (
                            <div className="space-y-3"> {/* Reduced space-y-4 to space-y-3 */}
                                <ul className="space-y-1"> {/* Reduced space-y-2 to space-y-1 */}
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
                                <div>
                                    <h4 className="text-sm font-medium text-gray-800 mb-1">Connect With Us</h4> {/* Reduced mb-2 to mb-1 */}
                                    <div className="flex flex-wrap gap-1"> {/* Reduced gap-2 to gap-1 */}
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