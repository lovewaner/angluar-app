import { Component, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  ToastController,
  ModalController
} from "ionic-angular";
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import { CommonProvider } from "../../providers/common/common";
import { ModalResponse, HttpResponse, Task, DPSUser } from "../../interface/index";
import { ImageViewerController } from "ionic-img-viewer";
import { Unit } from "../../units/units";
/**
 * Generated class for the CarCheckDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  priority: 'off'
})
@Component({
  selector: "page-check-car-detail",
  templateUrl: "check-car-detail.html"
})
export class CheckCarDetailPage {
  public user: DPSUser = localStorage.getItem("dpsuser")
  ? JSON.parse(localStorage.getItem("dpsuser"))
  : {};
  public IsElectricity: Boolean = true;
  public IsConditionerHot: Boolean = true;
  public IsConditionerCold: Boolean = true;
  public IsAppearance: Boolean = true;
  public IsTyre: Boolean = true;
  //前后左右轮胎默认值设为true
  public RT: Boolean = true;
  public RH: Boolean = true;
  public LT: Boolean = true;
  public LH: Boolean = true;
  public cleanCarList = new Set([]);
  public oldCleanCarList = new Set([]);
  public cleanInSide: Boolean = false;
  public appearanceRemarks: string;
  public tyreRemarks: string;
  public otherRemarks: string;
  public cameraOptions: CameraOptions;
  public imgArrPaint = new Set([]);
  public oldImgArrPaint = new Set([]);
  public imgArrTyre = new Set([]);
  public oldImgArrTyre = new Set([]);
  public SelectTyreList: string[] = [];
  public type = 1;
  public carPlate: string;
  public storeID: number;
  public taskInfo: Task.RootObject;
  public SpecialNum: Number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ActionSheetCtrl: ActionSheetController,
    private cameraCtrl: Camera,
    private commonProvider: CommonProvider,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private imageViewerCtrl: ImageViewerController,
  ) {
    this.carPlate = this.navParams.data.carPlate;
    this.storeID = this.navParams.data.storeID;
    this.cameraOptions = {
      quality: 100, // 图像质量范围0-100
      destinationType: this.cameraCtrl.DestinationType.FILE_URI, // 选择返回值的格式
      encodingType: this.cameraCtrl.EncodingType.JPEG, // 选择返回的图像文件的编码
      mediaType: this.cameraCtrl.MediaType.PICTURE, // 设置要选择的媒体类型
      saveToPhotoAlbum: true, // 拍摄后将图像保存到设备上的相册
      allowEdit: true, // 选择图片前是否允许编辑
      cameraDirection: 1,
    };
    if (this.navParams.data.taskID) {
      this.type = 2;
      this.commonProvider.getTasksID(this.navParams.get("taskID")).then((data: Task.RootObject[]) => {
        this.taskInfo = data[0];
        this.taskInfo.Car_Trim.forEach((element: Task.CarTrim) => {
          this.cleanCarList.add(element.Polling_Field);
          this.oldCleanCarList.add(element.Polling_Field);
        });
        if (this.taskInfo.Tyre_One && this.taskInfo.Tyre_Two && this.taskInfo.Tyre_Three && this.taskInfo.Tyre_Four) {
          this.IsTyre = true;
        } else {
          this.IsTyre = false;
        }
        this.taskInfo.Tyre_Img.forEach((element: Task.FacadeImg) => {
          this.imgArrTyre.add(element.Img_Address);
          this.oldImgArrTyre.add(element.Img_Address);
        });
        this.taskInfo.Facade_Img.forEach((element: Task.TyreImg) => {
          this.imgArrPaint.add(element.Img_Address);
          this.oldImgArrPaint.add(element.Img_Address);
        });
        this.cleanInSide = this.taskInfo.Cleaning_Car;
        this.IsElectricity = this.taskInfo.Battery_State === 1 ? true : false;
        this.IsAppearance = this.taskInfo.Car_Paint === 1 ? true : false;
        this.IsConditionerHot = this.taskInfo.Air_Condition_Heating;
        this.IsConditionerCold = this.taskInfo.Air_Condition_Refrigeration;
        this.tyreRemarks = this.taskInfo.Tyre_Remark;
        this.appearanceRemarks = this.taskInfo.Facade_Remark;
        this.otherRemarks = this.taskInfo.Task_Remark;
        this.storeID = this.taskInfo.Shop_ID;
        this.RT = this.taskInfo.Tyre_One;
        this.RH = this.taskInfo.Tyre_Two;
        this.LT = this.taskInfo.Tyre_Three;
        this.LH = this.taskInfo.Tyre_Four;
        if (!this.RT) { this.SelectTyreList.push("RT"); }
        if (!this.RH) { this.SelectTyreList.push("RH"); }
        if (!this.LT) { this.SelectTyreList.push("LT"); }
        if (!this.LH) { this.SelectTyreList.push("LH"); }
      });
    }
  }
  upDateCleanCarFun(name: string) {
    return this.oldCleanCarList.has(name) ? true : false;
  }
  onClick(bigImg?: ElementRef) {
    const viewer = this.imageViewerCtrl.create(bigImg);
    viewer.present();
  }
  update() {
    // 判断车辆油漆外观不正常
    if (!this.IsAppearance) {
      if (this.imgArrPaint.size === 0) {
        this.toastCtrl
        .create({
          message: "请至少上传一张车辆外观油漆图片~",
          duration: 2000,
          position: "top"
        })
        .present();
      } else if (!this.appearanceRemarks) {
        this.toastCtrl
        .create({
          message: "请填写车辆外观油漆备注~",
          duration: 2000,
          position: "top"
        })
        .present();
      } else {
        this.up();
      }
    } else {
      this.up();
    }
  }
  up() {
    // 车辆轮胎正常
    if (this.IsTyre) {
      this.updateTaskObject();
    } else {
      // 车辆轮胎不正常
      if (this.RT && this.RH && this.LT && this.LH) {
        this.toastCtrl
        .create({
          message: "请至少选择一个轮胎~",
          duration: 2000,
          position: "top"
        })
        .present();
      } else {
        if (this.imgArrTyre.size === 0) {
          this.toastCtrl
          .create({
            message: "请至少上传一张轮胎检查图片~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else if (!this.tyreRemarks) {
          this.toastCtrl
          .create({
            message: "请填写车辆轮胎检查备注~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else if (this.imgArrTyre.size < this.SelectTyreList.length) {
          this.toastCtrl
          .create({
            message: "您的照片少于您选择的轮胎数~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else {
          this.updateTaskObject();
        }
      }
    }
  }
  updateTaskObject() {
    const taskData = {
      Open_ID: this.user.Open_ID,
      Task_State: 2,
      Facade_Remark: this.appearanceRemarks || "",
      Tyre_Remark: this.tyreRemarks || "",
      Task_Remark: this.otherRemarks || "",
      Shop_ID: this.storeID,
      Battery_State: this.IsElectricity ? 1 : 2,
      Car_Paint: this.IsAppearance ? 1 : 2,
      Air_Condition_Refrigeration: this.IsConditionerCold,
      Air_Condition_Heating: this.IsConditionerHot,
      Tyre_One: this.IsTyre ? true : this.RT ? true : false,
      Tyre_Two: this.IsTyre ? true : this.RH ? true : false,
      Tyre_Three: this.IsTyre ? true : this.LT ? true : false,
      Tyre_Four: this.IsTyre ? true : this.LH ? true : false,
      Cleaning_Car: this.cleanInSide,
      Task_ID: this.taskInfo.Task_ID,
      ID: this.taskInfo.ID
    };
    if (!Unit.CompareArray(
      Array.from(new Set(this.cleanCarList)),
      Array.from(new Set(this.oldCleanCarList))
    )) {
      taskData["Car_Trim"] = Array.from(new Set(this.cleanCarList));
    }
    if (!Unit.CompareArray(
      Array.from(new Set(this.imgArrPaint)),
      Array.from(new Set(this.oldImgArrPaint))
    )) {
      taskData["Facade_Img"] = Array.from(new Set(this.imgArrPaint));
    }
    if (!Unit.CompareArray(
      Array.from(new Set(this.imgArrTyre)),
      Array.from(new Set(this.oldImgArrTyre))
    )) {
      taskData["Tyre_Img"] = Array.from(new Set(this.imgArrTyre));
    }
    this.commomHandleTask('update', taskData);
  }
  onRemarksChange(event, type: string) {
    switch (type) {
      case "appearance":
          this.appearanceRemarks = event;
        break;
      case "tyre":
        this.tyreRemarks = event;
      break;
      case "other":
        this.otherRemarks = event;
      break;
      default:
        break;
    }
  }
  clearCar(e , value: string, type: string) {
    if (e.checked) {
      switch (type) {
        case "carOutClean":
          if (this.cleanCarList.has(value)) return;
          this.cleanCarList.add(value);
          break;
        case "CleanInCar":
          this.cleanInSide = true;
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case "carOutClean":
          this.cleanCarList.forEach((item, index) => {
            if (item === value) {
              this.cleanCarList.delete(item);
            }
          });
          break;
        case "CleanInCar":
        this.cleanInSide = false;
          break;
        default:
          break;
      }
    }
  }
  onRadioChange(event, type: string) {
    this[type] = !this[type];
  }
  uploadAction(type: string) {
    const actionSheet = this.ActionSheetCtrl.create({
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
                    switch (type) {
                      case "appearance":
                        this.imgArrPaint.add(`${data}`);
                        break;
                      case "tyre":
                        this.imgArrTyre.add(`${data}`);
                        break;
                      default:
                        break;
                    }
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
                    switch (type) {
                      case "appearance":
                        this.imgArrPaint.add(`${data}`);
                        break;
                      case "tyre":
                        this.imgArrTyre.add(`${data}`);
                        break;
                      default:
                        break;
                    }
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
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  adminImg(img: string) {
    if (img.indexOf('img.chezhentong.com') > -1) {
      return img;
    } else {
      return `http://img.chezhentong.com/${img}`;
    }
  }
  trpe(type: string) {
    switch (type) {
      case "RT":
        this.RT = !this.RT;
        if (!this.RT) {
          this.SelectTyreList.push("RT");
        } else {
          this.SelectTyreList.forEach((item, index) => {
            if (item === "RT") {
              this.SelectTyreList.splice(index, 1);
            }
          });
        }
        break;
      case "RH":
        this.RH = !this.RH;
        if (!this.RH) {
          this.SelectTyreList.push("RH");
        } else {
          this.SelectTyreList.forEach((item, index) => {
            if (item === "RH") {
              this.SelectTyreList.splice(index, 1);
            }
          });
        }
        break;
      case "LT":
        this.LT = !this.LT;
        if (!this.LT) {
          this.SelectTyreList.push("LT");
        } else {
          this.SelectTyreList.forEach((item, index) => {
            if (item === "LT") {
              this.SelectTyreList.splice(index, 1);
            }
          });
        }
        break;
      case "LH":
        this.LH = !this.LH;
        if (!this.LH) {
          this.SelectTyreList.push("LH");
        } else {
          this.SelectTyreList.forEach((item, index) => {
            if (item === "LH") {
              this.SelectTyreList.splice(index, 1);
            }
          });
        }
        break;
      default:
        break;
    }
  }
  submit() {
    if (!this.IsAppearance) {
      if (this.imgArrPaint.size === 0) {
        this.toastCtrl
        .create({
          message: "请至少上传一张车辆外观油漆图片~",
          duration: 2000,
          position: "top"
        })
        .present();
      } else if (!this.appearanceRemarks) {
        const toaster = this.toastCtrl
        .create({
          message: "请填写车辆外观油漆备注~",
          duration: 2000,
          position: "top"
        });
        toaster.present();
        toaster.onDidDismiss(() => {
          this.SpecialNum = 1;
        });
      } else {
        this.IsTyreModal();
      }
    } else {
      this.IsTyreModal();
    }
  }
  IsTyreModal() {
    if (this.IsTyre) {
      const map = this.modalCtrl.create("MapPage");
      map.present();
      map.onDidDismiss((data: ModalResponse) => {
        if (data.code === 0) return;
        this.insertData(data);
      });
    } else {
      if (this.RT && this.RH && this.LT && this.LH) {
        this.toastCtrl
        .create({
          message: "请至少选择一个轮胎~",
          duration: 2000,
          position: "top"
        })
        .present();
      } else {
        if (this.imgArrTyre.size === 0) {
          this.toastCtrl
          .create({
            message: "请至少上传一张轮胎检查图片~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else if (!this.tyreRemarks) {
          const toaster = this.toastCtrl
          .create({
            message: "请填写车辆轮胎检查备注~",
            duration: 2000,
            position: "top"
          });
          toaster.present();
          toaster.onDidDismiss(() => {
            this.SpecialNum = 2;
          });
        } else if (this.imgArrTyre.size < this.SelectTyreList.length) {
          this.toastCtrl
          .create({
            message: "您的照片少于您选择的轮胎数~",
            duration: 2000,
            position: "top"
          })
          .present();
        } else {
          const map = this.modalCtrl.create("MapPage");
          map.present();
          map.onDidDismiss((data: ModalResponse) => {
            if (data.code === 0) return;
            this.insertData(data);
          });
        }
      }
    }
  }
  insertData(data) {
    const taskData = {
      Open_ID: this.user.Open_ID,
      Task_Type: '车辆巡检',
      Task_State: 2,
      Facade_Remark: this.appearanceRemarks || "",
      Tyre_Remark: this.tyreRemarks || "",
      Task_Remark: this.otherRemarks || "",
      Clock_Site: data.data["currentAddress"] || "",
      Longitude: data.data["currentPosition"]["lng"],
      Latitude: data.data["currentPosition"]["lat"],
      Shop_ID: this.storeID,
      Link_Href: "CheckCarDetailPage",
      First_Type : "车辆巡检",
      Battery_State: this.IsElectricity ? 1 : 2,
      Car_Paint: this.IsAppearance ? 1 : 2,
      Air_Condition_Refrigeration: this.IsConditionerCold,
      Air_Condition_Heating: this.IsConditionerHot,
      Car_Trim: Array.from(new Set(this.cleanCarList)),
      Facade_Img: Array.from(new Set(this.imgArrPaint)),
      Tyre_Img: Array.from(new Set(this.imgArrTyre)),
      Tyre_One: this.IsTyre ? true : this.RT ? true : false,
      Tyre_Two: this.IsTyre ? true : this.RH ? true : false,
      Tyre_Three: this.IsTyre ? true : this.LT ? true : false,
      Tyre_Four: this.IsTyre ? true : this.LH ? true : false,
      Cleaning_Car: this.cleanInSide,
      Car_Plate: this.carPlate
    };
    this.commomHandleTask('insert', taskData);
  }
  // 处理任务
  commomHandleTask(type: string, taskData: Object) {
    this.commonProvider.handleTasks(type, taskData).then((data: HttpResponse) => {
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
}