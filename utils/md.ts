import { slug } from "github-slugger";
import type {
  MarkedExtension,
  RendererExtension,
  TokenizerAndRendererExtension,
  Tokens,
} from "marked";
import { use as markedUse } from "marked";

export type PeraturanToken = Tokens.Generic & {
  nomor?: string;
  judul?: string;
  tokens?: PeraturanToken[];
};

const rules = {
  judul: /^([^]+?)\nNOMOR (.+)\nTENTANG\n([^]+?)(?:\n{2,}|$)/,
  frasaJabatan: /^DENGAN RAHMAT TUHAN YANG MAHA ESA\n\n([^]+?,)(?:\n{2,}|$)/,
  konsideran: /^Menimbang[ \t]*:[ \t]*\n([^]+?)(?:\n{2,}|$)/,
  dasarHukum: /^Mengingat[ \t]*:[ \t]*\n([^]+?)(?:\n{2,}|$)/,
  diktum: /^(Dengan[^]+\n)?MEMUTUSKAN:\n/,
  mencabut: /^Mencabut[ \t]*:[ \t]*\n([^]+?)(?:\n{2,}|$)/,
  menetapkan: /^Menetapkan[ \t]*:[ \t]*\n([^]+?)(?:\n{2,}|$)/,
  buku: /^((BUKU [A-Z ]+)\n[^]+?)\n\n([^]+?)(?=\nBUKU [A-Z ]+\n|\n{3,}|$)/,
  bab: /^((BAB [MDCLXVI]+)\n[^]+?)\n\n([^]+?)(?=\nBAB [MDCLXVI]+\n|\n{3,}|$)/,
  bagian:
    /^((Bagian [\w ]+?)\n[^]+?)\n\n([^]+?)(?=\nBagian [\w ]+?\n|\n{3,}|$)/,
  paragraf: /^((Paragraf \d+)\n[^]+?)\n\n([^]+?)(?=\nParagraf \d+\n|\n{3,}|$)/,
  pasal: /^(Pasal \d+[a-z]*)\n([^]+?)(?=\nPasal \d+[a-z]*\n|\n{3,}|$)/,
  pasalRomawi: /^(Pasal [MDCLXVI]+)\n([^]+?)(?=\nPasal [MDCLXVI]+\n|\n{3,}|$)/,
  ayat: /^(\(\d+[a-z]*\))[ \t]([^]+?)(?=\n\(\d+[a-z]*\)[ \t]|\n{2,}|$)/,
  butir: /^( {0,6})((?:1|a)[\)\.])[ \t][^\n]+?(?=\n|$)/,
};

const judul: TokenizerAndRendererExtension = {
  name: "judul",
  level: "block",
  tokenizer(src) {
    const cap = rules.judul.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "judul",
        raw: cap[0],
        jenis: cap[1],
        nomor: cap[2],
        judul: cap[3],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[0].trim().replaceAll("\n", "<br/>"),
        token.tokens,
      );
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parseInline(token.tokens ?? []);
    return `<h1 class="judul">${content}</h1><br/>`;
  },
};

const frasaJabatan: TokenizerAndRendererExtension = {
  name: "frasa-jabatan",
  level: "block",
  tokenizer(src) {
    const cap = rules.frasaJabatan.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "frasa-jabatan",
        raw: cap[0],
        jabatan: cap[1],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[1].trim().replaceAll("\n", "<br/>"),
        token.tokens,
      );
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parseInline(token.tokens ?? []);
    return `<p class="frasa-drtyme">DENGAN RAHMAT TUHAN YANG MAHA ESA</p><br/><p class="jabatan-pembentuk">${content}</p><br/>`;
  },
};

const konsideran: TokenizerAndRendererExtension = {
  name: "konsideran",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.konsideran.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "konsideran",
        raw: cap[0],
        tokens: [],
      };
      this.lexer.blockTokens(cap[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parse(token.tokens ?? []);
    return `<table class="konsideran"><tbody><tr><th>Menimbang</th><td>:</td><td>${content}</td></tr></tbody></table><br/>`;
  },
};

const dasarHukum: TokenizerAndRendererExtension = {
  name: "dasar-hukum",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.dasarHukum.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "dasar-hukum",
        raw: cap[0],
        tokens: [],
      };
      this.lexer.blockTokens(cap[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parse(token.tokens ?? []);
    return `<table class="dasar-hukum"><tbody><tr><th>Mengingat</th><td>:</td><td>${content}</td></tr></tbody></table><br/>`;
  },
};

const diktum: TokenizerAndRendererExtension = {
  name: "diktum",
  level: "block",
  tokenizer(src) {
    const cap = rules.diktum.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "diktum",
        raw: cap[0],
        tokens: [],
      };
      if (cap[1]) {
        this.lexer.inlineTokens(
          cap[1].trim().replaceAll("\n", "<br/>"),
          token.tokens,
        );
      }
      return token;
    }
  },
  renderer(token) {
    const content = '<p class="kata-memutuskan">MEMUTUSKAN:</p>';
    if (token.tokens?.length) {
      const parsed = this.parser.parseInline(token.tokens);
      return `<p class="persetujuan">${parsed}</p>` + content;
    }
    return content;
  },
};

const mencabut: TokenizerAndRendererExtension = {
  name: "mencabut",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.mencabut.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "mencabut",
        raw: cap[0],
        tokens: [],
      };
      this.lexer.blockTokens(cap[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parse(token.tokens ?? []);
    return `<table class="mencabut"><tbody><tr><th>Mencabut</th><td>:</td><td>${content}</td></tr></tbody></table><br/>`;
  },
};

const menetapkan: TokenizerAndRendererExtension = {
  name: "menetapkan",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.menetapkan.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "menetapkan",
        raw: cap[0],
        tokens: [],
      };
      this.lexer.blockTokens(cap[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const content = this.parser.parse(token.tokens ?? []);
    return `<table class="menetapkan"><tbody><tr><th>Menetapkan</th><td>:</td><td>${content}</td></tr></tbody></table><br/>`;
  },
};

const buku: TokenizerAndRendererExtension = {
  name: "buku",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.buku.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "buku",
        raw: cap[0],
        judul: cap[1],
        nomor: cap[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[1].trim().replaceAll("\n", "<br>"),
        token.headers,
      );
      this.lexer.blockTokens(cap[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    const headers = this.parser.parseInline(token.headers);
    const content = this.parser.parse(token.tokens ?? []);
    return `<h2 id="${id}" class="buku">${headers}</h2><br>${content}`;
  },
};

const bab: TokenizerAndRendererExtension = {
  name: "bab",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.bab.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "bab",
        raw: cap[0],
        judul: cap[1],
        nomor: cap[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[1].trim().replaceAll("\n", "<br>"),
        token.headers,
      );
      this.lexer.blockTokens(cap[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    const headers = this.parser.parseInline(token.headers);
    const content = this.parser.parse(token.tokens ?? []);
    return `<h3 id="${id}" class="bab">${headers}</h3><br>${content}`;
  },
};

const bagian: TokenizerAndRendererExtension = {
  name: "bagian",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.bagian.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "bagian",
        raw: cap[0],
        judul: cap[1],
        nomor: cap[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[1].trim().replaceAll("\n", "<br>"),
        token.headers,
      );
      this.lexer.blockTokens(cap[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    const headers = this.parser.parseInline(token.headers);
    const content = this.parser.parse(token.tokens ?? []);
    return `<h4 id="${id}" class="bagian">${headers}</h4><br>${content}`;
  },
};

const paragraf: TokenizerAndRendererExtension = {
  name: "paragraf",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.paragraf.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "paragraf",
        raw: cap[0],
        judul: cap[1],
        nomor: cap[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(
        cap[1].trim().replaceAll("\n", "<br>"),
        token.headers,
      );
      this.lexer.blockTokens(cap[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    const headers = this.parser.parseInline(token.headers);
    const content = this.parser.parse(token.tokens ?? []);
    return `<h5 id="${id}" class="paragraf">${headers}</h5><br>${content}`;
  },
};

const pasal: TokenizerAndRendererExtension = {
  name: "pasal",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.pasal.exec(src) || rules.pasalRomawi.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "pasal",
        raw: cap[0],
        nomor: cap[1],
        tokens: [],
      };
      this.lexer.state.top = false;
      this.lexer.blockTokens(cap[2], token.tokens);
      token.tokens?.forEach((token: PeraturanToken) => {
        if (token.type === "ayat") token.nomorPasal = token.nomor;
      });
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    const content = this.parser.parse(token.tokens ?? []);
    return `<h6 id="${id}" class="pasal">${token.nomor}</h6><div class="isi-pasal">${content}</div><br>`;
  },
};

const ayat: TokenizerAndRendererExtension = {
  name: "ayat",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.ayat.exec(src);
    if (cap) {
      const token: PeraturanToken = {
        type: "ayat",
        raw: cap[0],
        nomor: cap[1],
        nomorPasal: null,
        tokens: [],
      };
      this.lexer.state.top = false;
      this.lexer.blockTokens(cap[2], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(`${token.nomorPasal} ayat ${token.nomor}`);
    const content = this.parser.parse(token.tokens ?? []);
    return `<div id="${id}" class="ayat"><span>${token.nomor}</span>${content}</div>`;
  },
};

const butirList: TokenizerAndRendererExtension = {
  name: "butir-list",
  level: "block",
  tokenizer(src: string) {
    const cap = rules.butir.exec(src);
    if (!cap) return;
    const indent = cap[1];
    const marker = cap[2];
    const suffix = marker.slice(-1);
    const alphaNumeric = /\d+/.test(marker) ? "\\d+" : "[a-z]+";
    const bullet = `${indent}${alphaNumeric}${RegExp.escape(suffix)}`;
    const list = {
      type: "butir-list",
      raw: "",
      items: [] as unknown[],
    };
    const re = new RegExp(
      `^(${bullet})[ \t]([^]+?)(?=${bullet}[ \t]|\\n{2,}|$)`,
    );
    while (src) {
      const cap = re.exec(src);
      if (!cap) break;
      const item = {
        type: "butir-item",
        raw: cap[0],
        marker: cap[1].trim(),
        tokens: [],
      };
      this.lexer.state.top = true;
      this.lexer.blockTokens(cap[2], item.tokens);
      list.items.push(item);
      list.raw += item.raw;
      src = src.slice(item.raw.length);
    }
    if (list.raw.length) return list;
  },
  renderer(token) {
    const content = this.parser.parse(token.items);
    return `<div class="butir-container">${content}</div>`;
  },
  childTokens: ["items"],
};

const butirItem: RendererExtension = {
  name: "butir-item",
  renderer(token) {
    const content = this.parser.parse(token.tokens ?? []);
    return `<div data-marker="${token.marker}" class="butir-item">${content}</div>`;
  },
};

const extension: MarkedExtension = {
  extensions: [
    judul,
    frasaJabatan,
    konsideran,
    dasarHukum,
    diktum,
    mencabut,
    menetapkan,
    buku,
    bab,
    bagian,
    paragraf,
    pasal,
    ayat,
    butirList,
    butirItem,
  ],
};

export const createMarked = () => markedUse(extension);
