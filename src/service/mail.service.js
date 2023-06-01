import mail from "@sendgrid/mail";

// Funktion zum initialen Einrichten des Mail Clients
export function initSgMail() {
    // Setze den API Key von SendGrid fuer den MailClient
    mail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Service Funktion zum Erstellen und Versenden der Verifikationsmail
export async function sendVerificationMail(recipient, mailHash) {
    // Erstelle Mail mit Link zur Verifikationsroute
    const msg = {
        to: recipient,
        from: 'engie4379@gmail.com', // Use the email address or domain you verified above
        subject: 'E-Mail verification for CarWheels-API',
        html: `Please verify your e-mail by following <a href="http://localhost:5173/verify?t=${mailHash}" target="_blank" >CLICK THIS</a> link.`,
    };

    // Sende Mail ab
    try {
        return await mail.send(msg);

    } catch (error) {
        throw error;
    }
}