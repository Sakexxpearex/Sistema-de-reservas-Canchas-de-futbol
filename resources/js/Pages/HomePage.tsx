import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Navbar } from "@/Components/HomePage/Navbar";
import { HeroSection } from "@/Components/HomePage/HeroSection";
import { DateSelector } from "@/Components/HomePage/DateSelector";
import { CourtCard } from "@/Components/HomePage/CourtCard";
import { BookingSidebar } from "@/Components/HomePage/BookingSidebar";
import { BookingState, TimeSlot, Court } from "@/types";
import { DATES } from "@/data/courts";
import { MobileBookingBar } from "@/Components/HomePage/MobileBookingBar";
import { router } from "@inertiajs/react";

interface HomePageProps {
  courts: Court[];
  fecha: string;
}

export default function HomePage({ courts, fecha }: HomePageProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const match = DATES.find(d => {
      const dYmd = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
      return dYmd === fecha;
    });
    return match || new Date(fecha + "T00:00:00");
  });

  const [booking, setBooking] = useState<BookingState>({ court: null, date: null, slot: null });

  function selectSlot(courtId: string, slot: TimeSlot) {
    const court = courts.find(c => c.id === courtId) ?? null;
    setBooking({ court, date: selectedDate, slot });
  }

  function handleConfirm() {
    if (!booking.court || !booking.slot) return;
    sessionStorage.setItem("booking", JSON.stringify({
      court: booking.court,
      date: booking.date?.toISOString(),
      slot: booking.slot,
    }));
    router.get("/booking")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar onGoAdmin={() => router.get("/login")} />

      <div className="pt-[72px]">
        <HeroSection />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            <div className="lg:col-span-2 mb-4">
              <DateSelector
                dates={DATES}
                selectedDate={selectedDate}
                onSelect={date => {
                  setSelectedDate(date);
                  setBooking(b => ({ ...b, date, slot: null }));
                  const dYmd = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
                  router.get(`/canchas/${dYmd}`, {}, { preserveState: true, preserveScroll: true });
                }}
              />
            </div>

            <div className="space-y-6">
              {courts.map(court => (
                <CourtCard
                  key={court.id}
                  court={court}
                  selectedSlot={booking.court?.id === court.id ? (booking.slot ?? null) : null}
                  onSlotSelect={(slot) => selectSlot(court.id, slot)}
                />
              ))}
            </div>

            <div className="hidden lg:block">
              <BookingSidebar booking={booking} onContinue={handleConfirm} />
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {booking.court && booking.slot && (
          <MobileBookingBar booking={booking} onContinue={handleConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}
