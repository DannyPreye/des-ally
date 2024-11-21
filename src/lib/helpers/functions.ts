import { DailyAnalytics } from "@/types/Analytics.type";

export function generateUsers(tenantId: string, count: number)
{
    const roles = [ "admin", "manager", "viewer" ];
    const statuses = [ "active", "inactive", "pending" ];
    const users = [];

    for (let i = 1; i <= count; i++) {
        users.push({
            id: `${tenantId}_user${i}`,
            name: `User ${i} Tenant ${tenantId}`,
            email: `user${i}@${tenantId}.com`,
            role: roles[ Math.floor(Math.random() * roles.length) ],
            status: statuses[ Math.floor(Math.random() * statuses.length) ],
            tenantId: tenantId,
            createdAt: new Date(
                Date.now() - Math.random() * 31536000000 // Random date in the past year
            ).toISOString().split("T")[ 0 ], // Format as YYYY-MM-DD
        });
    }

    return users;
}


export function getTenantPreferences(tenantId: string)
{
    const tenants = JSON.parse(localStorage.getItem("tenants") || `{}`);
    if (tenants) {
        return tenants[ tenantId as string ];
    }
};


export function hexToHSL(hex: string)
{
    // Remove the hash sign if present
    hex = hex.replace("#", "");

    // Convert hex to RGB first
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the minimum and maximum values of R, G, and B
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate lightness
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;

        // Calculate saturation
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Calculate hue
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
    )}%`;
};




export function generateAnalyticsData(tenantId: string, days: number = 30): DailyAnalytics[]
{
    const baseMetrics: any = {
        'company1': {
            baseActiveUsers: 100,
            baseRevenue: 50000,
            baseEngagement: 0.6
        },
        'company2': {
            baseActiveUsers: 75,
            baseRevenue: 35000,
            baseEngagement: 0.5
        }
    };

    const tenantConfig = baseMetrics[ tenantId ] || baseMetrics[ 'company1' ];

    return Array.from({ length: days }, (_, index) =>
    {
        const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[ 0 ];

        // Simulate natural fluctuations with some randomness
        const dailyActiveUsers = Math.max(10, Math.round(
            tenantConfig.baseActiveUsers +
            Math.sin(index * 0.5) * 20 +
            (Math.random() - 0.5) * 15
        ));

        const newUserSignups = Math.max(2, Math.round(
            dailyActiveUsers * 0.1 +
            Math.sin(index * 0.3) * 5
        ));

        const revenue = Math.round(
            tenantConfig.baseRevenue +
            Math.sin(index * 0.4) * 5000 +
            (Math.random() - 0.5) * 2000
        );

        const userEngagement = {
            averageSessionDuration: Number((Math.max(1, 3 + Math.sin(index * 0.2) * 1.5)).toFixed(2)),
            pageViews: Math.round(dailyActiveUsers * (1.5 + Math.sin(index * 0.3) * 0.5)),
            bounceRate: Number((0.4 + Math.sin(index * 0.1) * 0.15).toFixed(2))
        };

        const retention = Number((
            tenantConfig.baseEngagement +
            Math.sin(index * 0.2) * 0.2
        ).toFixed(2));

        return {
            date,
            metrics: {
                dailyActiveUsers,
                newUserSignups,
                revenue,
                userEngagement,
                retention
            }
        };
    }).reverse(); // Most recent dates first
}


export function setupAnalyticsData()
{
    const tenants = [ 'company1', 'company2' ];

    tenants.forEach(tenantId =>
    {
        const analyticsData = generateAnalyticsData(tenantId);
        localStorage.setItem(`${tenantId}_analytics`, JSON.stringify(analyticsData));
    });
}

// Function to retrieve analytics for a specific tenant
export function getAnalyticsForTenant(tenantId: string, days: number = 30)
{
    const storedAnalytics = localStorage.getItem(`${tenantId}_analytics`);

    if (storedAnalytics) {
        const parsedAnalytics: DailyAnalytics[] = JSON.parse(storedAnalytics);
        return parsedAnalytics.slice(0, days);
    }

    return generateAnalyticsData(tenantId, days);
}


export function simulateRealtimeUpdate(tenantId: string)
{
    const currentAnalytics = getAnalyticsForTenant(tenantId, 1)[ 0 ];

    // Simulate a small real-time change
    const updatedMetrics = {
        ...currentAnalytics.metrics,
        dailyActiveUsers: currentAnalytics.metrics.dailyActiveUsers + Math.floor(Math.random() * 5),
        revenue: currentAnalytics.metrics.revenue + Math.floor(Math.random() * 500)
    };

    return {
        ...currentAnalytics,
        metrics: updatedMetrics
    };
}

