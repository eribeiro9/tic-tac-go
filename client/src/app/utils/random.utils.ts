export class RandomUtils {
  public static ChooseFrom<T>(...args: T[]) {
    return args[Math.floor(Math.random() * args.length)];
  }
}
