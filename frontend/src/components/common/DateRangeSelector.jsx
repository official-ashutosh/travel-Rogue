import React, { useState } from 'react';
import { Button } from "../ui/Button.jsx";
import { Calendar } from "../ui/calendar.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover.jsx";
import { useIsMobile } from "../../hooks/useMobile.js";
import { cn, getFormattedDateRange } from "../../lib/utils.js";
import { CalendarIcon } from "lucide-react";

const DateRangeSelector = ({ 
  value,
  onChange, 
  forGeneratePlan,
  className = '', 
  isLoading,
}) => {
  const [dateRangePopoverOpen, setDateRangePopoverOpen] = useState(false);
  const isMobile = useIsMobile();
  const resetControl = () => {
    onChange({ from: undefined, to: undefined });
  };

  return (
    <Popover open={dateRangePopoverOpen} onOpenChange={setDateRangePopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size={forGeneratePlan ? "default" : "sm"}
          variant={forGeneratePlan ? "outline" : "link"}
          className={cn(
            {
              "pl-3 flex justify-between text-left font-normal": forGeneratePlan,
              "text-muted-foreground": !value,
            },
            className
          )}
          disabled={!forGeneratePlan && isLoading}
        >
          {forGeneratePlan &&
            (value && value.from && value.to ? (
              <span>{getFormattedDateRange(value.from, value.to)}</span>
            ) : (
              <span className="text-muted-foreground">Pick Travel Dates</span>
            ))}
          <CalendarIcon className={cn("h-4 w-4 text-foreground")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 touch-pan-y"
        align={isMobile ? "center" : "start"}
        side={isMobile ? "bottom" : undefined}
        collisionPadding={16}
      >
        <Calendar
          month={value?.from}
          mode="range"
          numberOfMonths={isMobile ? 1 : 2}
          max={10}
          selected={value}
          onSelect={(e) => {
            onChange(e);
            if (!isMobile && e?.from && e.to) {
              setDateRangePopoverOpen(false);
            }
          }}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus={!isMobile}
          classNames={{
            day: "h-10 w-10 text-sm",
            cell: "py-1 px-0.5",
          }}
        />
        <div className="w-full flex justify-end pr-5 pb-3 gap-2">
          <Button
            onClick={resetControl}
            variant="ghost"
            size={isMobile ? "sm" : "default"}
          >
            Reset
          </Button>
          {isMobile && (
            <Button onClick={() => setDateRangePopoverOpen(false)} size="sm">
              Close
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
