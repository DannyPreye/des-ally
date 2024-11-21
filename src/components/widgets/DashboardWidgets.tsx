import React, { useState, useCallback } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

type WidgetDataType = {
    label: string;
    value: number | string;
    trend?: "up" | "down" | "neutral";
};

type WidgetProps = {
    title: string;
    data: WidgetDataType[];
    type: "number" | "percentage" | "currency";
    userRole: "admin" | "manager" | "viewer";
    onRefresh?: () => Promise<void>;
    loading?: boolean;
    error?: string;
};

const DashboardWidget: React.FC<WidgetProps> = ({
    title,
    data,
    type,
    userRole,
    onRefresh,
    loading = false,
    error,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (onRefresh && userRole !== "viewer") {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } catch (err) {
                console.error("Refresh failed", err);
            } finally {
                setIsRefreshing(false);
            }
        }
    }, [onRefresh, userRole]);

    const formatValue = useCallback((value: number | string, type: string) => {
        switch (type) {
            case "currency":
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(Number(value));
            case "percentage":
                return `${Number(value).toFixed(1)}%`;
            default:
                return String(value);
        }
    }, []);

    const renderTrendIcon = useCallback((trend?: "up" | "down" | "neutral") => {
        switch (trend) {
            case "up":
                return <span className='text-green-500'>▲</span>;
            case "down":
                return <span className='text-red-500'>▼</span>;
            default:
                return <span className='text-gray-500'>—</span>;
        }
    }, []);

    if (error) {
        return (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-center'>
                <AlertCircle className='mr-2 text-red-500' />
                <span className='text-red-700'>{error}</span>
            </div>
        );
    }

    return (
        <div className='bg-white shadow-md rounded-lg p-4 relative'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
                {onRefresh && userRole !== "viewer" && (
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing || loading}
                        className='text-blue-500 hover:text-blue-700 disabled:opacity-50'
                    >
                        {isRefreshing ? (
                            <Loader2 className='animate-spin' />
                        ) : (
                            "↻"
                        )}
                    </button>
                )}
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-24'>
                    <Loader2 className='animate-spin text-blue-500' size={32} />
                </div>
            ) : (
                <div className='space-y-2'>
                    {data.map(({ label, value, trend }, index) => (
                        <div
                            key={index}
                            className='flex justify-between items-center border-b last:border-b-0 py-2'
                        >
                            <span className='text-gray-600'>{label}</span>
                            <div className='flex items-center'>
                                <span className='font-bold mr-2'>
                                    {formatValue(value, type)}
                                </span>
                                {renderTrendIcon(trend)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardWidget;
