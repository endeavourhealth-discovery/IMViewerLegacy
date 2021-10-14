import axios from "axios";

export default class WorkflowService {
  static api = process.env.VUE_APP_API;

  public static async getWorkflows(): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "workflow")) as [];
      return axiosReturn || [];
    } catch (error) {
      return [];
    }
  }

  public static async getWorkflowTasks(): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "workflow/tasks")) as [];
      return axiosReturn || [];
    } catch (error) {
      return [];
    }
  }
}
