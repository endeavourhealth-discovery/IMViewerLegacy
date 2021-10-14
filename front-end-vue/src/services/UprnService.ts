import axios from "axios";

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

    try {
      const axiosReturn = await axios.get(this.api + "/getinfo", config);
      return axiosReturn || {};
    } catch (error) {
      return {};
    }
  }

  public static async getUprn(uprn: number): Promise<any> {
    try {
      const axiosReturn = await axios.get(this.api + "/getuprn", {
        params: { uprn: uprn },
        auth: {
          username: this.username,
          password: this.password
        }
      });
      return axiosReturn || {};
    } catch (error) {
      return {};
    }
  }

  public static async getActivity(): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "/activity", {
        params: { u: this.userId },
        auth: {
          username: this.username,
          password: this.password
        }
      })) as [];
      return axiosReturn || [];
    } catch (error) {
      return [];
    }
  }

  public static async download(filename: string): Promise<any> {
    try {
      const axiosReturn = await axios.get(this.api + "/filedownload2", {
        params: {
          userid: this.userId,
          filename: filename
        },
        responseType: "blob",
        auth: {
          username: this.username,
          password: this.password
        }
      });
      return axiosReturn || {};
    } catch (error) {
      return {};
    }
  }

  public static async upload(fileData: any): Promise<any> {
    const formData = new FormData();
    formData.append("file", fileData, fileData.name);
    formData.append("userid", this.userId);
    try {
      const axiosReturn = await axios.post(this.api + "/fileUpload2", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        auth: {
          username: this.username,
          password: this.password
        }
      });
      return axiosReturn || {};
    } catch (error) {
      return {};
    }
  }
}
