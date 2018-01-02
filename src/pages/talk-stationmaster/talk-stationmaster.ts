import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController,
  ActionSheetController
} from "ionic-angular";
import {
  Camera,
  CameraOptions
} from "@ionic-native/camera";
import { CommonProvider } from "../../providers/common/common";
import {
  DPSUser,
  Store,
  HttpResponse,
  ModalResponse,
  Task
} from "../../interface/index";
import { Unit } from "../../units/units";

/**
 * Generated class for the TalkWayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-talk-stationmaster',
  templateUrl: 'talk-stationmaster.html',
})
export class TalkStationmasterPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public type = 1;
  public store: Store;
  public remarks: string;
  public problemDesc: string;
  public hasSuggest = "0";
  public cameraOptions: CameraOptions;
  public imgArr = new Set([]);
  public oldImgArr = new Set([]);
  public taskInfo: Task.RootObject;
  public bill: boolean;
  public problem: boolean;
  
  constructor(
    public commonProvider: CommonProvider,
    public cameraCtrl: Camera,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.cameraOptions = {
      quality: 100, // 图像质量范围0-100
      destinationType: this.cameraCtrl.DestinationType.FILE_URI, // 选择返回值的格式
      encodingType: this.cameraCtrl.EncodingType.JPEG, // 选择返回的图像文件的编码
      mediaType: this.cameraCtrl.MediaType.PICTURE, // 设置要选择的媒体类型
      saveToPhotoAlbum: true, // 拍摄后将图像保存到设备上的相册
      allowEdit: true // 选择图片前是否允许编辑
    };
    this.bill = this.navParams.get("bill");
    this.problem = this.navParams.get("problem");
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.remarks = this.taskInfo.Receipt_Content;
          this.problemDesc = this.taskInfo.Interflow_Content;
          this.bill = this.taskInfo.Is_Receipt;
          this.problem = this.taskInfo.Is_Interflow;
          this.taskInfo.Lead_Img.forEach((element: Task.LeadImg) => {
            this.imgArr.add(element.Img_Address);
            this.oldImgArr.add(element.Img_Address);
          });
          this.commonProvider
            .getStoreName(this.taskInfo.Shop_ID)
            .then((store: Store) => {
              this.store = store[0];
            });
        });
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TalkWayPage');
  }

  uploadAction() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "",
      buttons: [
        {
          text: "拍照",
          handler: () => {
            const options: CameraOptions = {
              sourceType: this.cameraCtrl.PictureSourceType.CAMERA, // 图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
              ...this.cameraOptions
            };
            this.cameraCtrl.getPicture(options).then(
              img => {
                this.commonProvider
                  .uploadImg(img)
                  .then(data => {
                    this.imgArr.add(`${data}`);
                  })
                  .catch(e => {
                    alert(JSON.stringify(e));
                  });
              },
              e => {
                console.log(e);
              }
            );
          }
        },
        {
          text: "从相册选择",
          handler: () => {
            const options: CameraOptions = {
              sourceType: this.cameraCtrl.PictureSourceType.PHOTOLIBRARY, // 图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
              ...this.cameraOptions
            };
            this.cameraCtrl.getPicture(options).then(
              img => {
                this.commonProvider
                  .uploadImg(img)
                  .then(data => {
                    this.imgArr.add(`${data}`);
                  })
                  .catch(e => {
                    alert(JSON.stringify(e));
                  });
              },
              e => {
                console.log(e);
              }
            );
          }
        },
        {
          text: "取消",
          role: "cancel",
          handler: () => {
            console.log("取消");
          }
        }
      ]
    });
    actionSheet.present();
  }

  update() {
    if (!this.store) {
    this.toastCtrl
      .create({
        message: "请选择店名~",
        duration: 2000,
        position: "top"
      }).present();
    } else if (this.bill && !this.remarks) {
      this.toastCtrl
        .create({
          message: "请填写账款信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (this.problem && this.problemDesc) {
      this.loadModal("ProblemHandlePage", { "Interflow_Content": this.problemDesc});
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Open_ID: this.user.Open_ID,
        Shop_ID: this.store.Store_ID,
        Is_Interflow: this.problem,
        Interflow_Content: this.problemDesc,
        Is_Receipt: this.bill,
        Receipt_Content: this.remarks || ""
      };
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.imgArr)),
          Array.from(new Set(this.oldImgArr))
        )
      ) {
        task["Lead_Img"] = Array.from(new Set(this.imgArr));
      }
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
        this.store = data.data["store"]
        break;
      case "MapPage":
        const task = {
          Open_ID: this.user.Open_ID,
          Task_Type: "站长交流",
          Task_State: 2,
          Is_Interflow: this.problem,
          Interflow_Content: this.problemDesc,
          Is_Receipt: this.bill,
          Receipt_Content: this.remarks || "",
          Clock_Site: data.data["currentAddress"] || "",
          Longitude: data.data["currentPosition"]["lng"],
          Latitude: data.data["currentPosition"]["lat"],
          Shop_ID: this.store.Store_ID,
          Lead_Img: Array.from(new Set(this.imgArr)),
          Link_Href: "TalkStationmasterPage",
          First_Type : "交流",
        };
        this.addTask("insert", task, "提交");
        break;
      case "ProblemHandlePage":
        this.problemDesc = data.data["remarks"];
        if (this.type === 2) {
          const task = {
            ID: this.taskInfo["ID"],
            Task_ID: this.taskInfo["Task_ID"],
            Open_ID: this.user.Open_ID,
            Shop_ID: this.store.Store_ID,
            Is_Interflow: this.problem,
            Interflow_Content: this.problemDesc,
            Is_Receipt: this.bill,
            Receipt_Content: this.remarks || ""
          };
          if (
            !Unit.CompareArray(
              Array.from(new Set(this.imgArr)),
              Array.from(new Set(this.oldImgArr))
            )
          ) {
            task["Lead_Img"] = Array.from(new Set(this.imgArr));
          }
          this.addTask("update", task, "更新");
          return;
        }
        this.loadModal("MapPage");
        break;
      default:
        break;
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
    } else if (this.bill && !this.remarks) {
      this.toastCtrl
        .create({
          message: "请填写账款信息~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if (this.problem && !this.problemDesc) {
      this.loadModal("ProblemHandlePage");
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
