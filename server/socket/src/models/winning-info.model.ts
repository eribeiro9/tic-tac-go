import { MarkTriple } from '../enums/mark-triple.enum';
import { MarkType } from '../enums/mark-type.enum';

export class WinningInfo {
  tieGame = false;
  winningMark!: MarkType;
  winningTriples!: MarkTriple[];
}
