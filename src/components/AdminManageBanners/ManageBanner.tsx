'use client'
import React, { useState } from 'react';
import BannerTable from '@/components/ManageBanners/BannerTable';
import AddBanner from '@/components/ManageBanners/AddBanner';

export default function ManageBanners() {


    const handleBannerAdded = () => {
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Banner Management</h1>

            <div className="mb-8">
                <AddBanner />
            </div>

            <BannerTable />
        </div>
    );
}
