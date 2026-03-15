import { ImgSystemComponent } from './../../../../libs/shared/shared-ui/src/lib/img-system/img-system.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { RouterLink } from '@angular/router';
import { IndexComponentComponent } from './IndexComponent/IndexComponent.component';
import { SidebarLayoutComponent } from './core/components/sidebarLayout/sidebarLayout.component';
import { HeaderLayoutComponent } from './core/components/headerLayout/headerLayout.component';
import { PrimengModule } from '@gfw/primeng';
import { SidebarSingleItemComponent } from './core/components/sidebar-single-item/sidebar-single-item.component';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { SubMenueComponent } from './core/components/sub-menue/sub-menue.component';
import { errorHandleInterceptor } from './core/interceptors/error-handle.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsService } from './core/services/translate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './core/components/breadcrumb/breadcrumb.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputSearchComponent, LoaderComponent } from '@gfw/shared-ui';
import { languageInterceptor } from './core/interceptors/lang.interceptor';
import { NotificationToastComponent } from "./core/components/notification-toast/notification-toast.component";
import { SkeletonModule } from "primeng/skeleton";
import { SafeHtmlPipe } from "./core/pipes/safeHtml.pipe";
import { ɵɵDir } from "@angular/cdk/scrolling";
import { PrimeNGConfig } from 'primeng/api';
@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    IndexComponentComponent,
    SidebarLayoutComponent,
    HeaderLayoutComponent,
    SidebarSingleItemComponent,
    SubMenueComponent,

    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'top', useHash: true }),
    BrowserAnimationsModule,
    RouterLink,
    PrimengModule,
    TranslateModule.forRoot({
        defaultLanguage: 'en',
    }),
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputSearchComponent,
    LoaderComponent,
    RouterLinkActive,
    NotificationToastComponent,
    SkeletonModule,
    SafeHtmlPipe,
    ɵɵDir,
    ImgSystemComponent
],
  providers: [
    MessageService,
    provideHttpClient(
      withFetch(),
      withInterceptors([errorHandleInterceptor, authInterceptor,languageInterceptor])
    ),
    provideAnimations(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private _PrimeNGConfig:PrimeNGConfig){
    const nonce = (window as any).__webpack_nonce__;
    if (nonce) {
      this._PrimeNGConfig.csp.set({ nonce: nonce });
    }
  }
}
