import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract the current user from the request.
 * Usage: @CurrentUser() user
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) return request.user?.[data];
    return request.user;
  },
);
