<?php

namespace App\Mail;

use App\Models\Reserva;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservaPendientePago extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reserva $reserva, public string $metodo)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reserva pendiente de pago · Código '.$this->reserva->codigo,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reserva-pendiente-pago',
        );
    }
}
