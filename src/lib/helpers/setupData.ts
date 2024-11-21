import { generateUsers } from "./functions";

// Tenants
export const tenantsData: Record<string, { name: string; primaryColor: string; secondaryColor: string; logo: string; theme: string; }> = {
    'company1': {
        name: 'Tech Innovations Inc',
        primaryColor: '220, 15%, 23%',
        secondaryColor: '42, 91%, 65%',
        logo: "https://via.placeholder.com/500?text=TechIn",
        theme: "light"
    },
    'company2': {
        name: 'Global Solutions LLC',
        primaryColor: '220 20% 12%',
        secondaryColor: '0 78% 60%',
        logo: "https://via.placeholder.com/00?text=GlobalSol",
        theme: "dark"
    },
    "defaultTheme": {
        name: "Default",
        primaryColor: "0 0% 0%",
        secondaryColor: "200, 100%, 80%",
        logo: "https://via.placeholder.com/00?text=Default",
        theme: "light"
    }
};




// Users

export function initializeDummyData()
{


    localStorage.setItem('tenants', JSON.stringify(tenantsData));
    localStorage.setItem('company1Users', JSON.stringify(generateUsers("company1", 100)));
    localStorage.setItem('company2Users', JSON.stringify(generateUsers("company3", 100)));
    // localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
}


export function setupLocalStorageData()
{

    if (!localStorage.getItem('tenants')) {
        initializeDummyData();
    }
}
