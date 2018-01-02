import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, ViewController } from 'ionic-angular';
import { ModalResponse } from '../../interface/index';

/**
 * Generated class for the DevelopStoreDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-develop-store-data',
  templateUrl: 'develop-store-data.html',
})
export class DevelopStoreDataPage {
  public providerPicker: Object[];
  public provider: string;
  public provider_remarks: string;
  public sales: string;
  public waiters: string;
  public month_enter: string;
  public accident: string;
  public repair: string;
  public day_enter: string;
  public parking: string;
  public task_remarks: string;
  public data_remarks: string;
  public modalResponse: ModalResponse;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    this.providerPicker = [
      {
        options: [{ text: "有", value: "有" }, { text: "无", value: "无" }]
      }
    ];
    console.log(this.navParams.get("data"));
    if (this.navParams.get("data")) {
      const data = this.navParams.get("data");
      this.provider = data.provider ? "有" : "无";
      this.provider_remarks = data.provider_remarks;
      this.sales = data.sales;
      this.waiters = data.waiters;
      this.month_enter = data.month_enter;
      this.accident = data.accident;
      this.repair = data.repair;
      this.day_enter = data.day_enter;
      this.parking = data.parking;
      this.task_remarks = data.task_remarks;
      this.data_remarks = data.data_remarks;
    }
  }

  onPickerChange(e) {
    this.provider = e[0].value;
  }

  closePage() {
    this.modalResponse = {
      page: "DevelopStoreDataPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  confirm() {
    if (!this.provider || !this.sales || !this.waiters || !this.month_enter || !this.accident || !this.repair || !this.day_enter || !this.parking || !this.data_remarks) {
      this.toastCtrl
        .create({
          message: "请补全您的信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const StoreData = {
        provider: this.provider === "有" ? true : false,
        provider_remarks: this.provider_remarks,
        sales: this.sales,
        waiters: this.waiters,
        month_enter: this.month_enter,
        accident: this.accident,
        repair: this.repair,
        day_enter: this.day_enter,
        parking: this.parking,
        task_remarks: this.task_remarks,
        data_remarks: this.data_remarks
      };
      this.modalResponse = {
        page: "DevelopStoreDataPage",
        code: 1,
        action: "confirm",
        data: StoreData
      };
      this.viewCtrl.dismiss(this.modalResponse);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevelopStoreDataPage');
  }

}
