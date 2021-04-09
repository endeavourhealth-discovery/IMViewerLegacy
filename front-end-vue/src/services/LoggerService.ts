export default class LoggerService {

  constructor(){}

  error(message: string, err: any) {
    console.error(err);
    return {severity: "error", summary: "Error", detail: message};
  }

  warn(message: string, data?: any) {
    if (data){
      console.log(data);
    }
    return {severity: "warn", summary: "Warning", detail: message};
  }

  info(message: string, data?: any) {
    if (data) {
      console.info(data);
    }
    return {severity: "info", summary: "Info", detail: message};
  }

  success(message: string, data?: any) {
    if (data) {
      console.log(data)
    }
    return {severity: "success", summary: "Success", detail: message};
  }

  debug(data: any) {
    console.debug(data)
  }

  trace(data: any) {
    console.trace(data)
  }
}
