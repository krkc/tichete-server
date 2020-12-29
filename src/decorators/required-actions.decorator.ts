import { SetMetadata } from '@nestjs/common';
import { Action } from '../casl/casl-ability.factory';

export const REQUIRED_ACTIONS_KEY = 'REQUIRED_ACTIONS';
export const RequiredActions = (...actions: Action[]) => SetMetadata(REQUIRED_ACTIONS_KEY, actions);
