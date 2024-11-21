"use client";
import React, { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/toaster";
import { setupLocalStorageData } from "@/lib/helpers/setupData";

import { ThemeProvider } from "./theme-provider";

const client = new QueryClient();

interface Props {
    children: ReactNode;
}
const MainProvider: React.FC<Props> = ({ children }) => {
    useEffect(() => {
        // initialize the data to the local storage
        setupLocalStorageData();
    }, []);

    return (
        <>
            <QueryClientProvider client={client}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>

                <Toaster />
            </QueryClientProvider>
        </>
    );
};

export default MainProvider;
