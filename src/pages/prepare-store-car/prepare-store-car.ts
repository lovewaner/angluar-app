import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ModalResponse } from '../../interface/index';

/**
 * Generated class for the PrepareStoreCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-prepare-store-car',
  templateUrl: 'prepare-store-car.html',
})
export class PrepareStoreCarPage {
  public OUT_B: string;
  public HU_B: string;
  public HU_Commerce: string;
  public OUT_BPicker: Object[];
  public HU_BPicker: Object[];
  public HU_CommercePicker: Object[];
  public modalResponse: ModalResponse;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {
    this.OUT_BPicker = this.HU_BPicker = this.HU_CommercePicker = [
      {
        options: [
          { text: "1辆", value: "1" },
          { text: "2辆", value: "2" },
          { text: "3辆", value: "3" },
          { text: "4辆", value: "4" },
          { text: "5辆", value: "5" },
          { text: "6辆", value: "6" },
          { text: "7辆", value: "7" },
          { text: "8辆", value: "8" },
          { text: "9辆", value: "9" },
          { text: "10辆", value: "10" },
        ]
      }
    ]
  }
  ngOnInit() {
    console.log(this.navParams.get("OUT_B"));
    if (this.navParams) {
      this.OUT_B = this.navParams.get("OUT_B");
      this.HU_B = this.navParams.get("HU_B");
      this.HU_Commerce = this.navParams.get("HU_Commerce");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepareStoreCarPage');
  }

  closePage() {
    this.modalResponse = {
      page: "PrepareStoreCarPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  confirm() {
    if (!this.OUT_B || !this.HU_B || !this.HU_Commerce) {
      this.toastCtrl
      .create({
        message: "请选择车辆数目~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      const CarData = {
        OUT_B: this.OUT_B,
        HU_B: this.HU_B,
        HU_Commerce: this.HU_Commerce,
      };
      this.modalResponse = {
        page: "PrepareStoreCarPage",
        code: 1,
        action: "confirm",
        data: CarData
      };
      this.viewCtrl.dismiss(this.modalResponse);
    }
  }
}
