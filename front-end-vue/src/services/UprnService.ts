import axios, { AxiosResponse } from "axios";

export default class UprnService {
  static api = process.env.VUE_APP_UPRN_API;

  public static async findUprn(address: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "/getinfo", {
      params: { adrec: address },
      auth: {
        username: "eltest",
        password: "dls1tg"
      }
    });
  }

  public static async getUprn(uprn: number): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "/getuprn", {
      params: { uprn: uprn }
    });
  }

  public static async getActivity(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "/activity", {
      params: { u: "b786234a-edfd-4424-b87f-d0ea7ee8949b" },
      auth: {
        username: "eltest",
        password: "dls1tg"
      }
    });
  }

  public static async download(filename: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "/filedownload2", {
      params: {
        userid: "b786234a-edfd-4424-b87f-d0ea7ee8949b",
        filename: filename
      },
      responseType: "blob",
      auth: {
        username: "eltest",
        password: "dls1tg"
      }
    });
  }
}
