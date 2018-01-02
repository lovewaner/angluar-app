import { Component } from "@angular/core";
import {
  Platform,
  IonicApp,
  App,
  Keyboard,
  ToastController,
  ModalController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { UserProvider } from '../providers/user/user';
import { HttpResponse } from '../interface/index';
import { TabsPage } from "../pages/tabs/tabs";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any = TabsPage;
  public backButtonPressed = false;
  constructor(
    public app: App,
    public userProvider: UserProvider,
    public ionicCtrl: IonicApp,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public keyBoard: Keyboard,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.backgroundColorByName("white");
      this.registerBackButtonAction();
    });
    if (!localStorage.getItem("dpsuser")) {
      this.modalCtrl.create("LoginPage").present();
    } else {
      this.userProvider.getDPSInfo(JSON.parse(localStorage.getItem("dpsuser"))["Admin_Phone"]).then((data: HttpResponse) => {
        if (data.errcode === 0) {
          localStorage.clear();
          localStorage.setItem("dpsuser", JSON.stringify(data.data[0]));
        } else {
          this.modalCtrl.create("LoginPage").present();
        }
      });
    }
  }
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      const activePortal = this.ionicCtrl._loadingPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
      }
      if (this.keyBoard.isOpen) {
        this.keyBoard.close();
      }
      return this.app.getActiveNav().canGoBack() ? this.app.getActiveNav().pop() : this.exitApp();
    }, 1);
  }
  exitApp() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      this.toastCtrl
        .create({
          message: "再按一次退出应用",
          duration: 2000,
          position: "top"
        })
        .present();
      this.backButtonPressed = true;
      setTimeout(() => {
        this.backButtonPressed = false;  
      }, 2000);
    }
  }
}