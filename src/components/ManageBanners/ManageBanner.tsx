'use client'
import React, { useState } from 'react';
import BannerTable from '@/components/ManageBanners/BannerTable';
import AddBanner from '@/components/ManageBanners/AddBanner';

export default function ManageBanners() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleBannerAdded = () => {
        // Trigger refresh of the table
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Banner Management</h1>

            <div className="mb-8">
                <AddBanner onBannerAdded={handleBannerAdded} />
            </div>

            <BannerTable refreshTrigger={refreshTrigger} />
        </div>
    );
}
