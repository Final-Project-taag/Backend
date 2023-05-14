# Backend
   
Reservierungs- und Buchungssystem für E-Mobility;

backgroundtasks Ordner: -----backgroundtasks.js:

Die checkExpiredReservations-Funktion wird jede Stunde ausgeführt und aktualisiert den Status aller Fahrzeuge, deren Reservierungen abgelaufen sind. Die Fahrzeuge werden dann als nicht reserviert markiert und das Enddatum der Reservierung wird auf null gesetzt.

Die cron.schedule Funktion läuft einmal täglich um Mitternacht durch. Sie holt alle Reservierungen, filtert die abgelaufenen Reservierungen heraus und löscht sie aus der Datenbank.
