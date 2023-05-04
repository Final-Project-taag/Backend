# Backend

Reservierungs- und Buchungssystem 
für e-Roller, e-Fahrräder und E-Autos:

    Benutzer-Authentifizierung und -Verwaltung:
        POST /api/auth/register: Benutzerregistrierung
        POST /api/auth/login: Benutzeranmeldung
        POST /api/auth/logout: Benutzerabmeldung
        GET /api/users/me: Benutzerprofilinformationen abrufen

    Fahrzeuge:
        GET /api/vehicles: Liste aller verfügbaren Fahrzeuge (e-Roller, e-Fahrräder, E-Autos) abrufen
        GET /api/vehicles/:id: Informationen zu einem bestimmten Fahrzeug abrufen
        POST /api/vehicles: Neues Fahrzeug hinzufügen (nur für Admins)
        PUT /api/vehicles/:id: Fahrzeuginformationen aktualisieren (nur für Admins)
        DELETE /api/vehicles/:id: Fahrzeug löschen (nur für Admins)

    Reservierungen:
        GET /api/reservations: Liste aller Reservierungen für den aktuellen Benutzer abrufen
        POST /api/reservations: Neue Reservierung erstellen
        GET /api/reservations/:id: Informationen zu einer bestimmten Reservierung abrufen
        PUT /api/reservations/:id: Reservierungsinformationen aktualisieren (z.B. Zeitfenster ändern)
        DELETE /api/reservations/:id: Reservierung stornieren

    Buchungen:
        GET /api/bookings: Liste aller Buchungen für den aktuellen Benutzer abrufen
        POST /api/bookings: Neue Buchung erstellen
        GET /api/bookings/:id: Informationen zu einer bestimmten Buchung abrufen
        PUT /api/bookings/:id: Buchungsinformationen aktualisieren (z.B. Zeitfenster ändern)
        DELETE /api/bookings/:id: Buchung stornieren

    Zahlungen:
        POST /api/payments: Zahlungsinformationen für eine Buchung verarbeiten

    Standorte:
        GET /api/locations: Liste aller Standorte abrufen, an denen Fahrzeuge verfügbar sind
        GET /api/locations/:id: Informationen zu einem bestimmten Standort abrufen
        POST /api/locations: Neuen Standort hinzufügen (nur für Admins)
        PUT /api/locations/:id: Standortinformationen aktualisieren (nur für Admins)
        DELETE /api/locations/:id: Standort löschen (nur für Admins)

Infos Zur Mollie:

const payment = await mollieClient.payments.get('tr_8WhJKGmgBy');
// Check payment.status.

// Retrieve the first 15 payments.
const payments = mollieClient.payments.page({ limit: 15 });
// payments.nextPageCursor is the cursor: the ID of the first payment on the next page.

// Retrieve the second 15 payments (using the cursor from the previous page).
const payments = mollieClient.payments.page({ limit: 15, from: 'tr_8WhJKGmgBy' });

// Iterate over all payments.
for await (let payment in mollieClient.payments.iterate()) {
    // (Use break to end the loop prematurely.)
  }

