import { QuantificationType } from './QuantificationType';
export interface Quantification {
  getQuantificationType(): QuantificationType;
  setQuantification(qtype: QuantificationType, min?: number, max?: number): object;
  getMin(): number;
  setMin(min: number): object;
  getMax(): number;
  setMax(max: number): object;
}
