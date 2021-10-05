import axios from "axios";

export default class WorkflowService {
  static api = process.env.VUE_APP_API;

  public static async getWorkflows(): Promise<any[]> {
    const axiosReturn = (await axios.get(this.api + "workflow")).data;
    return axiosReturn ? axiosReturn : [];
  }

  public static async getWorkflowTasks(): Promise<any> {
    const axiosReturn = (await axios.get(this.api + "workflow/tasks")).data;
    return axiosReturn ? axiosReturn : [];
  }
}
