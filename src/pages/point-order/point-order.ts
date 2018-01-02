import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController,
  LoadingController
 } from 'ionic-angular';
import { 
  DPSUser, 
  Store, 
  StoreWaiter, 
  HttpResponse, 
  ModalResponse, 
  Task 
} from "../../interface/index";
import { CommonProvider } from '../../providers/common/common';
import { Unit } from "../../units/units";
/**
 * Generated class for the PointOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-point-order',
  templateUrl: 'point-order.html',
})
export class PointOrderPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  public store: Store;
  public waiter: string[] | string;
  public remarks: string;
  public waiterList: StoreWaiter[];
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public IsBilling: Boolean = true;
  public type = 1;
  public taskInfo: Task.RootObject;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public commonProvider: CommonProvider,
    public loadingCtrl: LoadingController
  ) { 
    if (this.navParams.get("taskID")) {
      const loading = this.loadingCtrl.create({
        content: '数据加载中...'
      });
      loading.present();
      this.type = 2;
      this.remarks = "";
      this.commonProvider.getTasksID(this.navParams.get("taskID")).then((data: Task.RootObject) => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.taskInfo = data[0];
          this.remarks = this.taskInfo.Task_Remark;
          this.IsBilling = this.taskInfo.Is_Billing;
          this.commonProvider.getStoreName(this.taskInfo.Shop_ID).then((store: Store) => {
            this.store = store[0];
            this.commonProvider.getWaiter(this.store.Store_ID).then((waiter: StoreWaiter[]) => {
              this.waiterList = waiter;
            });
          });
          const Waiter = [];
          this.taskInfo.People.forEach((element: Task.Person) => {
            Waiter.push(element.People_Name);
            this.selectWaiter.add(element.Open_ID);
            this.oldSelectWaiter.add(element.Open_ID);
          });
          this.waiter = Waiter;
        });
      });
    }
  }

  update() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择门店信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (!this.waiter) {
      this.toastCtrl
      .create({
        message: "请选择人员信息~",
        duration: 2000,
        position: "top"
      })
      .present();
    } else {
      if (!this.IsBilling) {
        if (!this.remarks) {
          this.toastCtrl
          .create({
            message: "未开单，备注必填~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else {
          this.upDateToast();
        }
      } else {
        this.upDateToast();
      }
    }
  }

  upDateToast() {
    const taskData = {
      Open_ID: this.user.Open_ID,
      Task_State: 2,
      Task_Remark: this.remarks || "",
      Shop_ID: this.store.Store_ID,
      ID: this.taskInfo.ID,
      Task_ID: this.taskInfo.Task_ID,
      Is_Billing: this.IsBilling
    };
    if (!Unit.CompareArray(
      Array.from(new Set(this.selectWaiter)),
      Array.from(new Set(this.oldSelectWaiter))
    )) {
      taskData["People"] = Array.from(new Set(this.selectWaiter));
    }
    this.addTasks('update', taskData);
  }

  addTasks(type: string, data: Object) {
    this.commonProvider.handleTasks(type, data).then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const toaster = this.toastCtrl.create({
          message: "任务提交成功~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
        toaster.onDidDismiss(() => {
          this.navCtrl.parent.select(0);
          this.navCtrl.popToRoot();
        });
      } else {
        const toaster = this.toastCtrl.create({
          message: "任务提交失败，请重试~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
      }
    });
  }

  changeWaiter(e) {
    const result = this.waiterList.filter(
      (element: StoreWaiter, index) =>
        this.waiter.toString().indexOf(element.Waiter_Name) > -1
    );
    this.selectWaiter.clear();
    result.forEach((element: StoreWaiter, index) => {
      this.selectWaiter.add(element.Open_ID);
    });
  }

  onRemarksChange(e) {
    this.remarks = e;
  }

  selectStatus(e) {
    this.IsBilling = e === "有异议" ? true : false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PointOrderPage');
  }

  submit() {
    if (!this.store || !this.waiter) {
      const toast = this.toastCtrl
        .create({
          message: "请选择店名和人员名称",
          duration: 2000,
          position: "top"
        });
        toast.present();
    } else {
      if (!this.IsBilling) {
        if (!this.remarks) {
          const toast = this.toastCtrl
            .create({
              message: "未开单，备注必填",
              duration: 2000,
              position: "top"
            });
            toast.present();
        } else {
          this.toaster();
        }
      } else {
        this.toaster();
      }
    }
  }

  toaster() {
    const map = this.modalCtrl.create("MapPage");
    map.present();
    map.onDidDismiss((data: ModalResponse) => {
      if (data.code === 0) return;
      const taskData = {
        Open_ID: this.user.Open_ID,
        Task_Type: '驻点开单',
        Task_State: 1,
        Task_Remark: this.remarks || "",
        Clock_Site: data.data.currentAddress || "",
        Longitude: data.data.currentPosition["lng"],
        Latitude: data.data.currentPosition["lat"],
        Shop_ID: this.store.Store_ID,
        Link_Href: "PointOrderPage",
        First_Type : "驻点开单",
        People: Array.from(new Set(this.selectWaiter)),
        Is_Billing: this.IsBilling,
      };
      this.addTasks('insert', taskData);
    });
  }

  toPage(name: string, data?: Object) {
    const storeSelect = this.modalCtrl.create(name, data);
    storeSelect.onDidDismiss((data: ModalResponse) => {
      if (data.code === 0) return;
      if (this.store) {
        if (this.store.Store_ID === data.data["store"]["Store_ID"]) {
          return;
        }
      }
      this.store = data.data["store"];
      this.waiter = "";
      this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
        this.waiterList = data;
      });
    });
    storeSelect.present();
  }
}
