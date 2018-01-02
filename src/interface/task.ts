export declare namespace Task {
    export interface Person {
      Open_ID: string;
      People_Name: string;
    }
    export interface FacadeImg {
      ID: number;
      Task_ID: string;
      Img_Address: string;
      Img_Type: number;
    }
    export interface TyreImg {
      ID: number;
      Task_ID: string;
      Img_Address: string;
      Img_Type: number;
    }
    export interface CarTrim {
      ID: number;
      Task_ID: string;
      Polling_Field: string;
      Field_Type: number;
    }
    export interface LeadImg {
      ID: number;
      Task_ID: string;
      Img_Address: string;
      Img_Type: number;
    }
    export interface EliteImg {
      ID: number;
      Task_ID: string;
      Img_Address: string;
      Img_Type: number;
    }
    export interface IssueDiscuss {
      Open_ID: string;
      People_Name: string;
    }
    export interface ActivityDiscuss {
      Open_ID: string;
      People_Name: string;
    }
    export interface LabelList {
      Label_ID: number;
      Label_Name: string;
    }
    export interface RootObject {
      ID: number;
      Task_ID: string;
      Open_ID: string;
      Waiter_Name: string;
      First_Type?: any;
      Task_Type: string;
      Task_State: number;
      Task_Remark: string;
      Clock_Site: string;
      Longitude: string;
      Latitude: string;
      Shop_ID: number;
      Shop_Name: string;
      Decca_Num: number;
      Roll_Banner: number;
      Electronic_Screen: number;
      Car_Plate: string;
      Battery_State: number;
      Car_Paint: number;
      Facade_Remark: string;
      Tyre_Remark: string;
      Is_Billing: boolean;
      Is_Interflow: boolean;
      Interflow_Content: string;
      Is_Receipt: boolean;
      Receipt_Content: string;
      Link_Href: string;
      Air_Condition_Refrigeration: boolean;
      Air_Condition_Heating: boolean;
      Cleaning_Car: boolean;
      Tyre_One: boolean;
      Tyre_Two: boolean;
      Tyre_Three: boolean;
      Tyre_Four: boolean;
      Brand: string;
      Store_Name: string;
      Address: string;
      Principal_Name: string;
      Principal_Phone: string;
      Manager_Phone: string;
      Manager_Name: string;
      Introducer: string;
      Introducer_Relation: string;
      Supplier: boolean;
      Supplier_Remark: string;
      Sales_Volume: number;
      Waiter_Num: number;
      Mean_Month: number;
      Mean_Day: number;
      Repair_Num: number;
      Repair_Value: number;
      Parking_Space: number;
      Assess_Remark: string;
      Discuss_State: string;
      Discuss_Remark: string;
      Compact_Remark: string;
      Sign_Remark: string;
      Materials_Remark: string;
      Order_Num: number;
      Manager_Relation: string;
      Waiter_Relation: string;
      Enter_Num: string;
      Total_Level: string;
      Wai_Num: number;
      Hu_Num: number;
      Shang_Num: number;
      Issue_Discuss: IssueDiscuss[];
      Issue_Remark: string;
      Activity_Discuss: ActivityDiscuss[];
      Activity_Remark: string;
      Addition_Date: string;
      Addition_Time: string;
      Addition_Unix: string;
      People: Person[];
      Facade_Img: FacadeImg[];
      Tyre_Img: TyreImg[];
      Car_Trim: CarTrim[];
      Lead_Img: LeadImg[];
      Elite_Img: EliteImg[];
      Label_List: LabelList[];
    }
  }