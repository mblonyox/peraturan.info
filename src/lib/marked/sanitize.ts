import type { IOptions } from "sanitize-html";

export const sanitizeOptions: IOptions = {
  allowedAttributes: {
    "*": ["class", "id"],
    div: ["data-marker"],
  },
  allowedClasses: {
    h1: ["judul"],
    p: ["frasa-drtyme", "jabatan-pembentuk", "kata-memutuskan", "persetujuan"],
    table: ["konsideran", "dasar-hukum", "mencabut", "menetapkan"],
    h2: ["buku"],
    h3: ["bab"],
    h4: ["bagian"],
    h5: ["paragraf"],
    h6: ["pasal"],
    div: ["isi-pasal", "ayat", "butir-container", "butir-item", "container"],
  },
};
