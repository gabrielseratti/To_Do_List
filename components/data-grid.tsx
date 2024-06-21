'use client';

import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { DataCard } from "./data-card";

export const DateGrid = () => {
    const {} = DataCard;

    const params = useSearchParams();
    const to = params.get('to') || undefined;
    const from = params.get('from') || undefined;

    const dateRangeLabel = formatDateRange({ to, from });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title='Restantes'
                // value={data?.remainingAmount}
                // percentageChange={data?.reminingChange}
                icon={FaPiggyBank}
                variant='default'
                dateRange={dateRangeLabel}
            />
        </div>
    )
}