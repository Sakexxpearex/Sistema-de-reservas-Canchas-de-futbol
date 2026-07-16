import { ConfirmationStep } from "@/Components/BookingPage/ConfirmationStep";
import { FormStep } from "@/Components/BookingPage/FormStep";
import { PaymentStep } from "@/Components/BookingPage/PaymentStep";
import { SummaryStep } from "@/Components/BookingPage/SummaryStep";
import { BookingState, FormValues, PayMethod } from "@/types";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";


type FlowStep = "form" | "summary" | "payment" | "confirmed";

const EMPTY_FORM: FormValues = { name: "", email: "", phone: "" };

export default function BookingPage() {
  const [step, setStep] = useState<FlowStep>("form");
  const [booking, setBooking] = useState<BookingState>({ court: null, date: null, slot: null });
  const [formValues, setFormValues] = useState<FormValues>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("visa");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("booking");
    if (!raw) { router.get("/"); return; }
    const { court, date, slot } = JSON.parse(raw);
    setBooking({ court: court ?? null, date: date ? new Date(date) : null, slot: slot ?? null });
  }, []);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("summary");
  }

  function handlePay() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      sessionStorage.removeItem("booking");
      setStep("confirmed");
    }, 2500);
  }

  function handleReset() {
    router.get("/");
  }

  if (step === "form") {
    return (
      <FormStep
        booking={booking}
        formValues={formValues}
        onChange={setFormValues}
        onSubmit={handleFormSubmit}
        onBack={() => router.get("/")}
      />
    );
  }

  if (step === "summary") {
    return (
      <SummaryStep
        booking={booking}
        formValues={formValues}
        onContinue={() => setStep("payment")}
        onBack={() => setStep("form")}
      />
    );
  }

  if (step === "payment") {
    return (
      <PaymentStep
        booking={booking}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        loading={loading}
        onPay={handlePay}
        onBack={() => setStep("summary")}
      />
    );
  }

  return (
    <ConfirmationStep
      booking={booking}
      formValues={formValues}
      onReset={handleReset}
    />
  );
}