import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const config: SMTPTransport.Options = {
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '3130492454@qq.com',
        pass: 'msxnfzikzhbkdfhb',
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.transporter = createTransport<SMTPTransport.SentMessageInfo>(config);
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: '3130492454@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
