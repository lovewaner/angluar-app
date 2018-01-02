import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '../../interface/index'

@Injectable()

export class UserProvider {
    public api: string;

    constructor(
        public httpClient: HttpClient
    ) {
        this.api = 'http://t.api.chezhentong.com/api/';
    }

    /**
     * 获取验证码
     * @params phone: string  手机号
     * @params id: number（1为用户验证码，22为DPS验证码）
     */

     getSmsCode(data: object): Promise<{}> {
         return new Promise((resolve: Function) => {
            this.httpClient
                .post<HttpResponse>(`${this.api}sendSms`, data)
                .subscribe(
                    data => resolve(data.data),
                    e => {
                        console.log(e);
                    }
                )
         });
     }

     /**
     * 获取验证码
     * @params phone: string  手机号
     */
    CheckPhone(phone: string): Promise<{}> {
        return new Promise((resolve: Function) => {
           this.httpClient
               .get<HttpResponse>(`${this.api}administration?phone=${phone}`)
               .subscribe(
                   data => resolve(data.data),
                   e => {
                       console.log(e);
                   }
               )
        });
    }

    /**
     * DPS人员登录
     * @params phone: string  手机号
     * @params code: number  手机号
     */
    DPSLogin(phone: string, code: string): Promise<{}> {
        return new Promise((resolve: Function) => {
           this.httpClient
               .get<HttpResponse>(`${this.api}administration/login?phone=${phone}&code=${code}`)
               .subscribe(
                   data => resolve(data),
                   e => {
                       console.log(e);
                   }
               )
        });
    }

    /**
    * 更改人员信息
    * @param data 人员信息
    */
    updateUser(data: Object): Promise<{}> {
        return new Promise((resolve: Function) => {
        this.httpClient
            .post<HttpResponse>(`${this.api}Administration/update`, data)
            .subscribe(
            data => resolve(data),
            e => {
                console.log(e);
            }
            );
        });
    }

    /**
    * 根据手机号获取DPS人员信息
     * @param mobile 手机号
    */
    getDPSInfo(mobile: string): Promise<{}> {
        return new Promise((resolve: Function) => {
        this.httpClient
            .get<HttpResponse>(`${this.api}administration?phone=${mobile}`)
            .subscribe(
            data => resolve(data),
            e => {
                console.log(e);
            }
            );
        });
    }
}