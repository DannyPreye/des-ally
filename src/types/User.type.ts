export interface User
{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}
export interface ThemeColor
{
    name: string;
    primary: string;
    secondary: string;
}

export interface Tenant
{
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    theme: string;
}

export interface TenantConfiguration
{
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logo: string;
}



