import { User } from "@/types/User.type";
import { useQuery } from "@tanstack/react-query";

interface UseDashboardDataOptions {
    filterBy?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    search?: string;
    tenantId: string;
}

export function useGetUserData({
    filterBy,
    sortBy,
    page = 1,
    limit = 10,
    search = "",
    tenantId,
}: UseDashboardDataOptions) {
    const fetchUserData = (): User[] => {
        const userData: User[] = JSON.parse(
            localStorage.getItem(`${tenantId}Users`) || "[]"
        );

        if (!userData.length) return [];

        // Filter by field
        let filteredUsers = userData;
        if (filterBy) {
            filteredUsers = filteredUsers.filter((user: any) =>
                String(user[filterBy])
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Search by name or email
        if (search) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort by field
        if (sortBy) {
            filteredUsers.sort((a: any, b: any) => {
                const aValue = String(a[sortBy]).toLowerCase();
                const bValue = String(b[sortBy]).toLowerCase();
                return aValue.localeCompare(bValue);
            });
        }

        // Paginate results
        const startIndex = (page - 1) * limit;
        const paginatedUsers = filteredUsers.slice(
            startIndex,
            startIndex + limit
        );

        console.log("paginated", paginatedUsers);

        return paginatedUsers;
    };

    const query = useQuery<User[]>({
        queryKey: ["users", sortBy, filterBy, page, limit, search],
        queryFn: fetchUserData,
        refetchOnWindowFocus: false,
    });

    return {
        ...query,
        total: JSON.parse(localStorage.getItem(`${tenantId}Users`) || "[]")
            .length,
        pageCount: Math.ceil(
            JSON.parse(localStorage.getItem(`${tenantId}Users`) || "[]")
                .length / limit
        ),
    };
}
