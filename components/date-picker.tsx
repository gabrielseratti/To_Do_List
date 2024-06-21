import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';


type Props = {
    value?: Date | null;  
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
};

export const DatePicker = ({
    value,
    onChange,
    disabled,
}: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                    )}
                > 
                    <CalendarIcon className='size-4 mr-2' />
                    {value ? format(value, 'PPP') : <span>Escolha uma data</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start">   
                <Calendar   
                    mode="single"
                    selected={value ?? undefined} 
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus 
                /> 
            </PopoverContent>
        </Popover>
    );
};
