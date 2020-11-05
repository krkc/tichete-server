import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../base/pagination.args';

@ArgsType()
export class UsersArgs extends PaginationArgs {}
