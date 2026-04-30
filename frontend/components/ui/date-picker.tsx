"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, setDate, placeholder = "Pick a date", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all justify-start text-left font-normal",
            !date && "text-text-muted",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-text-muted" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border-medium bg-surface-2/95 backdrop-blur-xl shadow-2xl rounded-[1.5rem] overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="text-foreground"
        />
      </PopoverContent>
    </Popover>
  )
}
