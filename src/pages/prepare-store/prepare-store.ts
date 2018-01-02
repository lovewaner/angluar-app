import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController
} from "ionic-angular";
import {
  DPSUser,
  HttpResponse,
  ModalResponse,
  Task,
  Store
} from "../../interface/index";
import { CommonProvider } from "../../providers/common/common";
import { Unit } from "../../units/units";

/**
 * Generated class for the PrepareStorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-prepare-store',
  templateUrl: 'prepare-store.html',
})
export class PrepareStorePage {
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public type = 1;
  public store: Store;
  public OUT_B: string;
  public HU_B: string;
  public HU_Commerce: string;
  public problem_remarks: string;
  public problem_waiter: string[];
  public problem_selectWaiter: string[];
  public old_problem_selectWaiter: string[];
  public activity_remarks: string;
  public activity_waiter: string[];
  public activity_selectWaiter: string[];
  public old_activity_selectWaiter: string[];
  public taskInfo: Task.RootObject;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public commonProvider: CommonProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.problem_waiter = [];
      this.problem_selectWaiter = [];
      this.old_problem_selectWaiter = [];
      this.activity_waiter = [];
      this.activity_selectWaiter = [];
      this.old_activity_selectWaiter = [];
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.HU_B = String(this.taskInfo.Hu_Num);
          this.OUT_B = String(this.taskInfo.Wai_Num);
          this.HU_Commerce = String(this.taskInfo.Shang_Num);
          this.problem_remarks = this.taskInfo.Issue_Remark;
          this.activity_remarks = this.taskInfo.Activity_Remark;
          this.taskInfo.Issue_Discuss.forEach((item: Task.IssueDiscuss) => {
            this.problem_selectWaiter.push(item.Open_ID);
            this.old_problem_selectWaiter.push(item.Open_ID);
            this.problem_waiter.push(item.People_Name);
          });
          this.taskInfo.Activity_Discuss.forEach((item: Task.IssueDiscuss) => {
            this.activity_selectWaiter.push(item.Open_ID);
            this.old_activity_selectWaiter.push(item.Open_ID);
            this.activity_waiter.push(item.People_Name);
          });
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
            });
        });
    }
  }

  update() {
    if (
      !this.store ||
      !this.HU_Commerce ||
      !this.HU_B ||
      !this.OUT_B ||
      !this.problem_remarks ||
      !this.problem_selectWaiter ||
      !this.activity_remarks ||
      !this.activity_selectWaiter
    ) {
      this.toastCtrl
        .create({
          message: "请完善相关信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Task_State: "已处理",
        Wai_Num: this.OUT_B,
        Hu_Num: this.HU_B,
        Shang_Num: this.HU_Commerce,
        Issue_Remark: this.problem_remarks,
        Activity_Remark: this.activity_remarks,
        Shop_ID: this.store.Store_ID
      };
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.problem_selectWaiter)),
          Array.from(new Set(this.old_problem_selectWaiter))
        )
      ) {
        task["Issue_Discuss"] = Array.from(new Set(this.problem_selectWaiter));
      }
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.activity_selectWaiter)),
          Array.from(new Set(this.old_activity_selectWaiter))
        )
      ) {
        task["Activity_Discuss"] = Array.from(
          new Set(this.activity_selectWaiter)
        );
      }
      this.commonProvider
        .handleTasks("update", task)
        .then((data: HttpResponse) => {
          if (data.errcode === 0) {
            const toaster = this.toastCtrl.create({
              message: "任务已更新~",
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
              message: "更新失败，请重试~",
              duration: 2000,
              position: "top"
            });
            toaster.present();
          }
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepareStorePage');
  }

  loadModal(name: string, data?: Object) {
    const openModal = this.modalCtrl.create(name, data);
    openModal.present();
    openModal.onDidDismiss((data: ModalResponse) => {
      this.onDismissModal(data);
    });
  }

  onDismissModal(data: ModalResponse) {
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
      case "PrepareStoreCarPage":
        this.HU_B = data.data.HU_B;
        this.OUT_B = data.data.OUT_B;
        this.HU_Commerce = data.data.HU_Commerce;
        break;
      case "PrepareStoreCommunicationPage":
        this[`${data.data.type}_remarks`] = data.data.remarks;
        this[`${data.data.type}_waiter`] = data.data.waiter;
        this[`${data.data.type}_selectWaiter`] = data.data.selectWaiter;
        break;
      case "MapPage":
        const openStoreData = {
          Open_ID: this.user.Open_ID,
          Task_Type: "开店准备",
          Task_State: 2,
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Link_Href: "PrepareStorePage",
          First_Type: "开店准备",
          Shop_ID: this.store.Store_ID,
          Wai_Num: this.OUT_B,
          Hu_Num: this.HU_B,
          Shang_Num: this.HU_Commerce,
          Issue_Discuss: this.problem_selectWaiter,
          Issue_Remark: this.problem_remarks,
          Activity_Discuss: this.activity_selectWaiter,
          Activity_Remark: this.activity_remarks,
          Task_Duty: 2 //（不填为线下运维任务，填写2为渠道任务）
        }
        this.addTask("insert", openStoreData, "提交");
        break;
      default:
        break;
    }
  }

  submit() {
    if (
      !this.store ||
      !this.HU_Commerce ||
      !this.HU_B ||
      !this.OUT_B ||
      !this.problem_remarks ||
      !this.problem_selectWaiter ||
      !this.activity_remarks ||
      !this.activity_selectWaiter
    ) {
      this.toastCtrl
        .create({
          message: "请完善相关信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else {
      this.loadModal("MapPage");
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
}
