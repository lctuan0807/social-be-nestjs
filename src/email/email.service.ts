import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";

@Injectable()
export class EmailService {
  private readonly logger: Logger;

  constructor(
    private readonly mailerService: MailerService
  ) {
    this.logger = new Logger(EmailService.name);
  }

  async sendVerificationEmail(email: string, username: string, otp: string): Promise<void> {
    this.logger.log("Attemping to send email")
    try {
      this.mailerService.sendMail({
        to: email,
        subject: 'Test',
        // text: 'Welcome',
        // html: "<b>Hello world!</b>",
        template: 'register',
        context: {
          name: username,
          activationCode: otp
        }
      })
    } catch (error) {
      this.logger.log("Failed to send email", error)
      throw new InternalServerErrorException("Could not sned email. Please try again later")
    }

  }
}
