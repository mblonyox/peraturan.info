import { Transform } from "node:stream";

export const toTransformStream = (transform: Transform) => {
  return Transform.toWeb(transform) as TransformStream;
};
