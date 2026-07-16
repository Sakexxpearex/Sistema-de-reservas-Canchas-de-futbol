import { useRef } from "react";
import { motion } from "motion/react";
import { DAY_NAMES } from "@/data/courts";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const TODAY = new Date();

export function DateSelector({ dates, selectedDate, onSelect }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto pt-3 pb-3 px-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
        {dates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === TODAY.toDateString();

          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(date)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 w-[60px] py-3.5 px-2 rounded-2xl border-2 transition-all duration-200
                ${isSelected
                  ? "bg-[#16A34A] border-[#16A34A] text-white shadow-lg shadow-green-500/30"
                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#16A34A]/40 hover:shadow-sm"
                }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-green-100" : "text-[#64748B]"}`}>
                {DAY_NAMES[date.getDay()]}
              </span>
              <span className={`text-[22px] font-extrabold leading-tight ${isSelected ? "text-white" : "text-[#0F172A]"}`}>
                {date.getDate()}
              </span>
              <span className={`text-[9px] font-bold leading-none ${isSelected ? "text-green-100" : isToday ? "text-[#16A34A]" : "text-transparent"}`}>
                {isToday ? "HOY" : "·"}
              </span>
            </motion.button>
          );
        })}
    </div>
  );
}
