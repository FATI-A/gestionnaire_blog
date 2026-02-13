import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const roleGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const router = inject(Router);
  
  const account = msalService.instance.getActiveAccount();
  
  if (!account) {
    router.navigate(['/']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const idTokenClaims = account.idTokenClaims as { roles?: string[] };
  const userRoles = idTokenClaims?.roles || [];

  console.log('[ROLE GUARD] Rôles requis:', requiredRoles);
  console.log('[ROLE GUARD] Rôles utilisateur:', userRoles);

  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/acces-refuse']);
    return false;
  }

  return true;
};