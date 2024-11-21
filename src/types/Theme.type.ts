import { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface TenantTheme
{
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logo: string;
}

export interface ThemeProviderProps
{
    children: ReactNode;
    defaultTheme?: Theme;
    defaultTenant?: string;
}
