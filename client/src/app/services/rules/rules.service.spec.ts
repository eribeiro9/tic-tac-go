import { MarkType } from '../../enums/mark-type.enum';
import { RulesService } from './rules.service';

fdescribe('RulesService', () => {

  describe('boardComplete', () => {
    it('should ignore all blanks', () => {
      const board = [
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ];
      expect(RulesService.boardComplete(board)).toBeFalse();
    });

    it('should work for rows', () => {
      const board = [
        [MarkType.O, MarkType.X, MarkType.O],
        [MarkType.O, MarkType.O, MarkType.Blank],
        [MarkType.X, MarkType.X, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for columns', () => {
      const board = [
        [MarkType.O, MarkType.Blank, MarkType.X],
        [MarkType.O, MarkType.X, MarkType.Blank],
        [MarkType.O, MarkType.X, MarkType.Blank],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for diagonals', () => {
      const board = [
        [MarkType.X, MarkType.Blank, MarkType.O],
        [MarkType.Blank, MarkType.O, MarkType.Blank],
        [MarkType.O, MarkType.Blank, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });
  });

  describe('tripleComplete', () => {
    it('should ignore all blanks', () => {
      const triple = [MarkType.Blank, MarkType.Blank, MarkType.Blank];
      expect(RulesService.tripleComplete(triple)).toBeFalse();
    });

    it('should work for all Os', () => {
      const triple = [MarkType.O, MarkType.O, MarkType.O];
      expect(RulesService.tripleComplete(triple)).toBeTrue();
    });

    it('should work for all Xs', () => {
      const triple = [MarkType.X, MarkType.X, MarkType.X];
      expect(RulesService.tripleComplete(triple)).toBeTrue();
    });

    it('should fail for mixed marks', () => {
      const triple = [MarkType.X, MarkType.O, MarkType.X];
      expect(RulesService.tripleComplete(triple)).toBeFalse();
    });

    it('should handle empty', () => {
      const triple: MarkType[] = [];
      expect(RulesService.tripleComplete(triple)).toBeFalse();
    });

    it('should handle extra', () => {
      const triple = [MarkType.X, MarkType.X, MarkType.X, MarkType.X];
      expect(RulesService.tripleComplete(triple)).toBeFalse();
    });
  });

});
