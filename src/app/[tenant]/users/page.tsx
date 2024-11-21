"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetUserData } from "@/hooks/useUserData";
import { useParams } from "next/navigation";
import {
    AlertCircle,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { User } from "@/types/User.type";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddUserModal from "./(components)/AddUserDialog";
import { getCookie } from "cookies-next/client";

const UserManagementPage = () => {
    const { tenant } = useParams();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof User | undefined>(undefined);
    const [filterBy, setFilterBy] = useState<string | undefined>(undefined);
    const debounceSearch = useDebounce(search, 500);
    const session = getCookie("session");

    console.log("This is the session", session);

    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: users,
        total,
        pageCount,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetUserData({
        tenantId: tenant as string,
        search: debounceSearch,
        sortBy,
        filterBy,
        page: currentPage,
        limit: 10,
    });

    const handleSort = (column: keyof User) => {
        setSortBy(column === sortBy ? undefined : column);
    };

    const handleFilterChange = (value: string) => {
        setFilterBy(value === "All" ? undefined : value);
    };

    if (isLoading) {
        return (
            <div className='p-6 space-y-4'>
                {[...Array(10)].map((_, index) => (
                    <Skeleton key={index} className='h-12 w-full' />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant='destructive' className='m-6'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error instanceof Error
                        ? error.message
                        : "An unknown error occurred"}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className='p-6 space-y-4 dark:text-primary-foreground'>
            <div className='flex justify-between items-center'>
                <Input
                    placeholder='Search users...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-1/3'
                />

                <Select onValueChange={handleFilterChange}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Filter by Status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>All Statuses</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                    </SelectContent>
                </Select>

                {session?.includes("admin") && (
                    <AddUserModal
                        tenantId={tenant as string}
                        onUserAdded={refetch}
                    />
                )}
            </div>

            {isLoading && <div>Loading...</div>}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            onClick={() => handleSort("name")}
                            className='cursor-pointer '
                        >
                            <div className='flex items-center'>
                                Name
                                <ArrowUpDown className='ml-2 h-4 w-4' />
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort("email")}
                            className='cursor-pointer '
                        >
                            <div className='flex items-center'>
                                Email
                                <ArrowUpDown className='ml-2 h-4 w-4' />
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort("role")}
                            className='cursor-pointer '
                        >
                            <div className='flex items-center'>
                                Role
                                <ArrowUpDown className='ml-2 h-4 w-4' />
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort("status")}
                            className='cursor-pointer '
                        >
                            <div className='flex items-center'>
                                Status
                                <ArrowUpDown className='ml-2 h-4 w-4' />
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => handleSort("createdAt")}
                            className='cursor-pointer '
                        >
                            <div className='flex items-center'>
                                Created At
                                <ArrowUpDown className='ml-2 h-4 w-4' />
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <span
                                    className={`
                    px-2 py-1 rounded-full text-xs
                    ${
                        user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }
                  `}
                                >
                                    {user.status}
                                </span>
                            </TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='flex justify-between items-center'>
                <div>Total Users: {total}</div>
                <div className='flex items-center space-x-2'>
                    <Button
                        size='sm'
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <span>
                        Page {currentPage} of {pageCount}
                    </span>
                    <Button
                        size='sm'
                        onClick={() =>
                            setCurrentPage((p) => Math.min(pageCount, p + 1))
                        }
                        disabled={currentPage === pageCount}
                    >
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;
