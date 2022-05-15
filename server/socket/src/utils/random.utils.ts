export class RandomUtils {
  public static chooseFrom<T>(...args: T[]): T {
    return args[Math.floor(Math.random() * args.length)];
  }

  /**
   * @returns An integer between min and max (inclusive)
   */
  public static between(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Create a code for hosting a game
   * @returns A four character string: 2 letters + 2 numbers
   */
  public static gameCode(): string {
    return String.fromCharCode(
      // A - Z
      RandomUtils.between(65, 90),
      // A - Z
      RandomUtils.between(65, 90),
      // 0 - 9
      RandomUtils.between(48, 57),
      // 0 - 9
      RandomUtils.between(48, 57),
    );
  }
}
