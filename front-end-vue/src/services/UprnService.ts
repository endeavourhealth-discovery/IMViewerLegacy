import axios, { AxiosResponse } from "axios";

export default class UprnService {
  static api = process.env.VUE_APP_UPRN_API;
  static username = process.env.VUE_APP_UPRN_USERNAME || "";
  static password = process.env.VUE_APP_UPRN_PASSWORD || "";
  static userId = process.env.VUE_APP_UPRN_USERID || "";

  public static async findUprn(address: string, area?: string): Promise<any> {
    const config = {
      params: { adrec: address },
      auth: {
        username: this.username,
        password: this.password
      }
    } as any;
    if (area) config.params.qpost = area;
    return (await axios.get(this.api + "/getinfo", config)).data;
  }

  public static async getUprn(uprn: number): Promise<any> {
    return (
      await axios.get(this.api + "/getuprn", {
        params: { uprn: uprn },
        auth: {
          username: this.username,
          password: this.password
        }
      })
    ).data;
  }

  public static async getActivity(): Promise<any> {
    return (
      await axios.get(this.api + "/activity", {
        params: { u: this.userId },
        auth: {
          username: this.username,
          password: this.password
        }
      })
    ).data;
  }

  public static async download(filename: string): Promise<any> {
    return (
      await axios.get(this.api + "/filedownload2", {
        params: {
          userid: this.userId,
          filename: filename
        },
        responseType: "blob",
        auth: {
          username: this.username,
          password: this.password
        }
      })
    ).data;
  }

  public static async upload(fileData: any): Promise<any> {
    const formData = new FormData();
    formData.append("file", fileData, fileData.name);
    formData.append("userid", this.userId);
    return (
      await axios.post(this.api + "/fileUpload2", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        auth: {
          username: this.username,
          password: this.password
        }
      })
    ).data;
  }
}
