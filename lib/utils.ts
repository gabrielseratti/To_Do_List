import { type ClassValue, clsx } from "clsx"
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
}
export function formatDateRange (period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, 'dd LLL')} - ${format(defaultTo, 'dd LLL, y')}`;
  }

  if (period.to) {
    return `${format(period.from, 'dd LLL')} - ${format(period.to, 'dd LLL, y')}`;
  }

  return format(period.from, 'dd LLL, y')
};

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean} = {
    addPrefix: false,
  },
) {
  const result = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
  }).format(value/100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}

