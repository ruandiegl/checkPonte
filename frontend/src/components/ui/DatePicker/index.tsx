import * as PopoverPrimitive from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CalendarGrid,
  CalendarHeader,
  CalendarPanel,
  DateButton,
  DayButton,
  MonthButton,
  Weekday,
} from './styles';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function parseDate(value: string) {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toInputDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatLabel(value: string) {
  if (!value) return 'Selecione a data';
  return parseDate(value).toLocaleDateString('pt-BR');
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

const DatePicker = ({ value, onChange, ariaLabel }: DatePickerProps) => {
  const selectedDate = useMemo(() => parseDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const handleSelect = (date: Date) => {
    onChange(toInputDate(date));
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <DateButton type="button" aria-label={ariaLabel}>
          <span>{formatLabel(value)}</span>
          <CalendarDays size={16} />
        </DateButton>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <CalendarPanel sideOffset={6} align="start">
          <CalendarHeader>
            <MonthButton type="button" onClick={() => moveMonth(-1)} aria-label="Mês anterior">
              <ChevronLeft size={16} />
            </MonthButton>
            <strong>
              {visibleMonth.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </strong>
            <MonthButton type="button" onClick={() => moveMonth(1)} aria-label="Próximo mês">
              <ChevronRight size={16} />
            </MonthButton>
          </CalendarHeader>

          <CalendarGrid>
            {weekdays.map((weekday, index) => (
              <Weekday key={`${weekday}-${index}`}>{weekday}</Weekday>
            ))}
            {days.map((date) => {
              const dateValue = toInputDate(date);
              const isSelected = dateValue === value;
              const isOutside = date.getMonth() !== visibleMonth.getMonth();

              return (
                <DayButton
                  key={dateValue}
                  type="button"
                  $selected={isSelected}
                  $outside={isOutside}
                  onClick={() => handleSelect(date)}
                >
                  {date.getDate()}
                </DayButton>
              );
            })}
          </CalendarGrid>
        </CalendarPanel>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default DatePicker;
