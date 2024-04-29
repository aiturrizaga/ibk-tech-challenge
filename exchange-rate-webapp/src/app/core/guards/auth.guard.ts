import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "@ibk/core/services";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
