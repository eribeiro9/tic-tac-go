import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';

export class WinningInfo {
  tieGame: boolean = false;
  winningMark!: MarkType;
  winningTriples!: MarkTriple[];
}
