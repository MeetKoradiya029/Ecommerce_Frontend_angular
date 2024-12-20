import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

// export const jwtInterceptor: HttpInterceptorFn = (req , next) => {
//   const accessToken = JSON.parse(localStorage.getItem("user_auth")!)
//   console.log("req>>>>", req);
//   if (accessToken) {
//     const cloneReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     });
//     return next(cloneReq);
//   } else {
//     return next(req);
//   }

// };

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const accessToken = localStorage.getItem("user_auth")
      console.log("req>>>>", request);
      if (isPlatformBrowser(this.platformId)) {
        // Execute client-side logic
        // ...
        if (accessToken) {
          const cloneReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          return next.handle(cloneReq)
        } else {
          return next.handle(request);
        }

      }
      return next.handle(request);

    }
}