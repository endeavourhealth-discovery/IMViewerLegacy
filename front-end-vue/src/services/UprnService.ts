import axios, { AxiosResponse, CancelToken } from "axios";

export default class UprnService {
    static api = process.env.VUE_APP_UPRN_API;

    public static async findUprn(address: string): Promise<AxiosResponse<any>> {
        return axios.get(this.api + "/getinfo", {
            params: {adrec: address},

        });
    }

    public static async getUprn(uprn: number): Promise<AxiosResponse<any>> {
        return axios.get(this.api + "/getuprn", {
            params: {uprn: uprn}});
    }
}
