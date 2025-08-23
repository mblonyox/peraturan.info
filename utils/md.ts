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

const judul: TokenizerAndRendererExtension = {
  name: "judul",
  level: "block",
  tokenizer(src) {
    const match = src.match(
      /^(([\s\S]+?)\nNOMOR +(.+)\nTENTANG\n([\s\S]+?))(?:\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "judul",
        raw: match[0],
        jenis: match[2],
        nomor: match[3],
        judul: match[4],
        tokens: this.lexer.inlineTokens(match[1].replaceAll("\n", "<br/>"), []),
      };
      return token;
    }
  },
  renderer(token) {
    return `<h1 class="judul">${
      this.parser.parseInline(token.tokens ?? [])
    }</h1><br/>`;
  },
};

const frasaJabatan: TokenizerAndRendererExtension = {
  name: "frasa-jabatan",
  level: "block",
  tokenizer(src) {
    const match = src.match(
      /^DENGAN RAHMAT TUHAN YANG MAHA ESA\n\n([\s\S]+?,)(?:\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "frasa-jabatan",
        raw: match[0],
        jabatan: match[1],
        tokens: this.lexer.inlineTokens(match[1].replaceAll("\n", "<br/>"), []),
      };
      return token;
    }
  },
  renderer(token) {
    return `<p class="frasa-drtyme">DENGAN RAHMAT TUHAN YANG MAHA ESA</p><br/><p class="jabatan-pembentuk">${
      this.parser.parseInline(token.tokens ?? [])
    }</p><br/>`;
  },
};

const konsideran: TokenizerAndRendererExtension = {
  name: "konsideran",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(/^Menimbang[ \t]*:[ \t]*\n([\s\S]+?\n)(?:\n+|$)/);
    if (match) {
      const token = {
        type: "konsideran",
        raw: match[0],
        tokens: [],
      };
      this.lexer.blockTokens(match[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `<table class="konsideran"><tbody><tr><th>Menimbang</th><td>:</td><td>${
      this.parser.parse(token.tokens ?? [])
    }</td></tr></tbody></table><br/>`;
  },
};

const dasarHukum: TokenizerAndRendererExtension = {
  name: "dasar-hukum",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(/^Mengingat[ \t]*:[ \t]*\n([\s\S]+?\n)(?:\n+|$)/);
    if (match) {
      const token = {
        type: "dasar-hukum",
        raw: match[0],
        tokens: [],
      };
      this.lexer.blockTokens(match[1], token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `<table class="dasar-hukum"><tbody><tr><th>Mengingat</th><td>:</td><td>${
      this.parser.parse(token.tokens ?? [])
    }</td></tr></tbody></table><br/>`;
  },
};

const diktum: TokenizerAndRendererExtension = {
  name: "diktum",
  level: "block",
  tokenizer(src) {
    const match = src.match(
      /^(Dengan[\s\S]+\n)?MEMUTUSKAN:\n(?:Mencabut[ \t]*:[ \t]*\n([\s\S]+?\n)\n)?Menetapkan[ \t]*:[ \t]*\n([\s\S]+?\n)(?:\n+|$)/,
    );
    if (match) {
      const token = {
        type: "diktum",
        raw: match[0],
        persetujuan: this.lexer.inlineTokens(
          match[1]?.replaceAll("\n", "<br/>"),
          [],
        ),
        mencabut: this.lexer.inlineTokens(match[2], []),
        menetapkan: this.lexer.inlineTokens(match[3], []),
      };
      return token;
    }
  },
  renderer(token) {
    return [
      token.persetujuan.length
        ? `<p class="persetujuan">${
          this.parser.parseInline(token.persetujuan ?? [])
        }</p>`
        : "",
      '<p class="kata-memutuskan">MEMUTUSKAN:</p>',
      token.mencabut.length
        ? `<table><tbody><tr><th><p>Mencabut</p></th><td>:</td><td><p>${
          this.parser.parseInline(token.mencabut ?? [])
        }</p></td></tr></tbody></table><br/>`
        : "",
      `<table><tbody><tr><th><p>Menetapkan</p></th><td>:</td><td><p>${
        this.parser.parseInline(token.menetapkan ?? [])
      }</p></td></tr></tbody></table><br/>`,
    ].join("");
  },
};

const buku: TokenizerAndRendererExtension = {
  name: "buku",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^((BUKU [A-Z ]+)\n[\s\S]*?)\n\n([\s\S]+?\n)(?=BUKU [A-Z ]+\n|\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "buku",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(match[1].replaceAll("\n", "<br>"), token.headers);
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    return `<h2 id="${id}" class="buku">${
      this.parser.parseInline(token.headers)
    }</h2><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const bab: TokenizerAndRendererExtension = {
  name: "bab",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^((BAB [MDCLXVI]+)\n[\s\S]*?)\n\n([\s\S]+?\n)(?=BAB [MDCLXVI]+\n|\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "bab",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(match[1].replaceAll("\n", "<br>"), token.headers);
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    return `<h3 id="${id}" class="bab">${
      this.parser.parseInline(token.headers)
    }</h3><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const bagian: TokenizerAndRendererExtension = {
  name: "bagian",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^((Bagian .+?)\n[\s\S]+?)\n\n([\s\S]+?\n)(?=Bagian [\s\w]+?\n|\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "bagian",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(match[1].replaceAll("\n", "<br>"), token.headers);
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    return `<h4 id="${id}" class="bagian">${
      this.parser.parseInline(token.headers)
    }</h4><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const paragraf: TokenizerAndRendererExtension = {
  name: "paragraf",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^((Paragraf \d+)\n[\s\S]+?)\n\n([\s\S]+?\n)(?=Paragraf \d+\n|\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "paragraf",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        headers: [],
        tokens: [],
      };
      this.lexer.inlineTokens(match[1].replaceAll("\n", "<br>"), token.headers);
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    return `<h5 id="${id}" class="paragraf">${
      this.parser.parseInline(token.headers)
    }</h5><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const pasal: TokenizerAndRendererExtension = {
  name: "pasal",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^(Pasal \d+)\n([\s\S]+?\n)(?=Pasal \d+\n|\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "pasal",
        raw: match[0],
        nomor: match[1],
        tokens: [],
      };
      this.lexer.state.top = false;
      this.lexer.blockTokens(match[2], token.tokens);
      // deno-lint-ignore no-explicit-any
      token.tokens.forEach((token: any) => {
        if (token.type === "ayat") token.nomorPasal = match[1];
      });
      return token;
    }
  },
  renderer(token) {
    const id = slug(token.nomor);
    return `<h6 id="${id}" class="pasal">${token.nomor}</h6><div class="isi-pasal">${
      this.parser.parse(token.tokens ?? [])
    }</div><br>`;
  },
};

const ayat: TokenizerAndRendererExtension = {
  name: "ayat",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^(\(\d+\))[ \t]([\s\S]+?\n)(?=\(\d+\)[ \t]|\n+|$)/,
    );
    if (match) {
      const token = {
        type: "ayat",
        raw: match[0],
        nomor: match[1],
        nomorPasal: null,
        tokens: [],
      };
      this.lexer.state.top = false;
      this.lexer.blockTokens(match[2], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = slug(
      `${token.nomorPasal} ayat ${token.nomor}`,
    );
    return `<div id="${id}" class="ayat"><span>${token.nomor}</span>${
      this.parser.parse(token.tokens ?? [])
    }</div>`;
  },
};

const butirList: TokenizerAndRendererExtension = {
  name: "butir-list",
  level: "block",
  tokenizer(src: string) {
    const match = src.match(
      /^( {0,6})((?:\d{1,2}|[a-z]{1,2})[\)\.])[ \t].+?(?=\n|$)/,
    );
    if (!match) return;
    const numberStyle = /^\d{1,2}/.test(match[2]);
    const marker = match[2].slice(-1);
    const list = {
      type: "butir-list",
      style: numberStyle ? "number" : "lower-latin",
      marker,
      raw: "",
      items: [] as unknown[],
    };
    const itemBullet = match[1] + (numberStyle ? "\\d{1,2}" : "[a-z]{1,2}") +
      `\\${marker}[ \\t]`;
    const itemRegex = new RegExp(
      `^${itemBullet}([\\s\\S]+?\n)(?=${itemBullet}|\\n+|$)`,
    );
    while (src) {
      const match = itemRegex.exec(src);
      if (!match) break;
      const raw = match[0];
      src = src.substring(raw.length);
      const item = {
        type: "butir-item",
        raw,
        tokens: [],
      };
      this.lexer.state.top = false;
      this.lexer.blockTokens(match[1], item.tokens);
      list.items.push(item);
      list.raw += raw;
    }
    if (list.raw.length) return list;
  },
  renderer(token) {
    const styleClassName = token.style +
      (token.marker === ")" ? " kurung" : "");
    return `<ol class="butir ${styleClassName}">${
      this.parser.parse(token.items)
    }</ol>`;
  },
  childTokens: ["items"],
};

const butirItem: RendererExtension = {
  name: "butir-item",
  renderer(token) {
    return `<li>${this.parser.parse(token.tokens ?? [])}</li>`;
  },
};

const extension: MarkedExtension = {
  extensions: [
    judul,
    frasaJabatan,
    konsideran,
    dasarHukum,
    diktum,
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
