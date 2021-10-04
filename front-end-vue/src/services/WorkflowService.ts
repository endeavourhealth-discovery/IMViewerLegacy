import axios, { AxiosResponse } from "axios";

export default class WorkflowService {
  static api = process.env.VUE_APP_API;

  public static async getWorkflows(): Promise<any> {
    return (await axios.get(this.api + "workflow")).data;
  }

  public static async getWorkflowTasks(): Promise<any> {
    return (await axios.get(this.api + "workflow/tasks")).data;
  }
}
