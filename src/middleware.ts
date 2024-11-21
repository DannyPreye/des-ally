import { NextRequest, NextResponse } from 'next/server';
import { tenantsData } from './lib/helpers/setupData';



const USER_ROLES: Record<string, { role: string, tenantId: string; }> = {
    'admin@example.com': {
        role: 'admin',
        tenantId: 'company1'
    },
    'admin2@example.com': {
        role: 'admin',
        tenantId: 'company2'
    },
    'manager@example.com': {
        role: 'manager',
        tenantId: 'company1'
    },
    'manager2@example.com': {
        role: 'manager',
        tenantId: 'company2'
    },
    'viewer@example.com': {
        role: 'viewer',
        tenantId: 'company1'
    },
    'viewer2@example.com': {
        role: 'viewer',
        tenantId: 'company2'
    },

};

const ROUTE_PERMISSIONS: Record<string, string[]> = {
    '/dashboard': [ 'admin', 'manager', 'viewer' ],
    '/settings': [ 'admin' ],
    '/users': [ 'admin', 'manager' ]
};

export function middleware(request: NextRequest)
{
    const { pathname } = request.nextUrl;
    const segments = pathname.split('/').filter(Boolean);
    const tenantId = segments[ 0 ];



    if (!pathname.includes("/login")) {

        if (!tenantsData[ tenantId ]) {
            // if the tenantId does not match any company
            return NextResponse.redirect(new URL('/login', request.url));
        }


        const sessionToken = request.cookies.get('session')?.value;


        const userData = sessionToken ? getUserFromToken(sessionToken) : null;

        if (!userData) {
            //    redirect back to the login. they're not registered
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (userData.tenantId !== tenantId) {
            //    if the user is trying to access a tenant they not members of
            // it will redirect back to the home page
            return NextResponse.redirect(new URL('/login', request.url));
        }


        const currentRoute = `/${segments.slice(1).join('/')}`;
        const allowedRoles = ROUTE_PERMISSIONS[ currentRoute ] || [];

        if (!allowedRoles.includes(userData.role)) {
            // redirect them back to the homepage if they don't have authorized access
            // to the page
            return NextResponse.redirect(new URL(`/${tenantId}/dashboard`, request.url));
        }

        return NextResponse.next();
    }
}

function getUserFromToken(token?: string)
{
    // This function is simulating token validation.
    if (!token) return null;

    const userRoleMap: Record<string, { role: string, tenantId: string; }> = {
        'admin-token': USER_ROLES[ 'admin@example.com' ],
        'manager-token': USER_ROLES[ 'manager@example.com' ],
        'viewer-token': USER_ROLES[ 'viewer@example.com' ],
        'admin2-token': USER_ROLES[ 'admin2@example.com' ],
        'manager2-token': USER_ROLES[ 'manager2@example.com' ],
        'viewer2-token': USER_ROLES[ 'viewer2@example.com' ]
    };

    console.log(userRoleMap[ token ]);

    return userRoleMap[ token ] || null;
}

export const config = {

    matcher: [ '/((?!api|_next/static|_next/image|favicon.ico).*)', '/' ]
};
