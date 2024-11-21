export interface AnalyticsMetrics
{
    dailyActiveUsers: number;
    newUserSignups: number;
    revenue: number;
    userEngagement: {
        averageSessionDuration: number;
        pageViews: number;
        bounceRate: number;
    };
    retention: number;
}

export interface DailyAnalytics
{
    date: string;
    metrics: AnalyticsMetrics;
}
