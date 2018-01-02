import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
} from "ionic-angular";
import { Store, StoreCar, ModalResponse } from "../../interface/index";
import { CommonProvider } from '../../providers/common/common';
/**
 * Generated class for the CarCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  priority: "off"
})
@Component({
  selector: "page-check-car",
  templateUrl: "check-car.html"
})
export class CheckCarPage implements OnInit {
  public store: Store;
  public dieCarList: StoreCar[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public CommonProvider: CommonProvider,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  toPage(name: string, data?: Object) {
    switch (name) {
      case "SearchStorePage":
        const storeSelect = this.modalCtrl.create("SearchStorePage");
        storeSelect.onDidDismiss((data: ModalResponse) => {
          if (data.data) {
            this.store = data.data["store"];
            this.CommonProvider.getStoreCar(this.store.Store_ID).then((data: StoreCar[]) => {
              if (data) {
                this.dieCarList = data;
                console.log(this.dieCarList);
              } else {
                this.toastCtrl.create({
                  message: "该4S店没有空闲中的车",
                  duration: 2000,
                  position: "top"
                }).present();
                this.dieCarList = [];
              }
            });
          }
        });
        storeSelect.present();
        break;
      case "CheckCarDetailPage":
        this.navCtrl.push(name, data);
        break;
      default:
        break;
    }
  }
}
