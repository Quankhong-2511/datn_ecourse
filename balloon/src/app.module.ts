import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import fileConfig from './config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { LoggerWinston } from './utils/logger';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from './utils/filters/api-exception.filter';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { PostModule } from './post/post.module';
import { QuestionModule } from './question/question.module';
import { NotificationModule } from './notification/notification.module';
import { ForgotModule } from './forgot/forgot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    ForgotModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    // AdminModule,
    CourseModule,
    LessonModule,
    PostModule,
    QuestionModule,
    NotificationModule,
  ],
  providers: [
    LoggerWinston,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
  exports: [LoggerWinston],
})
export class AppModule {}
