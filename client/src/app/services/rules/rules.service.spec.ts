import { MarkType } from '../../enums/mark-type.enum';
import { RulesService } from './rules.service';

fdescribe('RulesService', () => {

  describe('botMove', () => {
    it('should complete bot doubles', () => {
      const board = [
        [MarkType.O, MarkType.O, MarkType.Blank],
        [MarkType.X, MarkType.X, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ];
      expect(RulesService.botMove(board, MarkType.O)).toEqual({ x: 2, y: 0 });
    });

    it('should prevent player doubles', () => {
      const board = [
        [MarkType.O, MarkType.Blank, MarkType.Blank],
        [MarkType.X, MarkType.X, MarkType.Blank],
        [MarkType.O, MarkType.Blank, MarkType.Blank],
      ];
      expect(RulesService.botMove(board, MarkType.O)).toEqual({ x: 2, y: 1 });
    });

    it('should create doubles', () => {
      const board = [
        [MarkType.O, MarkType.Blank, MarkType.Blank],
        [MarkType.X, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ];
      expect(RulesService.botMove(board, MarkType.O)).toEqual({ x: 1, y: 0 });
    });
  });

  describe('boardComplete', () => {
    it('should ignore all blanks', () => {
      const board = [
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
        [MarkType.Blank, MarkType.Blank, MarkType.Blank],
      ];
      expect(RulesService.boardComplete(board)).toBeFalse();
    });

    it('should ignore tie game', () => {
      const board = [
        [MarkType.X, MarkType.O, MarkType.X],
        [MarkType.O, MarkType.X, MarkType.X],
        [MarkType.O, MarkType.X, MarkType.O],
      ];
      expect(RulesService.boardComplete(board)).toBeFalse();
    });

    it('should work for first row', () => {
      const board = [
        [MarkType.X, MarkType.X, MarkType.X],
        [MarkType.O, MarkType.O, MarkType.Blank],
        [MarkType.X, MarkType.O, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for second row', () => {
      const board = [
        [MarkType.O, MarkType.X, MarkType.O],
        [MarkType.O, MarkType.O, MarkType.O],
        [MarkType.X, MarkType.O, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for third row', () => {
      const board = [
        [MarkType.O, MarkType.X, MarkType.O],
        [MarkType.O, MarkType.O, MarkType.Blank],
        [MarkType.X, MarkType.X, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for first column', () => {
      const board = [
        [MarkType.O, MarkType.Blank, MarkType.X],
        [MarkType.O, MarkType.X, MarkType.Blank],
        [MarkType.O, MarkType.X, MarkType.Blank],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for second column', () => {
      const board = [
        [MarkType.O, MarkType.X, MarkType.X],
        [MarkType.Blank, MarkType.X, MarkType.Blank],
        [MarkType.O, MarkType.X, MarkType.Blank],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for third column', () => {
      const board = [
        [MarkType.O, MarkType.Blank, MarkType.X],
        [MarkType.Blank, MarkType.X, MarkType.X],
        [MarkType.O, MarkType.X, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for first diagonal', () => {
      const board = [
        [MarkType.X, MarkType.Blank, MarkType.O],
        [MarkType.Blank, MarkType.X, MarkType.Blank],
        [MarkType.O, MarkType.Blank, MarkType.X],
      ];
      expect(RulesService.boardComplete(board)).toBeTrue();
    });

    it('should work for second diagonal', () => {
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
