import { PaginationType } from 'src/utils/types/pagination.type';
import { Course } from '../entities/course.entity';

export type ListResponseType = Readonly<PaginationType<Course>>;
