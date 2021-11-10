export class RandomUtils {
  public static chooseFrom<T>(...args: T[]): T {
    return args[Math.floor(Math.random() * args.length)];
  }
}
