import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { Course } from 'src/course/entities/course.entity';
import { Member } from 'src/course/entities/member.entity';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Status } from 'src/statuses/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';
import axios from 'axios';
import { Category } from 'src/course/entities/category.entity';
import path from 'path';

let AdminJS;
export async function registerAdminJsAdapter() {
  AdminJS = (await import('adminjs')).AdminJS;
  const AdminJSTypeORM = await import('@adminjs/typeorm');

  AdminJS.registerAdapter({
    Database: AdminJSTypeORM.Database,
    Resource: AdminJSTypeORM.Resource,
  });
}
registerAdminJsAdapter();

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: '123456',
};
const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:4001/api/v1/users/update-tuition-fee');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),

    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [TypeOrmModule.forFeature([User, Status, Role, Course, Lesson, Category])],
        inject: [
          getRepositoryToken(User),
          getRepositoryToken(Status),
          getRepositoryToken(Role),
          getRepositoryToken(Course),
          getRepositoryToken(Lesson),
          getRepositoryToken(Category),
        ],

        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: User,
                options: {
                  listProperties: [
                    'id',
                    'name',
                    'email',
                    'teacher',
                    'phone',
                    'commission',
                    'tuitionFees',
                    'paid',
                    // 'createdAt',
                  ],
                  filterProperties: ['id', 'name', 'email', 'commission', 'tuitionFees', 'paid'],
                  actions: {
                    new: { isAccessible: true },
                    edit: { isAccessible: true },
                    delete: { isAccessible: true },
                    bulkDelete: { isAccessible: true },
                    list: {
                      isAccessible: true,
                      before: async (request, context) => {
                        context.users = await fetchUserData();
                        return request;
                      },
                    },
                    show: { isAccessible: true },
                  },
                },
              },
              Status,
              Role,
              {
                resource: Course,
                options: {
                  listProperties: ['id', 'name', 'price', 'file', 'category', 'status', 'createdBy', 'createdAt'],
                  filterProperties: ['id', 'name', 'price', 'createdBy', 'status'],
                  actions: {
                    new: { isAccessible: false },
                    edit: { isAccessible: true },
                    delete: { isAccessible: true },
                    bulkDelete: { isAccessible: true },
                    list: { isAccessible: true },
                    show: { isAccessible: true },
                  },
                },
              },
              {
                resource: Member,
                options: {
                  filterProperties: ['id', 'courseId'],
                  actions: {
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: true },
                    bulkDelete: { isAccessible: false },
                    list: { isAccessible: true },
                    show: { isAccessible: true },
                  },
                },
              },
              {
                resource: Lesson,
                options: {
                  listProperties: ['id', 'courseId', 'name', 'content', 'file', 'status', 'createdBy', 'createdAt'],
                  filterProperties: ['id', 'name', 'status', 'createdBy'],
                  actions: {
                    new: { isAccessible: false },
                    edit: { isAccessible: true },
                    delete: { isAccessible: true },
                    bulkDelete: { isAccessible: true },
                    list: { isAccessible: true },
                    show: { isAccessible: true },
                  },
                },
                properties: {
                  status: {
                    components: {
                      filter: path.join(__dirname, 'components/StatusFilter.jsx'),
                    },
                  },
                  createdBy: {}
                },
              },
              {
                resource: Category,
              },
            ],
            branding: {
              companyName: 'Admin E-Course',
              logo: false,
              softwareName: 'Your Software Name',
              withMadeWithLove: false,
            },
            locale: {
              language: 'en',
              availableLanguages: ['en'],
            },
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: '123456',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
            rolling: true,
            cookie: {
              maxAge: 24 * 60 * 60 * 1000,
            },
          },
        }),
      }),
    ),
  ],
})
export class AdminModule {}
