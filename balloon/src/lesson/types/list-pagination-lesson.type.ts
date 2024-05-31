import { PaginationType } from 'src/utils/types/pagination.type';
import { Lesson } from '../entities/lesson.entity';

export type ListPaginationLessonResponseType = Readonly<PaginationType<Lesson>>;
