export class RandomUtils {
  public static chooseFrom<T>(...args: T[]): T {
    return args[Math.floor(Math.random() * args.length)];
  }

  public static between(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
