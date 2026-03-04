import { Transform } from "node:stream";

export function toTransformStream(transform: Transform) {
  const { readable, writable } = Transform.toWeb(transform);
  const transformStream = new TransformStream();
  readable.pipeTo(transformStream.writable);
  transformStream.readable.pipeTo(writable);
  return transformStream;
}
