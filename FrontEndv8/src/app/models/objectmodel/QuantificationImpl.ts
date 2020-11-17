import { Quantification } from './Quantification';
import { QuantificationType } from './QuantificationType';
export class QuantificationImpl implements Quantification {
  min: number;
  max: number;
  quantificationType: QuantificationType;

  getQuantificationType(): QuantificationType {
    throw new Error('Method not implemented.');
  }
  setQuantification(qtype: QuantificationType, min?: number, max?: number): object {
    throw new Error('Method not implemented.');
  }
  getMin(): number {
    throw new Error('Method not implemented.');
  }
  setMin(min: number): object {
    throw new Error('Method not implemented.');
  }
  getMax(): number {
    throw new Error('Method not implemented.');
  }
  setMax(max: number): object {
    throw new Error('Method not implemented.');
  }
}
