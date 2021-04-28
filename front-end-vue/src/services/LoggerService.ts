export default {
  // for toast functionality, LoggerService should be called within Vue toast operation
  // e.g.
  // this.$toast.add(
  // LoggerService.error("Concept schemes server request failed", err)
  // );
  error(toastMessage?: string, consoleData?: any) {
    if (consoleData) {
      console.error(consoleData);
    }
    if (toastMessage) {
      return {
        severity: "error",
        summary: "Error",
        detail: toastMessage,
        life: 3000
      };
    }
  },

  warn(toastMessage?: string, consoleData?: any) {
    if (consoleData) {
      console.log(consoleData);
    }
    if (toastMessage) {
      return {
        severity: "warn",
        summary: "Warning",
        detail: toastMessage,
        life: 3000
      };
    }
  },

  info(toastMessage?: string, consoleData?: any) {
    if (consoleData) {
      console.info(consoleData);
    }
    if (toastMessage) {
      return {
        severity: "info",
        summary: "Info",
        detail: toastMessage,
        life: 3000
      };
    }
  },

  success(toastMessage?: string, consoleData?: any) {
    if (consoleData) {
      console.log(consoleData);
    }
    if (toastMessage) {
      return {
        severity: "success",
        summary: "Success",
        detail: toastMessage,
        life: 3000
      };
    }
  },

  debug(consoleData: any) {
    console.debug(consoleData);
  },

  trace(consoleData: any) {
    console.trace(consoleData);
  }
};
