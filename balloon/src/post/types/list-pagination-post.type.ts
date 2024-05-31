import { PaginationType } from 'src/utils/types/pagination.type';
import { Post } from '../entities/post.entity';

export type ListPaginationPostResponseType = Readonly<PaginationType<Post>>;
