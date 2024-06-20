"use client";

import { NewListSheet } from "@/features/lists/components/new-list-sheet";
import { EditListSheet } from "@/features/lists/components/edit-list-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;
    
    return (
        <>
            <NewListSheet />
            <EditListSheet />
        </>
    )
}