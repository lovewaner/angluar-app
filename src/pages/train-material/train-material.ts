import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
 } from 'ionic-angular';
 import { CommonProvider } from "../../providers/common/common";
 import {
   DPSUser,
   Store,
   StoreWaiter,
   HttpResponse,
   ModalResponse,
   Task
 } from '../../interface/index';
 import { Unit } from '../../units/units';

/**
 * Generated class for the TrainMaterialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-train-material',
  templateUrl: 'train-material.html',
})
export class TrainMaterialPage {
  public user: DPSUser = localStorage.getItem("dpsuser") ? JSON.parse(localStorage.getItem("dpsuser")) : {};
  public store: Store;
  public waiter: string[] | string;
  public waiterList: StoreWaiter[];
  public selectWaiter = new Set([]);
  public oldSelectWaiter = new Set([]);
  public taskInfo: Task.RootObject;
  public type = 1;
  public remarks: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public commonProvider: CommonProvider
  ) {
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.remarks = this.taskInfo.Task_Remark;
          const Waiter = [];
          this.taskInfo.People.forEach((element: Task.Person) => {
            Waiter.push(element.People_Name);
            this.selectWaiter.add(element.Open_ID);
            this.oldSelectWaiter.add(element.Open_ID);
          });
          this.waiter = Waiter;
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
              this.commonProvider
                .getWaiter(this.store.Store_ID)
                .then((waiter: StoreWaiter[]) => {
                  this.waiterList = waiter;
                });
            });
        });
    }
  }

  update() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择店名~",
          duration: 2000,
          position: "top"
        }).present();
    } else if (!this.waiter) {
      this.toastCtrl
        .create({
          message: "请选择人员~",
          duration: 2000,
          position: "top"
        }).present();
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Task_State: "已处理",
        Task_Remark: this.remarks || "",
        Shop_ID: this.store.Store_ID
      };
      if (!Unit.CompareArray(
        Array.from(new Set(this.selectWaiter)),
        Array.from(new Set(this.oldSelectWaiter))
      )) {
        task["People"] = Array.from(new Set(this.selectWaiter));
      }
      this.addTask("update", task, "更新");
    }
  }

  submit() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择店名~",
          duration: 2000,
          position: "top"
        }).present();
    } else if (!this.waiter) {
      this.toastCtrl
        .create({
          message: "请选择人员~",
          duration: 2000,
          position: "top"
        }).present();
    } else {
      this.loadModal("MapPage");
    }
  }

  getSelectWaiterID() {
    const result = this.waiterList.filter((item: StoreWaiter) => this.waiter.toString().indexOf(item.Waiter_Name) > -1);
    this.selectWaiter.clear();
    result.forEach((data: StoreWaiter) => {
      this.selectWaiter.add(data.Open_ID);
    })
  }

  loadModal(name: string) {
    const storeSelect = this.modalCtrl.create(name);
    storeSelect.present();
    storeSelect.onDidDismiss((data: ModalResponse) => {
      this.onDismissModal(data);
    });
  }

  onDismissModal(data: ModalResponse) {
    // 0代表关闭modal页面，不做操作
    if (data.code === 0) return;
    switch (data.page) {
      case "SearchStorePage":
        this.store = data.data["store"];
        this.waiter = "";
        this.commonProvider.getWaiter(this.store.Store_ID).then((data: StoreWaiter[]) => {
          this.waiterList = data;
        });
        break;
      case "MapPage":
        const task = {
          Open_ID: this.user.Open_ID,
          Task_Type: "钥匙及材料交接",
          Task_State: 2,
          Task_Remark: this.remarks || "",
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Shop_ID: this.store.Store_ID,
          People: Array.from(new Set(this.selectWaiter)),
          Link_Href: "TrainMaterialPage",
          First_Type : "培训"
        };
        this.addTask("insert", task, "提交");
      default:
        break;
    }
  }

  //处理任务
  addTask(type: string, data: Object, msgType: string) {
    this.commonProvider.handleTasks(type, data).then((data: HttpResponse) => {
      if (data.errcode === 0) {
        const toaster = this.toastCtrl.create({
          message: `任务${msgType}成功~`,
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
          message:  `任务${msgType}失败，请重试~`,
          duration: 2000,
          position: "top"
        });
        toaster.present();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainMaterialPage');
  }

}
