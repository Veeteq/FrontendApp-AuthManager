import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './_service/jwt.interceptor';
import { errorInterceptor } from './_service/error.interceptor';
import { firstValueFrom, tap } from 'rxjs';
import { ConfigService } from './_service/config.service';
import { AppConfig } from './model/app-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),    
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(ConfigService);
      
      // Pobranie pliku z assets i zapisanie adresu w serwisie
      return firstValueFrom(
        http.get<AppConfig>('/assets/config.json')
        .pipe(
          tap(config => {
            console.log('Config loaded:', config);
            console.log('API URL:', config.authServer.apiUrl);
            configService.apiUrl = config.authServer.apiUrl;
          })
        )
      );
    }),
  ]
};
