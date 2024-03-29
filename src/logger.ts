class Logger {
  public prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  log(message: string) {
    console.log(this.prefix, message);
  }

  warn(message: string) {
    console.warn(this.prefix, message);
  }

  error(message: string) {
    console.error(this.prefix, message);
  }

  debug(message: string) {
    console.debug(this.prefix, message);
  }

  line() {
    console.log(this.prefix);
  }
}

export { Logger };
