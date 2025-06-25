import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './auth/services/http-interceptor/token.interceptor'; // Đảm bảo đúng path

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(), // vẫn dùng Fetch API
      withInterceptors([tokenInterceptor]) // thêm interceptor vào đây
    )
  ]
};
