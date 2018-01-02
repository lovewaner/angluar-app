import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { DPSUser, HttpResponse } from '../../interface/index'
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "high"
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public moblie: string
  public code: string;
  public sendTime: number = 60;
  public isSend: boolean = true;
  public isRegister: boolean = false;
  
  public timer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ToastCtrl: ToastController,
    public userProvider: UserProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  getSMS() {
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.moblie))){ 
      this.ToastCtrl
        .create({
          message: "手机号码有误，请重填~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if(!this.isRegister){
      this.ToastCtrl
      .create({
        message: "您的手机号未注册，请联系管理员~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      this.userProvider.getSmsCode({
        Phone: this.moblie,
        id: 22
      }).then((data: HttpResponse) => {
        this.ToastCtrl
        .create({
          message: "验证码已发送，请注意查收~",
          duration: 2000,
          position: "top"
        })
        .present();
        this.isSend = false;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.sendTime --;
          if (this.sendTime === 0) {
            this.isSend = true;
          }
        }, 1000)
      });
    }
  }

  checkMoblie() {
    if (this.moblie.length === 11) {
      this.userProvider.CheckPhone(this.moblie).then((data: DPSUser) => {
          if (data === null) {
            this.ToastCtrl
            .create({
              message: "您的手机号未注册，请联系管理员~",
              duration: 2000,
              position: "top"
            })
            .present();
          } else {
            this.isRegister = true
          }
        });
    }
  }

  login() {
    if (!this.moblie || !this.code) {
      this.ToastCtrl
      .create({
        message: "请检查您的手机号或验证码是否填写完整~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      this.userProvider.DPSLogin(this.moblie, this.code).then((data: any) => {
        if (data.errcode) {
          this.ToastCtrl
            .create({
              message: data.errmsg,
              duration: 2000,
              position: "top"
            })
          .present();
          this.code = "";
        } else {
          localStorage.clear();
          localStorage.setItem('dpsuser', JSON.stringify(data.data[0]));
          this.navCtrl.setRoot(TabsPage, {
            animate: true,
            direction: "forward"
          });
        }
      });
    }
  }
}
