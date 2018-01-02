import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
import { DPSUser, ModalResponse, HttpResponse, Task } from '../../interface/index'

/**
 * Generated class for the DevelopStorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "off"
})
@Component({
  selector: 'page-develop-store',
  templateUrl: 'develop-store.html',
})
export class DevelopStorePage {
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  public type = 1;
  public developStepNum = 1;
  public brand: string;
  public isRemark = false;
  public discuss_remark: string;
  public compact_remark: string;
  public developStep = "";
  public sign_remark: string;
  public materials_remark: string;
  public storeInfo: Object;
  public storeData: Object;
  public order: number;
  public taskInfo: Task.RootObject;

  constructor(
    public commonProvider: CommonProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController
  ) {
    this.transformDevelopStep();
  }

  transformDevelopStep() {
    switch (this.developStep) {
      case "首轮洽谈":
        this.developStepNum = 2;
        break;
      case "合同递交":
        this.developStepNum = 3;
        break;
      case "合同签订":
        this.developStepNum = 4;
        break;
      case "物料准备":
        this.developStepNum = 5;
        break;
    }
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.storeInfo = {};
      this.storeData = {};
      const loading = this.loading.create({
        content: "加载中..."
      });
      loading.present();
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          loading.dismiss();
          this.taskInfo = task[0];
          this.developStep = this.taskInfo.Discuss_State;
          this.transformDevelopStep();
          this.discuss_remark = this.taskInfo.Discuss_Remark;
          this.compact_remark = this.taskInfo.Compact_Remark;
          this.sign_remark = this.taskInfo.Sign_Remark;
          this.materials_remark = this.taskInfo.Materials_Remark;
          this.brand = this.taskInfo.Brand;
          this.storeInfo["store"] = this.taskInfo.Store_Name;
          this.storeInfo["address"] = this.taskInfo.Address;
          this.storeInfo["manager_mobile"] = this.taskInfo.Manager_Phone;
          this.storeInfo["manager_name"] = this.taskInfo.Manager_Name;
          this.storeInfo["station_name"] = this.taskInfo.Principal_Name;
          this.storeInfo["station_mobile"] = this.taskInfo.Principal_Phone;
          this.storeInfo["introduce"] = this.taskInfo.Introducer;
          this.storeInfo[
            "introduce_relation"
          ] = this.taskInfo.Introducer_Relation;
          this.storeData["provider"] = this.taskInfo.Supplier || "无";
          this.storeData["provider_remarks"] =
            this.taskInfo.Supplier_Remark || null;
          this.storeData["sales"] = this.taskInfo.Sales_Volume;
          this.storeData["waiters"] = this.taskInfo.Waiter_Num;
          this.storeData["month_enter"] = this.taskInfo.Mean_Month;
          this.storeData["day_enter"] = this.taskInfo.Mean_Day;
          this.storeData["accident"] = this.taskInfo.Repair_Num;
          this.storeData["repair"] = this.taskInfo.Repair_Value;
          this.storeData["parking"] = this.taskInfo.Parking_Space;
          this.storeData["task_remarks"] = this.taskInfo.Task_Remark;
          this.storeData["data_remarks"] = this.taskInfo.Assess_Remark;
          this.order = this.taskInfo.Order_Num;
          this.discuss_remark = this.taskInfo.Discuss_Remark || "";
          this.compact_remark = this.taskInfo.Compact_Remark || "";
          this.sign_remark = this.taskInfo.Sign_Remark || "";
          this.materials_remark = this.taskInfo.Materials_Remark || "";
        });
    }
  }

  update() {
    const task = {
      ID: this.taskInfo.ID,
      Task_ID: this.taskInfo.Task_ID,
      Task_State: "已处理",
      Task_Remark: this.storeData["task_remarks"],
      Brand: this.brand,
      Store_Name: this.storeInfo["store"],
      Address: this.storeInfo["address"],
      Manager_Phone: this.storeInfo["manager_mobile"],
      Manager_Name: this.storeInfo["manager_name"],
      Principal_Name: this.storeInfo["station_name"],
      Principal_Phone: this.storeInfo["station_mobile"],
      Introducer: this.storeInfo["introduce"],
      Introducer_Relation: this.storeInfo["introduce_relation"],
      Supplier: this.storeData["provider"],
      Supplier_Remark: this.storeData["provider_remarks"],
      Sales_Volume: this.storeData["sales"],
      Waiter_Num: this.storeData["waiters"],
      Mean_Month: this.storeData["month_enter"],
      Mean_Day: this.storeData["day_enter"],
      Repair_Num: this.storeData["accident"],
      Repair_Value: this.storeData["repair"],
      Parking_Space: this.storeData["parking"],
      Assess_Remark: this.storeData["data_remarks"],
      Discuss_Remark: this.discuss_remark,
      Order_Num: this.order
    };
    switch (this.developStepNum) {
      case 2:
        if (!this.compact_remark) {
          this.toastCtrl
            .create({
              message: "请填写合同递交备注~",
              duration: 2000,
              position: "top"
            })
            .present();
            return;
        } else {
          task["Discuss_State"] = "合同递交";
          task["Compact_Remark"] = this.compact_remark;
        }
        break;
      case 3:
        if (!this.sign_remark) {
          this.toastCtrl
            .create({
              message: "请填写合同签订备注~",
              duration: 2000,
              position: "top"
            })
            .present();
            return;
        } else {
          task["Discuss_State"] = "合同签订";
          task["Sign_Remark"] = this.sign_remark;
        }
        break;
      case 4:
        if (!this.materials_remark) {
          this.toastCtrl
            .create({
              message: "请填写物料准备备注~",
              duration: 2000,
              position: "top"
            })
            .present();
            return;
        } else {
          task["Discuss_State"] = "物料准备";
          task["Materials_Remark"] = this.materials_remark;
        }
        break;
    }
    this.addTask("update", task , "更新");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevelopStorePage');
  }

  loadModal(name: string, data?: Object) {
    const createModal = this.modalCtrl.create(name);
    createModal.present();
    createModal.onDidDismiss((data: ModalResponse) => {
      this.onDismissModal(data);
    });
  }

  onDismissModal(data: ModalResponse) {
    if (data.code === 0) return;
    switch (data.page) {
      case "BranchSearchPage":
        if (this.brand) {
          if (this.brand === data.data["brand"]["name"]) {
            return;
          }
        }
        this.brand = data.data["brand"]["name"];
        break;
      case "MapPage":
        const task = {
          Open_ID: this.user.Open_ID,
          Task_Type: "新店开拓",
          Task_State: 2,
          Task_Remark: this.storeData["task_remarks"],
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Link_Href: "DevelopStorePage",
          First_Type: "新店开拓",
          Brand: this.brand,
          Store_Name: this.storeInfo["store"],
          Address: this.storeInfo["address"],
          Manager_Phone: this.storeInfo["manager_mobile"],
          Manager_Name: this.storeInfo["manager_name"],
          Principal_Name: this.storeInfo["station_name"],
          Principal_Phone: this.storeInfo["station_mobile"],
          Introducer: this.storeInfo["introduce"],
          Introducer_Relation: this.storeInfo["introduce_relation"],
          Supplier: this.storeData["provider"],
          Supplier_Remark: this.storeData["provider_remarks"],
          Sales_Volume: this.storeData["sales"],
          Waiter_Num: this.storeData["waiters"],
          Mean_Month: this.storeData["month_enter"],
          Mean_Day: this.storeData["day_enter"],
          Repair_Num: this.storeData["accident"],
          Repair_Value: this.storeData["repair"],
          Parking_Space: this.storeData["parking"],
          Assess_Remark: this.storeData["data_remarks"],
          Discuss_State: "首轮洽谈",
          Discuss_Remark: this.discuss_remark,
          Order_Num: this.order
        };
        console.log(task);
        this.addTask("insert", task, "提交");
        break;
      case "DevelopStoreInformationPage":
        this.storeInfo = data.data;
        break;
      case "DevelopStoreDataPage":
        this.storeData = data.data;
        break;
      default:
        break;
    }
  }

  submit() {
    if (
      !this.brand ||
      !this.discuss_remark ||
      !this.storeData ||
      !this.storeInfo
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
