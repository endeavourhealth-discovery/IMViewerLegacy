export interface ChartOptions {
  plugins?: {
    legend?: {
      position?: string,
      onHover?: Function,
      labels?: {boxWidth: number, fontSize: number},
      display?: boolean,
    },
    hover?: {onHover: Function},
  }
  tooltips?: { callbacks: {label(t: any, d: any): string } }
}
