"use client";
import DashboardWidget from "@/components/widgets/DashboardWidgets";
import {
    getAnalyticsForTenant,
    getTenantPreferences,
    simulateRealtimeUpdate,
} from "@/lib/helpers/functions";
import { Tenant } from "@/types/User.type";
import { getCookie } from "cookies-next/client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type UserRole = "admin" | "manager" | "viewer";

const Dashboard = () => {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tenantData, setTenantData] = useState<Tenant | undefined>();

    const session = getCookie("session");
    const tenantId = getCookie("tenantId");
    const userRole: UserRole = session?.includes("admin")
        ? "admin"
        : session?.includes("manager")
        ? "manager"
        : "viewer";

    useEffect(() => {
        if (tenantId) {
            setTenantData(getTenantPreferences(tenantId));
        }
    }, [tenantId]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = getAnalyticsForTenant(tenantId as string);
                setAnalyticsData(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load analytics");
                setLoading(false);
            }
        };

        fetchAnalytics();

        // Simulate real-time updates
        const updateInterval = setInterval(() => {
            const updatedData = simulateRealtimeUpdate(tenantId as string);
            setAnalyticsData((prev: any) => [
                updatedData,
                ...prev.slice(0, -1),
            ]);
        }, 10000); // Update every 10 seconds

        return () => clearInterval(updateInterval);
    }, [tenantId]);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = getAnalyticsForTenant(tenantId as string);
            setAnalyticsData(data);
            setLoading(false);
        } catch (err) {
            setError("Refresh failed");
            setLoading(false);
        }
    };

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    if (loading || !analyticsData) {
        return <div>Loading...</div>;
    }

    const latestData = analyticsData[0].metrics;

    return (
        <div className={`p-6 dark:text-primary-foreground `}>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center'>
                    <Image
                        width={50}
                        height={50}
                        src={tenantData?.logo as string}
                        alt={`${tenantData?.name} Logo`}
                        className='h-12 w-12 mr-4'
                    />
                    <h1 className='text-2xl font-bold'>
                        {tenantData?.name} Dashboard
                    </h1>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <DashboardWidget
                    title='Daily Active Users'
                    data={[
                        {
                            label: "Total Active Users",
                            value: latestData.dailyActiveUsers,
                            trend:
                                latestData.dailyActiveUsers > 90
                                    ? "up"
                                    : "down",
                        },
                        {
                            label: "New Signups",
                            value: latestData.newUserSignups,
                            trend:
                                latestData.newUserSignups > 10
                                    ? "up"
                                    : "neutral",
                        },
                    ]}
                    type='number'
                    userRole={userRole}
                    onRefresh={handleRefresh}
                    loading={loading}
                />

                <DashboardWidget
                    title='Revenue Metrics'
                    data={[
                        {
                            label: "Total Revenue",
                            value: latestData.revenue,
                            trend: latestData.revenue > 40000 ? "up" : "down",
                        },
                    ]}
                    type='currency'
                    userRole={userRole}
                    onRefresh={handleRefresh}
                    loading={loading}
                />

                <DashboardWidget
                    title='User Engagement'
                    data={[
                        {
                            label: "Avg. Session Duration",
                            value: latestData.userEngagement
                                .averageSessionDuration,
                            trend:
                                latestData.userEngagement
                                    .averageSessionDuration > 3
                                    ? "up"
                                    : "neutral",
                        },
                        {
                            label: "Page Views",
                            value: latestData.userEngagement.pageViews,
                            trend:
                                latestData.userEngagement.pageViews > 150
                                    ? "up"
                                    : "down",
                        },
                        {
                            label: "Bounce Rate",
                            value: latestData.userEngagement.bounceRate * 100,
                            trend:
                                latestData.userEngagement.bounceRate < 0.4
                                    ? "up"
                                    : "down",
                        },
                    ]}
                    type='percentage'
                    userRole={userRole}
                    onRefresh={handleRefresh}
                    loading={loading}
                />

                <DashboardWidget
                    title='Retention Metrics'
                    data={[
                        {
                            label: "Retention Rate",
                            value: latestData.retention * 100,
                            trend: latestData.retention > 0.6 ? "up" : "down",
                        },
                    ]}
                    type='percentage'
                    userRole={userRole}
                    onRefresh={handleRefresh}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Dashboard;
