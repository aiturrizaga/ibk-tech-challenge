import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthService } from "@ibk/core/services";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const authReq = isAuthenticated
    ? req.clone({
      setHeaders: { Authorization: `Bearer ${ authService.token }` }
    }) : req;

  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          authService.logout();
          router.navigateByUrl('/auth/login');
        }
      } else {
        console.error('An error occurred:', err);
      }
      return throwError(() => err);
    })
  );
}
