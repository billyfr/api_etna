import { Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(execption: HttpException, host: ArgumentsHost) {
        let status = (execption instanceof HttpException) ? execption.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        return response
        .status(status)
        .json({
            code: execption.getStatus(),
            message: execption.message.error
        });
    }
}