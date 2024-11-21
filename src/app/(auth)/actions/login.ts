"user server";
import { deleteCookie, setCookie } from "cookies-next";
import { redirect } from "next/navigation";


export const USER_CREDENTIALS: Record<string, { password: string, token: string, tenantId: string; }> = {
    'admin@example.com': {
        password: 'Admin123!',
        token: 'admin-token',
        tenantId: 'company1',
    },
    'admin2@example.com': {
        password: 'Admin123!',
        token: 'admin2-token',
        tenantId: 'company2',
    },
    'viewer@example.com': {
        password: 'Viewer123!',
        token: 'viewer-token',
        tenantId: 'company1'
    },
    'viewer2@example.com': {
        password: 'Viewer123!',
        token: 'viewer2-token',
        tenantId: 'company2'
    },
    'manager@example.com': {
        password: 'Manager123!',
        token: 'manager-token',
        tenantId: 'company1'
    },
    'manager2@example.com': {
        password: 'Manager123!',
        token: 'manager2-token',
        tenantId: 'company2'
    }

};

export const login = async (credentials: { email: string, password: string; }) =>
{
    const { email, password } = credentials;

    const userCred = USER_CREDENTIALS[ email ];

    if (!userCred || userCred.password !== password) {
        throw new Error('Invalid credentials');
    }

    // save data to the cookie

    setCookie("session", userCred.token);
    setCookie("tenantId", userCred.tenantId);


    console.log("from action", userCred.tenantId);

    return userCred.tenantId;

};


export const logout = async () =>
{
    deleteCookie("session");
    deleteCookie("tenantId");

    redirect("/login");
};



