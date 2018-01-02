import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams,ViewController, ToastController } from "ionic-angular";
import {
  DPSUser,
  Store,
  StoreWaiter,
  ModalResponse
} from "../../interface/index";
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the PrepareStoreCommunicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prepare-store-communication',
  templateUrl: 'prepare-store-communication.html',
})
export class PrepareStoreCommunicationPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  public store: Store;
  public remarks: string;
  public waiter: string | string[];
  public waiterList: StoreWaiter[] = [];
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public modalResponse: ModalResponse;

  constructor(
    public commonProvider: CommonProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {
    this.remarks = this.navParams.get("remarks") || "";
    this.selectWaiter = this.navParams.get("selectWaiter") ? new Set(this.navParams.get("selectWaiter")) : new Set([]);
    this.waiter = this.navParams.get("waiter") || "";
    this.store = this.navParams.get("store") || null;
  }

  ngOnInit() {
    if (!this.store) return;
    this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
      this.waiterList = data;
    });
  }

  getSelectWaiterID() {
    const result = this.waiterList.filter(
      (element: StoreWaiter, index) =>
        this.waiter.toString().indexOf(element.Waiter_Name) > -1
    );
    this.selectWaiter.clear();
    result.forEach((element: StoreWaiter, index) => {
      this.selectWaiter.add(element.Open_ID);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepareStoreCommunicationPage');
  }

  closePage() {
    this.modalResponse = {
      page: "PrepareStoreCommunicationPage",
      code: 0,
      action: "close",
      data: null
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

  confirm() {
    const data = {
      type: this.navParams.get("type"),
      waiter: this.waiter,
      remarks: this.remarks,
      selectWaiter: Array.from(this.selectWaiter),
    };
    this.modalResponse = {
      page: "PrepareStoreCommunicationPage",
      code: 1,
      action: "confirm",
      data: data
    };
    this.viewCtrl.dismiss(this.modalResponse);
  }

}
