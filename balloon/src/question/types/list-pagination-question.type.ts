import { PaginationType } from 'src/utils/types/pagination.type';
import { Question } from '../entities/question.entity';

export type ListPaginationQuestionResponseType = Readonly<PaginationType<Question>>;
