import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
import {
  DPSUser,
  Store,
  HttpResponse,
  ModalResponse,
  Task
} from "../../interface/index";

/**
 * Generated class for the ValueStorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-value-store',
  templateUrl: 'value-store.html',
})
export class ValueStorePage {
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public store: Store;
  public manager = 0;
  public managerDesc = "知晓允许";
  public waiter = 0;
  public waiterDesc = "不操作";
  public display = 0;
  public displayDesc = "500";
  public gradation = 0;
  public gradationDesc = "自主品牌普通地段";
  public taskInfo: Task.RootObject;
  public type = 1;

  constructor(
    public commonProvider: CommonProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ValueStorePage');
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.manager = Number(this.taskInfo.Manager_Relation);
          this.waiter = Number(this.taskInfo.Waiter_Relation);
          this.display = Number(this.taskInfo.Enter_Num);
          this.gradation = Number(this.taskInfo.Total_Level);
          this.onRangeChange("manager", this.manager);
          this.onRangeChange("waiter", this.waiter);
          this.onRangeChange("display", this.display);
          this.onRangeChange("gradation", this.gradation);
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
            });
        });
    }
  }

  submit() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择门店~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      this.loadModal("MapPage");
    }
  }

  update() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择门店~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Shop_ID: this.store.Store_ID,
        Manager_Relation: this.manager,
        Waiter_Relation: this.waiter,
        Enter_Num: this.display,
        Total_Level: this.gradation
      };
      this.addTask("update", task, "更新");
    }
  }

  loadModal(name: string, data?: object) {
    const modal = this.modalCtrl.create(name, data);
    modal.present();
    modal.onDidDismiss((data: ModalResponse) => {
      this.onModalDismiss(data);
    });
  }

  onModalDismiss(data: ModalResponse) {
    if (data.code === 0) return;
    switch (data.page) {
      case "SearchStorePage":
        if (this.store) {
          if (this.store.Store_ID === data.data["store"]["Store_ID"]) {
            return;
          }
        }
        this.store = data.data["store"];
        break;
      case "MapPage":
        const task = {
          Open_ID: this.user.Open_ID,
          Task_Type: "价值评估",
          Task_State: 2,
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Link_Href: "ValueStorePage",
          First_Type: "价值评估",
          Shop_ID: this.store.Store_ID,
          Manager_Relation: this.manager,
          Waiter_Relation: this.waiter,
          Enter_Num: this.display,
          Total_Level: this.gradation,
          Task_Duty: 2
        };
        this.addTask("insert" ,task , "提交");
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

  onRangeChange(type: string, e) {
    const transformStatus = Math.floor(e / 20);
    switch (type) {
      case "manager":
        this.getManagerDesc(transformStatus);
        break;
      case "waiter":
        this.getWaiterDesc(transformStatus);
        break;
      case "display":
        this.getDisplayDesc(transformStatus);
        break;
      case "gradation":
        this.getGradationDesc(e);
        break;
    }
  }

  getManagerDesc(status: number) {
    switch (status) {
      case 0:
        this.managerDesc = "知晓允许";
        break;
      case 1:
        this.managerDesc = "普通合作";
        break;
      case 2:
        this.managerDesc = "积极配合";
        break;
      case 3:
        this.managerDesc = "互动反馈";
        break;
      case 4:
        this.managerDesc = "深入嵌套";
        break;
    }
  }

  getWaiterDesc(status: number) {
    switch (status) {
      case 0:
        this.waiterDesc = "不操作";
        break;
      case 1:
        this.waiterDesc = "少数会操作";
        break;
      case 2:
        this.waiterDesc = "偶尔操作";
        break;
      case 3:
        this.waiterDesc = "经常操作";
        break;
      case 4:
        this.waiterDesc = "积极互动";
        break;
    }
  }

  getDisplayDesc(status: number) {
    switch (status) {
      case 0:
        this.displayDesc = "500";
        break;
      case 1:
        this.displayDesc = "1000";
        break;
      case 2:
        this.displayDesc = "1500";
        break;
      case 3:
        this.displayDesc = "2000";
        break;
      case 4:
        this.displayDesc = "2500以上";
        break;
    }
  }

  getGradationDesc(status: number) {
    const transformStatus = Math.floor(status / 10);
    switch (transformStatus) {
      case 0:
        this.gradationDesc = "自主品牌普通地段";
        break;
      case 1:
        this.gradationDesc = "自主品牌核心地段";
        break;
      case 2:
        this.gradationDesc = "二三线合资品牌普通地段";
        break;
      case 3:
        this.gradationDesc = "二三线合资品牌核心地段";
        break;
      case 4:
        this.gradationDesc = "一线合资品牌普通地段";
        break;
      case 5:
        this.gradationDesc = "一线合资品牌核心地段";
        break;
      case 6:
        this.gradationDesc = "高端品牌普通地段";
        break;
      case 7:
        this.gradationDesc = "高端品牌核心地段";
        break;
      case 8:
        this.gradationDesc = "豪华品牌普通地段";
        break;
      case 9:
        this.gradationDesc = "豪华品牌核心地段";
        break;
    }
  }
}
