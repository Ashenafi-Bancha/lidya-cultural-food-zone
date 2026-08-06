import { logger } from '../utils/logger';
import { env } from '../config/env';
import { brandedEmail } from './email.templates';

// Email Notification using Resend
class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = env.RESEND_API_KEY || '';
    this.fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.apiKey) {
      logger.warn('[NOTIFICATION] Resend API key not configured. Email not sent.');
      logger.info(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
      return false;
    }

    try {
      const { Resend } = await import('resend');
      const resend = new Resend(this.apiKey);
      // Include a friendly sender name unless one is already provided.
      const from = this.fromEmail.includes('<')
        ? this.fromEmail
        : `Lidya Cultural Food Zone <${this.fromEmail}>`;
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        logger.error(`[EMAIL ERROR] Failed to send email: ${error.message}`);
        return false;
      }

      logger.info(`[EMAIL SENT] To: ${to}, ID: ${data?.id}`);
      return true;
    } catch (error: any) {
      logger.error(`[EMAIL ERROR] Exception: ${error.message}`);
      return false;
    }
  }
}

// SMS Notification using Twilio
class SmsService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = env.TWILIO_ACCOUNT_SID || '';
    this.authToken = env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      logger.warn('[NOTIFICATION] Twilio credentials not configured. SMS not sent.');
      logger.info(`[SMS MOCK] To: ${to}, Message: ${message}`);
      return false;
    }

    try {
      const twilio = await import('twilio');
      const client = twilio.default(this.accountSid, this.authToken);

      const formattedTo = to.startsWith('+') ? to : `+251${to.replace(/^0/, '')}`;

      const result = await client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedTo,
      });

      logger.info(`[SMS SENT] To: ${formattedTo}, SID: ${result.sid}`);
      return true;
    } catch (error: any) {
      logger.error(`[SMS ERROR] Exception: ${error.message}`);
      return false;
    }
  }
}

// Interface for reservation details
export interface ReservationDetails {
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  partySize: number;
  branchName?: string;
  specialRequest?: string;
}

export interface EventBookingDetails {
  customerName: string;
  phone: string;
  email?: string;
  serviceType: string;
  eventDate: string;
  guestCount?: number;
  branchName?: string;
  message?: string;
}

// Human-readable labels for the EventType enum, used in emails/SMS.
const SERVICE_LABELS: Record<string, string> = {
  WEDDING: 'Wedding',
  ENGAGEMENT: 'Engagement / Melse',
  HALL_RENTAL: 'Event Hall Rental',
  CATERING: 'Full-Service Catering',
  CORPORATE: 'Corporate Event',
  BIRTHDAY: 'Birthday / Milestone',
  VIP: 'VIP Experience',
  VVIP: 'VVIP Experience',
  OTHER: 'Other',
};
const serviceLabel = (t: string) => SERVICE_LABELS[t] || t;

export class NotificationService {
  private emailService: EmailService;
  private smsService: SmsService;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SmsService();
  }

  async notifyManagerNewReservation(reservationDetails: ReservationDetails): Promise<void> {
    const managerEmail = env.MANAGER_EMAIL || 'ashenafibanchabassa01@gmail.com';
    const managerPhone = env.MANAGER_PHONE || '';

    const subject = `🔔 New Reservation at Lidya Cultural Food Zone`;
    const html = brandedEmail({
      preheader: `${reservationDetails.customerName} · ${reservationDetails.partySize} guests · ${reservationDetails.date}`,
      heading: 'New Reservation Request',
      accent: '#c25e2a',
      paragraphs: ['A new table reservation has been requested. Review the details below and confirm or decline it from the dashboard.'],
      details: [
        { label: 'Customer', value: reservationDetails.customerName },
        { label: 'Phone', value: reservationDetails.phone },
        { label: 'Email', value: reservationDetails.email },
        { label: 'Date', value: reservationDetails.date },
        { label: 'Time', value: reservationDetails.time },
        { label: 'Party Size', value: String(reservationDetails.partySize) },
        { label: 'Branch', value: reservationDetails.branchName },
        { label: 'Special Request', value: reservationDetails.specialRequest },
      ],
      button: { label: 'Open Admin Dashboard', url: `${env.FRONTEND_URL || ''}/admin` },
    });

    // Send email notification to manager
    await this.emailService.sendEmail(managerEmail, subject, html);

    // Send SMS notification to manager if phone is configured
    if (managerPhone) {
      const smsMessage = `🔔 New Reservation! ${reservationDetails.customerName}, ${reservationDetails.partySize} guests, ${reservationDetails.date} @ ${reservationDetails.time}. Check admin dashboard.`;
      await this.smsService.sendSms(managerPhone, smsMessage);
    }
  }

  /**
   * Acknowledges a booking the moment it is made. Reservations start PENDING and
   * a manager may not confirm for hours, so without this the guest submits the
   * form and hears nothing — the most common reason people phone to ask whether
   * a booking went through.
   */
  async sendReservationReceived(details: {
    customerName: string;
    email?: string;
    date: string;
    time: string;
    partySize: number;
    branchName?: string;
  }): Promise<void> {
    if (!details.email) return;
    const when = this.formatDateTimeForEAT(details.date, details.time);
    const subject = `✨ We received your reservation — Lidya Cultural Food Zone`;
    const html = brandedEmail({
      preheader: `Thank you — we've received your table request for ${when.date}.`,
      heading: `Thank you, ${details.customerName}!`,
      paragraphs: [
        'We have received your table request. Our team will review it and send you a confirmation shortly.',
      ],
      details: [
        { label: 'Date', value: when.date },
        { label: 'Time', value: `${when.time} (EAT)` },
        { label: 'Party Size', value: `${details.partySize} ${details.partySize === 1 ? 'guest' : 'guests'}` },
        { label: 'Branch', value: details.branchName },
      ],
      note: 'This is not yet a confirmation — we will email you again once your table is secured. For anything urgent, call 0920994499.',
      button: { label: 'Call Us', url: 'tel:+251920994499' },
    });
    await this.emailService.sendEmail(details.email, subject, html);
  }

  async notifyCustomerStatus(
    phone: string,
    email: string | undefined,
    status: string,
    name: string,
    date: string,
    time: string,
    partySize: number,
    branchName?: string
  ): Promise<void> {
    // Format date and time for East Africa Time (EAT)
    const formattedDateTime = this.formatDateTimeForEAT(date, time);

    const isConfirmed = status === 'CONFIRMED';
    const isCancelled = status === 'CANCELLED';

    if (isConfirmed) {
      const subject = `✅ Reservation Confirmed - Lidya Cultural Food Zone`;
      const html = brandedEmail({
        preheader: `Your table is confirmed for ${formattedDateTime.date}`,
        heading: 'Reservation Confirmed!',
        accent: '#10b981',
        greeting: `Dear ${name},`,
        paragraphs: ['Your reservation at Lidya Cultural Food Zone has been confirmed. We look forward to welcoming you.'],
        details: [
          { label: 'Date', value: formattedDateTime.date },
          { label: 'Time', value: `${formattedDateTime.time} (EAT)` },
          { label: 'Party Size', value: `${partySize} ${partySize === 1 ? 'guest' : 'guests'}` },
          { label: 'Branch', value: branchName },
        ],
        note: 'Please arrive 15 minutes before your scheduled time. To make changes, just give us a call.',
        button: { label: 'Call Us', url: 'tel:+251920994499' },
      });

      if (email) {
        await this.emailService.sendEmail(email, subject, html);
      }

      if (phone) {
        const smsMessage = `✅ Hi ${name}, your reservation at Lidya Cultural Food Zone is CONFIRMED for ${formattedDateTime.date} at ${formattedDateTime.time} EAT. We look forward to serving you!`;
        await this.smsService.sendSms(phone, smsMessage);
      }
    } else if (isCancelled) {
      const subject = `❌ Reservation Cancelled - Lidya Cultural Food Zone`;
      const html = brandedEmail({
        preheader: `Update on your reservation for ${formattedDateTime.date}`,
        heading: 'Reservation Cancelled',
        accent: '#ef4444',
        greeting: `Dear ${name},`,
        paragraphs: ['We regret to inform you that your reservation at Lidya Cultural Food Zone has been cancelled.'],
        details: [
          { label: 'Original Date', value: formattedDateTime.date },
          { label: 'Original Time', value: `${formattedDateTime.time} (EAT)` },
          { label: 'Party Size', value: `${partySize} ${partySize === 1 ? 'guest' : 'guests'}` },
          { label: 'Branch', value: branchName },
        ],
        note: 'Please feel free to make a new reservation. We apologise for any inconvenience.',
        button: { label: 'Call Us', url: 'tel:+251920994499' },
      });

      if (email) {
        await this.emailService.sendEmail(email, subject, html);
      }

      if (phone) {
        const smsMessage = `❌ Hi ${name}, your reservation at Lidya Cultural Food Zone for ${formattedDateTime.date} at ${formattedDateTime.time} EAT has been CANCELLED. Please contact us if you have questions.`;
        await this.smsService.sendSms(phone, smsMessage);
      }
    }
  }

  // ─── Event / VIP booking notifications ───────────────────────────────────

  async notifyManagerNewEventBooking(details: EventBookingDetails): Promise<void> {
    const managerEmail = env.MANAGER_EMAIL || 'ashenafibanchabassa01@gmail.com';
    const managerPhone = env.MANAGER_PHONE || '';
    const label = serviceLabel(details.serviceType);

    const subject = `🎉 New ${label} Booking Request — Lidya Cultural Food Zone`;
    const html = brandedEmail({
      preheader: `${label} · ${details.customerName} · ${details.eventDate}`,
      heading: 'New Event / Service Booking',
      accent: '#c25e2a',
      paragraphs: ['A new event / premium-service booking request has arrived. Review the details and confirm it from the dashboard.'],
      details: [
        { label: 'Service', value: label },
        { label: 'Customer', value: details.customerName },
        { label: 'Phone', value: details.phone },
        { label: 'Email', value: details.email },
        { label: 'Preferred Date', value: details.eventDate },
        { label: 'Estimated Guests', value: details.guestCount ? String(details.guestCount) : undefined },
        { label: 'Branch', value: details.branchName },
        { label: 'Details', value: details.message },
      ],
      button: { label: 'Open Admin Dashboard', url: `${env.FRONTEND_URL || ''}/admin` },
    });

    await this.emailService.sendEmail(managerEmail, subject, html);

    if (managerPhone) {
      const sms = `🎉 New ${label} booking! ${details.customerName}, ${details.guestCount || '?'} guests, ${details.eventDate}. Check admin dashboard.`;
      await this.smsService.sendSms(managerPhone, sms);
    }
  }

  async sendEventBookingReceived(details: EventBookingDetails): Promise<void> {
    if (!details.email) return;
    const label = serviceLabel(details.serviceType);
    const subject = `✨ We received your ${label} request — Lidya Cultural Food Zone`;
    const html = brandedEmail({
      preheader: `Thank you — we've received your ${label} request.`,
      heading: `Thank you, ${details.customerName}!`,
      greeting: undefined,
      paragraphs: [
        `We have received your booking request for ${label}, and our events team will contact you shortly to confirm the details.`,
      ],
      details: [
        { label: 'Service', value: label },
        { label: 'Preferred Date', value: details.eventDate },
        { label: 'Estimated Guests', value: details.guestCount ? String(details.guestCount) : undefined },
        { label: 'Branch', value: details.branchName },
      ],
      note: 'For anything urgent, call us on 0920994499. We look forward to hosting your celebration.',
      button: { label: 'Call Us', url: 'tel:+251920994499' },
    });
    await this.emailService.sendEmail(details.email, subject, html);
  }

  async notifyCustomerEventStatus(details: EventBookingDetails, status: string): Promise<void> {
    if (!details.email) return;
    const label = serviceLabel(details.serviceType);
    const isConfirmed = status === 'CONFIRMED';

    const subject = isConfirmed
      ? `✅ Your ${label} booking is confirmed — Lidya Cultural Food Zone`
      : `❌ Update on your ${label} booking — Lidya Cultural Food Zone`;

    const html = isConfirmed
      ? brandedEmail({
          preheader: `Your ${label} booking on ${details.eventDate} is confirmed.`,
          heading: 'Booking Confirmed!',
          accent: '#10b981',
          greeting: `Dear ${details.customerName},`,
          paragraphs: [`Your ${label} booking on ${details.eventDate} is confirmed. Our team will be in touch to finalise every detail.`],
          details: [
            { label: 'Service', value: label },
            { label: 'Date', value: details.eventDate },
            { label: 'Branch', value: details.branchName },
          ],
          note: "We can't wait to host you.",
          button: { label: 'Call Us', url: 'tel:+251920994499' },
        })
      : brandedEmail({
          preheader: `Update on your ${label} request`,
          heading: 'Booking Update',
          accent: '#ef4444',
          greeting: `Dear ${details.customerName},`,
          paragraphs: [`Regarding your ${label} request for ${details.eventDate} — unfortunately we are unable to confirm it at this time. Please contact us to discuss alternatives.`],
          details: [
            { label: 'Service', value: label },
            { label: 'Date', value: details.eventDate },
          ],
          note: 'We apologise for any inconvenience.',
          button: { label: 'Call Us', url: 'tel:+251920994499' },
        });

    await this.emailService.sendEmail(details.email, subject, html);

    if (details.phone) {
      const sms = isConfirmed
        ? `✅ Hi ${details.customerName}, your ${label} booking on ${details.eventDate} at Lidya is CONFIRMED. Our team will contact you soon.`
        : `Hi ${details.customerName}, we couldn't confirm your ${label} booking on ${details.eventDate}. Please call 0920994499. — Lidya`;
      await this.smsService.sendSms(details.phone, sms);
    }
  }

  private formatDateTimeForEAT(date: string, time: string): { date: string; time: string } {
    try {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      const eatDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000);

      const formattedDate = eatDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedTime = eatDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { date: formattedDate, time: formattedTime };
    } catch {
      return { date, time };
    }
  }
}

export const notificationService = new NotificationService();
