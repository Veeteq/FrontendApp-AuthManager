import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfigService } from './_service/config.service';
import { errorInterceptor } from './_service/error.interceptor';
import { jwtInterceptor } from './_service/jwt.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),    
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    provideAppInitializer(() => {      
      const configService = inject(ConfigService);
      return configService.load();
    }),
  ]
};