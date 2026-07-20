import { logger } from '../utils/logger';

interface NotificationSender {
  send(message: string, recipient: string): Promise<boolean>;
}

class TelegramSender implements NotificationSender {
  async send(message: string, recipient: string): Promise<boolean> {
    // Mock implementation
    logger.info(`[TELEGRAM MOCK] Sent to ${recipient}: ${message}`);
    return true;
  }
}

class SmsSender implements NotificationSender {
  async send(message: string, recipient: string): Promise<boolean> {
    // Mock implementation
    logger.info(`[SMS MOCK] Sent to ${recipient}: ${message}`);
    return true;
  }
}

export class NotificationService {
  private telegram: TelegramSender;
  private sms: SmsSender;

  constructor() {
    this.telegram = new TelegramSender();
    this.sms = new SmsSender();
  }

  async notifyManagerNewReservation(reservationDetails: any) {
    const msg = `🔔 New Reservation!\nName: ${reservationDetails.customerName}\nPhone: ${reservationDetails.phone}\nParty: ${reservationDetails.partySize}\nTime: ${reservationDetails.date} @ ${reservationDetails.time}`;
    await this.telegram.send(msg, process.env.MANAGER_TELEGRAM_CHAT_ID || 'manager_chat');
  }

  async notifyCustomerStatus(phone: string, status: string, name: string) {
    const msg = `Dear ${name}, your reservation is now ${status}. Thank you! Lidya Cultural Food Zone.`;
    await this.sms.send(msg, phone);
  }
}

export const notificationService = new NotificationService();
