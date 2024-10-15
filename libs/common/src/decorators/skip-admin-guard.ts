import { SetMetadata } from '@nestjs/common';

export const SkipAdminGuard = () => SetMetadata('skipAdminGuard', true);
