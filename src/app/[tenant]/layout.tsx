"use client";

import React, { useEffect } from "react";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { logout } from "../(auth)/actions/login";

import { getCookie } from "cookies-next/client";
import { useTheme } from "next-themes";
import { getTenantPreferences } from "@/lib/helpers/functions";

interface Props {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
    const tenantId = getCookie("tenantId");
    const session = getCookie("session");
    const { setTheme } = useTheme();

    const [tenantData, setTenantData] = React.useState<
        | {
              name: string;
              primaryColor: string;
              secondaryColor: string;
              logo: string;
              theme: string;
          }
        | undefined
    >();

    useEffect(() => {
        if (tenantData) {
            console.log(tenantData, "tenant data----------");
            setTheme(tenantData.theme);
            document.documentElement.style.setProperty(
                "--primary",
                tenantData.primaryColor
            );
            document.documentElement.style.setProperty(
                "--secondary",
                tenantData.secondaryColor
            );
        }
    }, [tenantData]);

    useEffect(() => {
        if (tenantId) {
            setTenantData(getTenantPreferences(tenantId));
        }
    }, [tenantId]);

    console.log("tenant data", tenantData);

    let navs = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: `/${tenantId}/dashboard`,
        },
    ];

    // Add navigation based on session type
    if (session?.includes("admin")) {
        navs = [
            ...navs,
            {
                name: "Users",
                icon: Users,
                href: `/${tenantId}/users`,
            },
            {
                name: "Settings",
                icon: Settings,
                href: `/${tenantId}/settings`,
            },
        ];
    } else if (session?.includes("manager")) {
        navs = [
            ...navs,
            {
                name: "Users",
                icon: Users,
                href: `/${tenantId}/users`,
            },
        ];
    }
    return (
        <div className='flex min-h-screen'>
            {/* Sidebar */}
            <div className='w-64 p-4 bg-secondary sticky left-0 top-0'>
                <div className='mb-10 flex items-center gap-3 pl-4 text-xl font-bold'>
                    <div className='h-10 flex-shrink-0 bg-primary w-10 rounded-full overflow-hidden flex items-center justify-center'>
                        <Image
                            src={tenantData?.logo as string}
                            width={50}
                            height={50}
                            alt='Tenant Logo'
                            className='w-full h-full  object-cover'
                        />
                    </div>
                    {tenantData?.name}
                </div>

                <nav className='space-y-2'>
                    {navs.map((nav) => (
                        <Link
                            key={nav.name}
                            href={nav.href}
                            className='flex items-center p-3 rounded cursor-pointer hover:bg-opacity-10 hover:bg-white'
                        >
                            <nav.icon className='mr-3' />
                            <span>{nav.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className='flex-grow bg-gray-100'>
                {/* Top Bar */}
                <div className='h-16 bg-white border-b flex items-center px-6 justify-between'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-64 p-2 border rounded'
                    />
                    <div className='flex items-center space-x-4'>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                </div>

                <div className='p-6'>{children}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;
