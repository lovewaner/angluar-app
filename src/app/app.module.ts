import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonProvider } from '../providers/common/common';
import { UserProvider } from '../providers/user/user';
import { CommonInterceptor } from '../interceptor/common';
// 插件
import { CalendarModule  } from 'ion2-calendar';
import { PipesModule } from '../pipes/pipes.module';
import { MultiPickerModule } from 'ion-multi-picker';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      // mode: 'md',
      // iconMode: 'md',
      backButtonText: '',
      tabsHideOnSubPages: true,
      preloadModules: true,
    }),
    CalendarModule,
    PipesModule,
    MultiPickerModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonProvider,
    UserProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptor,
      multi: true,
    },
    File,
    FileTransfer,
    Camera,
    InAppBrowser
  ]
})
export class AppModule {}