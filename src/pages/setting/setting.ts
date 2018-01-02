import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  ModalController
} from 'ionic-angular';
import { DPSUser } from '../../interface/index'
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  public user: DPSUser = localStorage.getItem("dpsuser") ? JSON.parse(localStorage.getItem("dpsuser")) : {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  logout() {
    const alert = this.alertCtrl.create({
      title: "退出登录",
      subTitle: "确定退出登录吗？",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "确定",
          role: "confirm",
          handler: () => {
            localStorage.clear();
            const login = this.modalCtrl.create("LoginPage");
            login.present();
            login.onWillDismiss(() => {
              this.navCtrl.parent.select(0);
              this.navCtrl.popToRoot();
            });
          }
        }
      ]
    });
    alert.present();  
  }
}
