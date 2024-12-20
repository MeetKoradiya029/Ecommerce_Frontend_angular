import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { AppInitService } from './services/app-init.service';
import { UserService } from './services/user.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { DataService } from './services/data.service';


export const appConfig: ApplicationConfig = {
  providers: [
    NgxPermissionsService,
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxPermissionsModule.forRoot(), ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right'
    })), 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: jwtInterceptor,
      multi:true
    },
    {
      provide: APP_INITIALIZER, useFactory: initializeApp, deps: [
        AppInitService,
        UserService,
        NgxPermissionsService,
        DataService,
        Router
      ], multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
  ]
};

export function initializeApp(
  appInitService : AppInitService,
  userService : UserService,
  ngxPermissionService : NgxPermissionsService,
  dataService: DataService,
  router: Router
) {
  return () : Promise<any> => {
    return appInitService.initializeApp(userService, ngxPermissionService, dataService, router)
  }
}

