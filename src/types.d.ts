declare module "pixl-resize" {
  export function resize(
    input: Buffer,
    options: {
      width: number;
      height: number;
      mode?: "contain" | "cover";
      fit?: "contain" | "cover";
    },
  ): Buffer;
}
