// deno-lint-ignore-file no-unused-vars
import PDFiumModule from "@/lib/pdfium/pdfium.js";

type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

const REVERSE_BYTE_ORDER = 0x10;
const RENDER_ANNOT = 0x01;
const LAST_ERROR = {
  SUCCESS: 0,
  UNKNOWN: 1,
  FILE: 2,
  FORMAT: 3,
  PASSWORD: 4,
  SECURITY: 5,
  PAGE: 6,
};

const I8 = Int8Array;
const I16 = Int16Array;
const I32 = Int32Array;
const U8 = Uint8Array;
const CH = U8;
const U16 = Uint16Array;
const U32 = Uint32Array;
const F32 = Float32Array;
const F64 = Float64Array;

const heap = (J: TypedArrayConstructor, s: number) => {
  let E: unknown[] = [];
  switch (J) {
    case Int8Array:
      E = Module.HEAP8;
      break;
    case Int16Array:
      E = Module.HEAP16;
      break;
    case Int32Array:
      E = Module.HEAP32;
      break;
    case Uint8Array:
      E = Module.HEAPU8;
      break;
    case Uint16Array:
      E = Module.HEAPU16;
      break;
    case Uint32Array:
      E = Module.HEAPU32;
      break;
    case Float32Array:
      E = Module.HEAPF32;
      break;
    case Float64Array:
      E = Module.HEAPF64;
      break;
  }
  const Z = J.BYTES_PER_ELEMENT;
  const m = Module.asm.malloc(s * Z);

  const header = { s, J, Z, E, m, free: () => Module.asm.free(m) };
  const datas = Array(s).fill(null).map((_, i) => ({
    p: m + (i * Z),
    get v() {
      return E[m / Z + i];
    },
  }));
  return { header, datas };
};

const H = <T, R extends T[]>(
  typedArray: TypedArrayConstructor,
  size: number,
  defaultValue: R,
) =>
(
  f: (...p: number[]) => unknown,
) => {
  const { header, datas } = heap(typedArray, size);
  const v = f(...datas.map((x) => x.p));
  if (!v) {
    header.free();
    return defaultValue;
  }
  const r = datas.map((x) => x.v as T);
  header.free();
  return r;
};

const Module = await PDFiumModule();

const Init = Module.cwrap("PDFium_Init");
const RenderPageBitmap = Module.cwrap("FPDF_RenderPageBitmap", "", [
  "number",
  "number",
  "number",
  "number",
  "number",
  "number",
  "number",
  "number",
]);

const Bitmap_FillRect = Module.cwrap("FPDFBitmap_FillRect", "", [
  "number",
  "number",
  "number",
  "number",
  "number",
  "number",
]);
const Bitmap_CreateEx = Module.cwrap("FPDFBitmap_CreateEx", "number", [
  "number",
  "number",
  "number",
  "number",
  "number",
]);
const Bitmap_Destroy = Module.cwrap("FPDFBitmap_Destroy", "", ["number"]);
const LoadPage = Module.cwrap("FPDF_LoadPage", "number", ["number", "number"]);
const ClosePage = Module.cwrap("FPDF_ClosePage", "", ["number"]);
const LoadMemDocument = Module.cwrap("FPDF_LoadMemDocument", "number", [
  "number",
  "number",
  "string",
]);
const GetPageSizeByIndex = Module.cwrap("FPDF_GetPageSizeByIndex", "number", [
  "number",
  "number",
  "number",
  "number",
]);
const GetLastError = Module.cwrap("FPDF_GetLastError", "number");
const GetPageCount = Module.cwrap("FPDF_GetPageCount", "number", ["number"]);
const CloseDocument = Module.cwrap("FPDF_CloseDocument", "", ["number"]);
const DestroyLibrary = Module.cwrap("FPDF_DestroyLibrary");

export class Document {
  private bufferPtr: number;
  private docPtr: number;
  private pageCount: number;

  constructor(bytes: Uint8Array) {
    Init();
    this.bufferPtr = Module.asm.malloc(bytes.length);
    Module.HEAPU8.set(bytes, this.bufferPtr);
    this.docPtr = LoadMemDocument(this.bufferPtr, bytes.length, "");
    this.pageCount = GetPageCount(this.docPtr);
  }

  getPage(index: number) {
    if (index < 0 || index >= this.pageCount) return null;
    return new Page(index, this.docPtr);
  }

  getLastError() {
    const lastError = GetLastError();

    switch (lastError) {
      case LAST_ERROR.SUCCESS:
        return "success";

      case LAST_ERROR.UNKNOWN:
        return "unknown error";

      case LAST_ERROR.FILE:
        return "file not found or could not be opened";

      case LAST_ERROR.FORMAT:
        return "file not in PDF format or corrupted";

      case LAST_ERROR.PASSWORD:
        return "password required or incorrect password";

      case LAST_ERROR.SECURITY:
        return "unsupported security scheme";

      case LAST_ERROR.PAGE:
        return "page not found or content error";

      default:
        return "unknown error";
    }
  }

  destroy() {
    Module.asm.free(this.bufferPtr);
    CloseDocument(this.docPtr);
    DestroyLibrary();
  }
}

export class Page {
  private width: number;
  private height: number;
  private pagePtr: number;

  constructor(index: number, docPtr: number) {
    const [width, height] = H(F64, 2, [-1, -1])((w: number, h: number) =>
      GetPageSizeByIndex(docPtr, index, w, h)
    ).map((v) => parseInt(v as string));
    this.width = width;
    this.height = height;
    this.pagePtr = LoadPage(docPtr, index);
  }

  getImageData(): ImageData {
    const flag = REVERSE_BYTE_ORDER | RENDER_ANNOT;
    const bufferSize = this.width * this.height * 4;
    const heap = Module.asm.malloc(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      Module.HEAPU8[heap + i] = 0;
    }
    const bmap = Bitmap_CreateEx(
      this.width,
      this.height,
      4,
      heap,
      this.width * 4,
    );
    Bitmap_FillRect(bmap, 0, 0, this.width, this.height, 0xFFFFFFFF);
    RenderPageBitmap(
      bmap,
      this.pagePtr,
      0,
      0,
      this.width,
      this.height,
      0,
      flag,
    );
    Bitmap_Destroy(bmap);
    const data = new Uint8ClampedArray(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Module.HEAPU8[heap + i];
    }
    Module.asm.free(heap);
    return { colorSpace: "srgb", data, width: this.width, height: this.height };
  }

  destroy() {
    ClosePage(this.pagePtr);
  }
}
