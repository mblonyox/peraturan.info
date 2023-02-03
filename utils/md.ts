import { marked } from "marked";

const judul: marked.TokenizerAndRendererExtension = {
  name: "judul",
  level: "block",
  tokenizer(src, _tokens: marked.Token[] | marked.TokensList) {
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
    return `<h1 class="judul" style="text-align:center">${
      this.parser.parseInline(token.tokens ?? [])
    }</h1><br/>`;
  },
};

const frasaJabatan: marked.TokenizerAndRendererExtension = {
  name: "frasa-jabatan",
  level: "block",
  tokenizer(src, _tokens: marked.Token[] | marked.TokensList) {
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
    return `<p class="frasa-drtyme" style="text-align:center">DENGAN RAHMAT TUHAN YANG MAHA ESA</p><br/><p class="jabatan-pembentuk" style="text-align:center">${
      this.parser.parseInline(token.tokens ?? [])
    }</p><br/>`;
  },
};

const konsideran: marked.TokenizerAndRendererExtension = {
  name: "konsideran",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(/^Menimbang *:\n([\s\S]+?)(?:\n{2,}|$)/);
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
    return `<table class="konsideran"><tbody><tr><th><p>Menimbang</p></th><td>:</td><td>${
      this.parser.parse(token.tokens ?? [])
    }</td></tr></tbody></table><br/>`;
  },
};

const dasarHukum: marked.TokenizerAndRendererExtension = {
  name: "dasar-hukum",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(/^Mengingat *:\n([\s\S]+?)(?:\n{2,}|$)/);
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
    return `<table class="dasar-hukum"><tbody><tr><th><p>Mengingat</p></th><td>:</td><td>${
      this.parser.parse(token.tokens ?? [])
    }</td></tr></tbody></table><br/>`;
  },
};

const diktum: marked.TokenizerAndRendererExtension = {
  name: "diktum",
  level: "block",
  tokenizer(src, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^((?<=(?:.+\n)*?))\n?MEMUTUSKAN:\nMenetapkan *:\n([\s\S]+?)(?:\n{2,}|$)/,
    );
    if (match) {
      const token = {
        type: "diktum",
        raw: match[0],
        persetujuan: this.lexer.inlineTokens(
          match[1]?.replaceAll("\n", "<br/>"),
          [],
        ),
        judul: this.lexer.inlineTokens(match[2], []),
      };
      return token;
    }
  },
  renderer(token) {
    return (token.persetujuan.length
      ? `<p class="persetujuan" style="text-align:center">${
        this.parser.parseInline(token.persetujuan ?? [])
      }</p><br/>`
      : "") +
      `<p style="text-align:center">MEMUTUSKAN:</p><table class="dasar-hukum"><tbody><tr><th><p>Mengingat</p></th><td>:</td><td><p>${
        this.parser.parseInline(token.judul ?? [])
      }</p></td></tr></tbody></table><br/>`;
  },
};

const bab: marked.TokenizerAndRendererExtension = {
  name: "bab",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(BAB [MDCLXVI]+\n[\s\S]*?)\n\n([\s\S]+?)(?=\nBAB [MDCLXVI]+\n|$)/,
    );
    if (match) {
      const token = {
        type: "bab",
        raw: match[0],
        id: match[1],
        judul: this.lexer.blockTokens(match[1].replaceAll("\n", "<br>"), []),
        isi: this.lexer.blockTokens(match[2], []),
      };

      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.id);
    return `<div id="${id}" class="bab"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
  childTokens: ["judul", "isi"],
};

const bagian: marked.TokenizerAndRendererExtension = {
  name: "bagian",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Bagian [\s\w]+?\n[\s\S]*?)\n\n([\s\S]+?)(?=\nBagian [\s\w]+?\n|$)/,
    );
    if (match) {
      const token = {
        type: "bagian",
        raw: match[0],
        id: match[1],
        judul: this.lexer.blockTokens(match[1].replaceAll("\n", "<br>"), []),
        isi: this.lexer.blockTokens(match[2], []),
      };

      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.id);
    return `<div id="${id}" class="bagian"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
  childTokens: ["judul", "isi"],
};

const paragraf: marked.TokenizerAndRendererExtension = {
  name: "paragraf",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Paragraf \d+\n[\s\S]*?)\n\n([\s\S]+?)(?=\nParagraf \d+\n|$)/,
    );
    if (match) {
      const token = {
        type: "paragraf",
        raw: match[0],
        id: match[1],
        judul: this.lexer.blockTokens(match[1].replaceAll("\n", "<br>"), []),
        isi: this.lexer.blockTokens(match[2], []),
      };

      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.id);
    return `<div id="${id}" class="paragraf"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
  childTokens: ["judul", "isi"],
};

const pasal: marked.TokenizerAndRendererExtension = {
  name: "pasal",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Pasal \d+)\n([\s\S]+?)(?=\nPasal \d+\n|$)/,
    );
    if (match) {
      const token = {
        type: "pasal",
        raw: match[0],
        id: match[1],
        judul: this.lexer.blockTokens(match[1], []),
        isi: this.lexer.blockTokens(match[2], []),
      };

      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.id);
    return `<div id="${id}" class="pasal"><center>${
      this.parser.parse(token.judul ?? [])
    }</center>${this.parser.parse(token.isi ?? [])}</div>`;
  },
  childTokens: ["judul", "isi"],
};

export const peraturan: marked.MarkedExtension = {
  extensions: [
    judul,
    frasaJabatan,
    konsideran,
    dasarHukum,
    diktum,
    bab,
    bagian,
    paragraf,
    pasal,
  ],
  gfm: true,
};
