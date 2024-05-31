import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/config/config.type';
import { MaybeType } from '../utils/types/maybe.type';
import { MailerService } from 'src/mailer/mailer.service';
import path from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async passwordOnetime(mailData: MailData<{ password: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let passwordOnetimeTitle: MaybeType<string>;

    if (i18n) {
      [passwordOnetimeTitle] = await Promise.all([i18n.t('common.passwordOnetimeTitle')]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: passwordOnetimeTitle,
      text: passwordOnetimeTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'password-onetime.hbs',
      ),
      context: {
        title: passwordOnetimeTitle,
        password: mailData.data.password,
      },
    });
  }

  async forgotPass(mailData: MailData<{ password: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPassword: MaybeType<string>;

    if (i18n) {
      [resetPassword] = await Promise.all([i18n.t('common.resetPassword')]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPassword,
      text: resetPassword,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPassword,
        password: mailData.data.password,
      },
    });
  }

  async inviteEmail(
    mailData: MailData<{ hash: string; userName: string; courseName: string; price: number }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let inviteEmailTitle: MaybeType<string>;
    let header: MaybeType<string>;
    let content: MaybeType<string>;
    let confirm: MaybeType<string>;

    if (i18n) {
      [inviteEmailTitle, header, content, confirm] = await Promise.all([
        i18n.t('common.inviteEmailTitle'),
        i18n.t('invite-email.header'),
        i18n.t('invite-email.content'),
        i18n.t('invite-email.confirm'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: inviteEmailTitle,
      text: inviteEmailTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'invite-email.hbs',
      ),
      context: {
        title: inviteEmailTitle,
        url: `${mailData.data.hash}`,
        userName: mailData.data.userName,
        courseName: mailData.data.courseName,
        price: mailData.data.price.toLocaleString(),
        actionTitle: inviteEmailTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        header,
        content,
        confirm,
      },
    });
  }

  async inviteUserSuccessfully(
    mailData: MailData<{ sender: string; userName: string; courseName: string; commission: number }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let inviteUserSuccessfullyTitle: MaybeType<string>;
    let header: MaybeType<string>;
    let content: MaybeType<string>;
    let confirm: MaybeType<string>;

    if (i18n) {
      [inviteUserSuccessfullyTitle, header, content, confirm] = await Promise.all([
        i18n.t('common.inviteUserSuccessfullyTitle'),
        i18n.t('invite-email.header'),
        i18n.t('invite-email.content'),
        i18n.t('invite-email.confirm'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: inviteUserSuccessfullyTitle,
      text: inviteUserSuccessfullyTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'invite-user-successfully.hbs',
      ),
      context: {
        title: inviteUserSuccessfullyTitle,
        sender: mailData.data.sender,
        userName: mailData.data.userName,
        courseName: mailData.data.courseName,
        commission: mailData.data.commission,
        actionTitle: inviteUserSuccessfullyTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        header,
        content,
        confirm,
      },
    });
  }

  async buyCourse(
    mailData: MailData<{
      hash: string;
      usernameBuyer: string | null;
      emailBuyer: string | null;
      courseName: string | undefined;
      usernameTeacher: string | null;
    }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let buyCourseTitle: MaybeType<string>;

    if (i18n) {
      [buyCourseTitle] = await Promise.all([i18n.t('common.buyCourseTitle')]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: buyCourseTitle,
      text: buyCourseTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'buy-course.hbs',
      ),
      context: {
        title: buyCourseTitle,
        url: `${mailData.data.hash}`,
        usernameBuyer: mailData.data.usernameBuyer,
        emailBuyer: mailData.data.emailBuyer,
        courseName: mailData.data.courseName,
        usernameTeacher: mailData.data.usernameTeacher,
        actionTitle: buyCourseTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
      },
    });
  }
}
