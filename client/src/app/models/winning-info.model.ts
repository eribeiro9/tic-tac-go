import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';

export class WinningInfo {
  winningMark!: MarkType;
  winningTriples!: MarkTriple[];
}
