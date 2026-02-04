import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((response) => {
        let message = 'Call API Success';
        let data: any = response;
        let page: number | undefined;
        let pageSize: number | undefined;
        let total: number | undefined;

        // Service trả object có message
        if (response && typeof response === 'object' && 'message' in response) {
          const rs = response as any;
          message = rs.message;
          data = rs.data;

          page = rs.page;
          pageSize = rs.pageSize;
          total = rs.total;
        }

        return {
          status: 'success',
          statusCode: res.statusCode,
          message,
          data,
          ...(page !== undefined && { page }),
          ...(pageSize !== undefined && { pageSize }),
          ...(total !== undefined && { total }),
        };
      }),
    );
  }
}
