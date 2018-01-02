import { Component, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  ToastController
} from "ionic-angular";
import { ImageViewerController } from "ionic-img-viewer";
import { DPSUser, HttpResponse } from "../../interface/index";
import { CommonProvider } from "../../providers/common/common";
import { UserProvider } from "../../providers/user/user";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {
  Camera,
  CameraOptions,
} from "@ionic-native/camera";

/**
 * Generated class for the MinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: "high"
})
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html',
})
export class MinePage {
  public user: DPSUser = localStorage.getItem("dpsuser") ? JSON.parse(localStorage.getItem("dpsuser")) : {};
  public cameraOptions: CameraOptions;

  constructor(
    public toastCtrl: ToastController,
    public imgViewCtrl: ImageViewerController,
    public userProvider: UserProvider,
    public commonProvider: CommonProvider,
    public cameraCtrl: Camera,
    public actionSheetCtrl: ActionSheetController,
    public inAppBrowser: InAppBrowser,
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinePage');
  }

  ionViewWillEnter() {
    this.user = localStorage.getItem("dpsuser")
    ? JSON.parse(localStorage.getItem("dpsuser"))
    : {};
  }

  uploadAction(imgElement?: ElementRef) {
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
            this.cameraCtrl.getPicture(options).then((imgData) => {
              this.commonProvider.uploadImg(imgData).then((data: string) => {
                const src = data;
                this.userProvider.updateUser({
                  Admin_ID: this.user.Admin_ID,
                  Open_ID: this.user.Open_ID,
                  Admin_Name: this.user.Admin_Name,
                  Admin_Phone: this.user.Admin_Phone,
                  Department: 1,
                  Work_Type: 1,
                  Admin_Img: src
                })
                  .then((data: HttpResponse) => {
                    if (data.errcode === 0) {
                      this.toastCtrl.create({
                        message: "头像更新成功~",
                        duration: 2000,
                        position: "top"
                      }).present();
                      this.userProvider.getDPSInfo(this.user.Admin_Phone).then((res: HttpResponse) => {
                        if (res.errcode === 0) {
                          this.user = res.data[0];
                          localStorage.setItem("dpsuser", JSON.stringify(res.data[0]));
                        }
                      });
                    } else {
                      this.toastCtrl.create({
                        message: "头像更新失败，请重试~",
                        duration: 2000,
                        position: "top"
                      }).present();
                    }
                  })
                  .catch(e => {
                    alert(JSON.stringify(e));
                  });
                })
              },
                e => {
                console.log(e);
              }
            );
          }
        },
        {
          text: "从相册中选择",
          handler: () => {
            const options: CameraOptions = {
              sourceType: this.cameraCtrl.PictureSourceType.PHOTOLIBRARY, // 图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
              ...this.cameraOptions
            };
            this.cameraCtrl.getPicture(options).then((imgData) => {
              this.commonProvider.uploadImg(imgData).then((data: string) => {
                const src = data;
                this.userProvider.updateUser({
                  Admin_ID: this.user.Admin_ID,
                  Open_ID: this.user.Open_ID,
                  Admin_Name: this.user.Admin_Name,
                  Admin_Phone: this.user.Admin_Phone,
                  Department: 1,
                  Work_Type: 1,
                  Admin_Img: src
                })
                  .then((data: HttpResponse) => {
                    if (data.errcode === 0) {
                      this.toastCtrl.create({
                        message: "头像更新成功~",
                        duration: 2000,
                        position: "top"
                      }).present();
                      this.userProvider.getDPSInfo(this.user.Admin_Phone).then((res: HttpResponse) => {
                        if (res.errcode === 0) {
                          this.user = res.data[0];
                          localStorage.setItem("dpsuser", JSON.stringify(res.data[0]));
                        }
                      });
                    } else {
                      this.toastCtrl.create({
                        message: "头像更新失败，请重试~",
                        duration: 2000,
                        position: "top"
                      }).present();
                    }
                  })
                  .catch(e => {
                    alert(JSON.stringify(e));
                  });
                })
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
    if (imgElement) {
      actionSheet.addButton({
        text: "查看大图",
        handler: () => {
          this.imgViewCtrl.create(imgElement).present();
        }
      });
    }
    actionSheet.present();
  }

  toPage(name: string) {
    this.navCtrl.push(name);
  }

  openBrowser(url: string) {
    this.inAppBrowser.create(
      `http://node.chezhentong.com/manage/wap/${url}?e=t&o=${this.user
        .Open_ID}&timestamp=${new Date().getTime()}`,
      "_blank"
    );
  }
}
