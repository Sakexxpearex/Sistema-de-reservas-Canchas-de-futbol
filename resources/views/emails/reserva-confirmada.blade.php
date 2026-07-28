@php
    $cancha = $reserva->cancha;
    $fechaLarga = \Illuminate\Support\Str::ucfirst(
        $reserva->fecha->locale('es')->isoFormat('dddd D [de] MMMM [de] YYYY')
    );
    $horario = substr($reserva->hora_inicio, 0, 5).' - '.substr($reserva->hora_fin, 0, 5);
    $precio = '$'.number_format((float) $cancha->precio_hora, 0, ',', '.');
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reserva confirmada</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border:1px solid #E2E8F0; border-radius:16px; overflow:hidden;">

                    <tr>
                        <td style="background-color:#F0FDF4; border-bottom:1px solid #BBF7D0; padding:32px 24px; text-align:center;">
                            <p style="margin:0 0 12px; font-size:22px; font-weight:800; color:#0F172A;">
                                ⚽ Cancha<span style="color:#16A34A;">Ya</span>
                            </p>
                            <h1 style="margin:0 0 8px; font-size:24px; font-weight:800; color:#0F172A;">¡Reserva confirmada!</h1>
                            <p style="margin:0; font-size:14px; color:#64748B;">
                                Hola {{ $reserva->cliente_nombre }}, tu cancha ya está reservada.
                            </p>

                            <div style="margin-top:20px; display:inline-block; background-color:#ffffff; border:1px solid #BBF7D0; border-radius:12px; padding:12px 24px;">
                                <p style="margin:0 0 2px; font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:1.5px;">Código de reserva</p>
                                <p style="margin:0; font-size:20px; font-weight:800; color:#16A34A; letter-spacing:2px;">{{ $reserva->codigo }}</p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:24px;">
                            <p style="margin:0 0 12px; font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:1.5px;">Detalles de la reserva</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                                @foreach ([
                                    'Cancha' => $cancha->nombre,
                                    'Ubicación' => $cancha->location,
                                    'Fecha' => $fechaLarga,
                                    'Horario' => $horario,
                                    'Total pagado' => $precio,
                                ] as $etiqueta => $valor)
                                    <tr>
                                        <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#64748B;">{{ $etiqueta }}</td>
                                        <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; font-weight:600; text-align:right;">{{ $valor }}</td>
                                    </tr>
                                @endforeach
                            </table>

                            <p style="margin:24px 0 12px; font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:1.5px;">Datos de contacto</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                                @foreach ([
                                    'Nombre' => $reserva->cliente_nombre,
                                    'Correo' => $reserva->cliente_email,
                                    'Teléfono' => $reserva->cliente_telefono,
                                ] as $etiqueta => $valor)
                                    <tr>
                                        <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#64748B;">{{ $etiqueta }}</td>
                                        <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; font-weight:600; text-align:right;">{{ $valor }}</td>
                                    </tr>
                                @endforeach
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px; background-color:#FFFBEB; border:1px solid #FDE68A; border-radius:12px;">
                                <tr>
                                    <td style="padding:16px; text-align:center; font-size:12px; font-weight:600; color:#92400E;">
                                        Preséntate 10 minutos antes · Cancela hasta 2 horas antes sin costo
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#F8FAFC; border-top:1px solid #E2E8F0; padding:20px 24px; text-align:center;">
                            <p style="margin:0; font-size:12px; color:#94A3B8;">
                                Presentá este código al llegar a la cancha.<br>
                                Este es un correo automático, no respondas a este mensaje.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
