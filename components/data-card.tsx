import { IconType } from "react-icons";
import { cn, formatPercentage } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CountUp } from "./count-up";

const boxVariant = cva(
    'rounded-md p-3',
    {
        variants: {
            variant: {
                default: 'bg-blue-500/20',
                success: 'bg-emerald-500/20',
                danger: 'bg-rose-500/20',
                warning: 'bg-yellow-500/20',
            }
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const iconVariant = cva(
    'size-6',
    {
        variants: {
            variant: {
                default: 'fill-blue-500',
                success: 'fill-emerald-500',
                danger: 'fill-rose-500',
                warning: 'fill-yellow-500',
            }
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

type boxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends boxVariants, IconVariants {
    icon: IconType;
    title: string;
    value?: number;
    dateRange: string;
    percentageChange?: number; 
}


export const DataCard = ({
    icon: Icon,
    title,
    value = 0,
    variant,
    dateRange,
    percentageChange = 0,
}: DataCardProps) => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl line-clamp-1"> 
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                        {dateRange}
                    </CardDescription>
                </div>
                <div className={cn(
                    'shrink-0',
                    boxVariant({ variant }),
                )}>
                    <Icon className={cn(iconVariant({ variant }))}/>
                </div>
            </CardHeader>
            <CardContent>
                <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
                    <CountUp 
                        preserveValue
                        start={0}
                        end={value}
                        decimal={2}
                        decimalPlaces={2} 
                    />
                </h1>
                <p className={cn(
                    'text-muted-foreground text-sm line-clamp-1',
                    percentageChange > 0 && 'text-emerald-500',
                    percentageChange < 0 && 'text-rose-500',
                )}>
                    {formatPercentage(percentageChange)} do último período
                </p>
            </CardContent>
        </Card>
    );
};