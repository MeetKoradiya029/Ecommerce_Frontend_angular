import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';




export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const userToken = localStorage.getItem('user_auth');

  if (userToken) {
    console.log("authguard");
    return true;
  } else {
    console.log("authguard");
    router.navigate(['/login']);
    return false;
  }
  
};
