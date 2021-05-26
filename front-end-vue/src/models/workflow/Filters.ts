
export interface Filters {
  global: { value: any, matchMode: string },
  taskId: {
    operator: string,
    constraints: {value: any, matchMode: string}[]
  },
  currentStep: { value: any, matchMode: string },
  status: {
    value: any, matchMode: string
  },
  author: {
    operator: string,
    constraints: { value: null, matchMode: string }[]
  },
  createdDate: {
    operator: string,
    constraints: { value: any, matchMode: string }[]
  },
  updatedDate: {
    operator: string,
    constraints: { value: any, matchMode: string }[]
  },
}
