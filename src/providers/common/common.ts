import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { HttpResponse } from '../../interface/index';
import { File, FileEntry } from "@ionic-native/file";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "@ionic-native/file-transfer";

@Injectable()

export class CommonProvider {
    public api: string;

    constructor(
        public httpClient: HttpClient,
        public file: File,
        public fileTransfer: FileTransfer,
    ){
        this.api = 'http://t.api.chezhentong.com/api/'
    }
    /**
     * 获取所有4S店
     */
    getStore(): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .get<HttpResponse>(`${this.api}store`)
                .subscribe(
                    (data) => resolve(data.data),
                    e => {
                        console.log(e);
                    }
                )
        })
    }

    /**
    * 获取指定门店空闲中车辆
    * @param id 门店id
     */
    getStoreCar(id: number): Promise<{}> {
        return new Promise((resolve: Function) => {
        this.httpClient
            .get<HttpResponse>(
            `${this.api}/car/state?store=${id}&type=空闲中`
            )
            .subscribe(
            data => resolve(data.data),
            e => {
                console.log(e);
            }
            );
        });
    }

    /**
     * 获取指定门店ID所有服务顾问
     * @param id: number 门店ID
     */
    getWaiter(id: number): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .get<HttpResponse>(`${this.api}waiter/store?id=${id}`)
                .subscribe(
                    data => resolve(data.data),
                    e => {
                        console.log(e);
                    }
                )
        })
    }

    /**
     * 处理任务
     * @param type: string 处理任务类型（新增/更新）
     * @param data: object 数据
     */
    handleTasks(type: string, data: Object): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .post<HttpResponse>(`${this.api}dps/task/${type}`, data)
                .subscribe(
                    data => resolve(data),
                    e => {
                        console.log(e);
                    }
                )
        });
    }

    /**
     * 获取指定人员、日期的任务
     * @param openid: string  DPS人员openid
     * @param date: string 日期
     */
    getTasks(openid: string, date: string): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .get<HttpResponse>(`${this.api}dps/task?openid=${openid}&date=${date}`)
                .subscribe(
                    data => resolve(data),
                    e => {
                        console.log(e);
                    }
                )
        });
    }

    /**
     * 获取指定TaskID任务
     * @param taskid: string  任务ID
     */
    getTasksID(taskid: string): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .get<HttpResponse>(`${this.api}dps/task?taskid=${taskid}`)
                .subscribe(
                    data => resolve(data.data),
                    e => {
                        console.log(e);
                    }
                )
        });
    }

    /**
     * 获取指定TaskID任务
     * @param id: string  门店ID
     */
    getStoreName(id: number): Promise<{}> {
        return new Promise((resolve: Function) => {
            this.httpClient
                .get<HttpResponse>(`${this.api}store?id=${id}`)
                .subscribe(
                    data => resolve(data.data),
                    e => {
                        console.log(e);
                    }
                )
        });
    }

    /**
   * 图片上传
   * @param src 图片src
   */
  uploadImg(src: string): Promise<{}> {
    return new Promise((resolve: Function) => {
      this.file.resolveLocalFilesystemUrl(src).then((entry: FileEntry) => {
        const url = entry.toInternalURL();
        this.httpClient
          .get("http://t.api.chezhentong.com/api/upload/img")
          .subscribe(data => {
            const uploadOptions: FileUploadOptions = {
              fileKey: "file",
              fileName: url.substr(url.lastIndexOf("/") + 1),
              httpMethod: "POST",
              mimeType: "image/jpeg",
              params: {
                token: data["token"]
              }
            };
            const transferObj: FileTransferObject = this.fileTransfer.create();
            transferObj
              .upload(url, encodeURI("http://upload.qiniu.com/"), uploadOptions)
              .then(data => {
                resolve(JSON.parse(data["response"])["hash"]);
              })
              .catch(e => {
                alert(JSON.stringify(e));
              });
          });
      });
    });
  }

    /**
   * 获取任务标签
   * @param type 任务类型
   */
  getTaskLabel(type: string): Promise<{}> {
    return new Promise((resolve: Function) => {
      this.httpClient
        .get<HttpResponse>(
          `http://t.api.chezhentong.com/api/task/label?type=${type}`
        )
        .subscribe(
          data => resolve(data),
          e => {
            console.log(e);
          }
        );
    });
  }

  /**
   * 获取汽车品牌
   */
  getCarBrand() {
    return new Promise((resolve: Function) => {
      this.httpClient
        .get("http://jisucxdq.market.alicloudapi.com/car/brand", {
          headers: new HttpHeaders().set(
            "Authorization",
            "APPCODE f890cb65d7ec416cb58f10b153af6845"
          )
        })
        .subscribe(res => resolve(res["result"]));
    });
  }
}