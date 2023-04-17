import { SetMetadata } from '@nestjs/common';

export const SkipAuth = (skip: boolean = true) => SetMetadata('skip_auth', skip);
