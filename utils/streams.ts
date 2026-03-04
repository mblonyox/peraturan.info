import { type Transform, Writable } from "node:stream";

export const toTransformStream = (stream: Transform): TransformStream => {
  const readable = ReadableStream.from(stream);
  const writable = Writable.toWeb(stream);
  return {
    readable,
    writable,
  };
};
