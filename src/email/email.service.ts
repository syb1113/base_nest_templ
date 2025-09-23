import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: {
        name: '系统邮件',
        address: this.configService.get('EMAIL_USER'),
      },
      to,
      subject,
      html,
    } as SendMailOptions);
  }
}
