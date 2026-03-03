import type { Middleware } from "fresh";

enum LogPrefix {
  Outgoing = "-->",
  Incoming = "<--",
  Error = "xxx",
}

const humanize = (times: string[]) => {
  const [delimiter, separator] = [",", "."];

  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter)
  );

  return orderTimes.join(separator);
};

const time = (start: number) => {
  const delta = Date.now() - start;
  return humanize([
    delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s",
  ]);
};

type PrintFunc = (str: string, ...rest: string[]) => void;

function log(
  fn: PrintFunc,
  prefix: string,
  method: string,
  path: string,
  status: number = 0,
  elapsed?: string,
) {
  const out = prefix === LogPrefix.Incoming
    ? `${prefix} ${method} ${path}`
    : `${prefix} ${method} ${path} ${status} ${elapsed}`;
  fn(out);
}

export function logger<T = unknown>(
  fn: PrintFunc = console.log,
): Middleware<T> {
  return async function (ctx) {
    const { method, url } = ctx.req;

    const path = url.slice(url.indexOf("/", 8));

    log(fn, LogPrefix.Incoming, method, path);

    const start = Date.now();

    const response = await ctx.next();

    log(
      fn,
      LogPrefix.Outgoing,
      method,
      path,
      response.status,
      time(start),
    );

    return response;
  };
}
