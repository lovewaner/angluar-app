import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController } from 'ionic-angular';
import { ModalResponse } from '../../interface/index';

/**
 * Generated class for the DevelopStoreInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-develop-store-information',
  templateUrl: 'develop-store-information.html',
})
export class DevelopStoreInformationPage {
  public store: string;
  public address: string;
  public manager_name: string;
  public manager_mobile: string;
  public station_name: string;
  public station_mobile: string;
  public introduce: string;
  public introduce_relation: string;
  public modalResponse: ModalResponse;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {
    if (this.navParams.get("data")) {
      const data = this.navParams.get("data");
      this.store = data.store;
      this.address = data.address;
      this.manager_name = data.manager_name;
      this.manager_mobile = data.manager_mobile;
      this.station_name = data.station_name;
      this.station_mobile = data.station_mobile;
      this.introduce = data.introduce;
      this.introduce_relation = data.introduce_relation;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevelopStoreInformationPage');
  }

  score(name: string) {
    this.introduce_relation = name;
  }

  closePage() {
    this.modalResponse = {
      page: "DevelopStoreInformationPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  confirm() {
    if (!this.store || !this.address || !this.manager_name || !this.manager_mobile || !this.station_name || !this.station_mobile || !this.introduce || !this.introduce_relation) {
      this.toastCtrl
        .create({
          message: "请补全您的信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const StoreInfoData = {
        store: this.store,
        address: this.address,
        manager_name: this.manager_name,
        manager_mobile: this.manager_mobile,
        station_name: this.station_name,
        station_mobile: this.station_mobile,
        introduce: this.introduce,
        introduce_relation: this.introduce_relation
      };
      this.modalResponse = {
        page: "DevelopStoreInformationPage",
        code: 1,
        action: "confirm",
        data: StoreInfoData
      };
      this.viewCtrl.dismiss(this.modalResponse);
    }
  }
}
