import { Component } from '@angular/core';
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
  CameraOptions,
} from "@ionic-native/camera";
import { DPSUser, Store, ModalResponse, HttpResponse, Task } from "../../interface/index";
import { Unit } from "../../units/units";
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the TalkManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-talk-manager',
  templateUrl: 'talk-manager.html',
})
export class TalkManagerPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  public IsBilling: Boolean = false;
  public store: Store;
  public type: Number = 1;
  public remarks: string;
  public problem: string;
  public cameraOptions: CameraOptions;
  public imgArr = new Set([]);
  public oldImgArr = new Set([]);
  public taskInfo: Task.RootObject;

  constructor(
    public commonProvider: CommonProvider,
    public cameraCtrl: Camera,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
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
  }

  ngOnInit() {
    if (this.navParams.get("taskID")) {
      this.type = 2;
      this.commonProvider
        .getTasksID(this.navParams.get("taskID"))
        .then((task: Task.RootObject[]) => {
          this.taskInfo = task[0];
          this.problem = this.taskInfo.Task_Remark;
          this.IsBilling = this.taskInfo.Is_Billing;
          this.taskInfo.Elite_Img.forEach((element: Task.EliteImg) => {
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
    console.log('ionViewDidLoad TalkManagerPage');
  }

  suggest(e) {
    this.IsBilling = e === "有异议" ? true : false;
  }

  update() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择店名~",
          duration: 2000,
          position: "top"
        }).present();
    } else if (this.imgArr.size !== 0) {
      this.toastCtrl
        .create({
          message: "请上传一张图片~",
          duration: 2000,
          position: "top"
        })
        .present();
    } else if(this.IsBilling) {
      this.loadModal("ProblemHandlePage", { "Interflow_Content": this.problem});
    } else {
      const task = {
        ID: this.taskInfo.ID,
        Task_ID: this.taskInfo.Task_ID,
        Task_State: 2,
        Task_Remark: this.problem || "",
        Shop_ID: this.store.Store_ID,
        Is_Billing: this.IsBilling
      };
      if (
        !Unit.CompareArray(
          Array.from(new Set(this.imgArr)),
          Array.from(new Set(this.oldImgArr))
        )
      ) {
        task["Elite_Img"] = Array.from(new Set(this.imgArr));
      }
      this.addTask('update', task, "更新");
    }
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

  submit() {
    if (!this.store) {
      this.toastCtrl
        .create({
          message: "请选择店名~",
          duration: 2000,
          position: "top"
        }).present();
      } else if (this.imgArr.size !== 0) {
        this.toastCtrl
          .create({
            message: "请至少上传一张图片~",
            duration: 2000,
            position: "top"
          })
          .present();
      } else if (this.IsBilling) {
        this.loadModal("ProblemHandlePage");
      } else {
        this.loadModal("MapPage");
      }
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
      case "MapPage":
          const taskData = {
            Open_ID: this.user.Open_ID,
            Task_Type: "服务经理交流",
            Task_State: 2,
            Is_Billing: this.IsBilling,
            Task_Remark: this.problem || "",
            Clock_Site: data.data["currentAddress"] || "",
            Longitude: data.data["currentPosition"]["lng"],
            Latitude: data.data["currentPosition"]["lat"],
            Shop_ID: this.store.Store_ID,
            Elite_Img: Array.from(new Set(this.imgArr)),
            Link_Href: "TalkManagerPage",
            First_Type : "交流",
          }
          this.addTask("insert", taskData, "提交");
        break;
      case "ProblemHandlePage": 
        this.problem = data.data["remarks"];
        if (this.type === 2) {
          const task = {
            ID: this.taskInfo.ID,
            Task_ID: this.taskInfo.Task_ID,
            Task_State: 2,
            Task_Remark: this.problem || "",
            Shop_ID: this.store.Store_ID,
            Is_Billing: this.IsBilling
          }
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
