// import { HttpExceptionFilter } from './../filters/error.filter';
import { Injectable, CanActivate, HttpException, HttpStatus, ExecutionContext, UseFilters } from "@nestjs/common";
import { Observable } from "rxjs";

// @UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthGuard implements CanActivate {

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest(request): boolean {
        if (request.headers['authorization']) {
            return true;
        }
        if (!request.body) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
}