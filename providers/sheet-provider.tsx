"use client";

import { NewListSheet } from "@/features/accounts/components/new-list-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;
    
    return (
        <>
            <NewListSheet />
        </>
    )
}