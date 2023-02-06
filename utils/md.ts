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
    return `<h1 class="judul">${
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
    return `<p class="frasa-drtyme">DENGAN RAHMAT TUHAN YANG MAHA ESA</p><br/><p class="jabatan-pembentuk">${
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
      /^(Dengan[\s\S]+)?\n?MEMUTUSKAN:\nMenetapkan *:\n([\s\S]+?)(?:\n{2,}|$)/,
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
      ? `<p class="persetujuan">${
        this.parser.parseInline(token.persetujuan ?? [])
      }</p><br/>`
      : "") +
      `<p class="kata-memutuskan">MEMUTUSKAN:</p><table class="diktum"><tbody><tr><th><p>Menetapkan</p></th><td>:</td><td><p>${
        this.parser.parseInline(token.judul ?? [])
      }</p></td></tr></tbody></table><br/>`;
  },
};

const bab: marked.TokenizerAndRendererExtension = {
  name: "bab",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^((BAB [MDCLXVI]+)\n[\s\S]*?)\n\n([\s\S]+?)(?=\nBAB [MDCLXVI]+\n|$)/,
    );
    if (match) {
      const token = {
        type: "bab",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        tokens: [],
      };
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.nomor);
    return `<h2 id="${id}" class="bab">${
      token.judul.replaceAll("\n", "<br>")
    }</h2><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const bagian: marked.TokenizerAndRendererExtension = {
  name: "bagian",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^((Bagian .+?)\n[\s\S]+?)\n\n([\s\S]+?)(?=\nBagian [\s\w]+?\n|$)/,
    );
    if (match) {
      const token = {
        type: "bagian",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        tokens: [],
      };
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.nomor);
    return `<h3 id="${id}" class="bagian">${
      token.judul.replaceAll("\n", "<br>")
    }</h3><br>${this.parser.parse(token.tokens ?? [])}`;
  },
};

const paragraf: marked.TokenizerAndRendererExtension = {
  name: "paragraf",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^((Paragraf \d+)\n[\s\S]+?)\n\n([\s\S]+?)(?=\nParagraf \d+\n|$)/,
    );
    if (match) {
      const token = {
        type: "paragraf",
        raw: match[0],
        judul: match[1],
        nomor: match[2],
        tokens: [],
      };
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    }
  },
  renderer(token) {
    const id = this.parser.slugger.slug(token.nomor);
    return `<h4 id="${id}" class="paragraf">${
      token.judul.replaceAll("\n", "<br>")
    }</h4><br>${this.parser.parse(token.tokens ?? [])}`;
  },
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
    const id = this.parser.slugger.slug(token.nomor);
    return `<h5 id="${id}" class="pasal">${token.nomor}</h5><div class="isi-pasal">${
      this.parser.parse(token.tokens ?? [])
    }</div><br>`;
  },
};

const ayat: marked.TokenizerAndRendererExtension = {
  name: "ayat",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(\(\d+\)) ([\s\S]+?)(?=\n\(\d+\) |\n{2,}|$)/,
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
    const id = this.parser.slugger.slug(
      `${token.nomorPasal} ayat ${token.nomor}`,
    );
    return `<div id="${id}" class="ayat"><span>${token.nomor}</span>${
      this.parser.parse(token.tokens ?? [])
    }</div>`;
  },
};

const butirList: marked.TokenizerAndRendererExtension = {
  name: "butir-list",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^( {0,6})((?:\d+|[a-z]+)[\)\.])[ \t].+?(?=\n|$)/,
    );
    if (!match) return;
    const numberStyle = /^\d+/.test(match[2]);
    const marker = match[2].slice(-1);
    const list = {
      type: "butir-list",
      style: numberStyle ? "number" : "lower-latin",
      marker,
      raw: "",
      items: [] as unknown[],
    };
    const itemBullet = match[1] + (numberStyle ? "\\d+" : "[a-z]+") +
      `\\${marker}[ \\t]`;
    const itemRegex = new RegExp(
      `${itemBullet}([\\s\\S]+?)(?=${itemBullet}|\\n{2,}|$)`,
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

const butirItem: marked.RendererExtension = {
  name: "butir-item",
  renderer(token) {
    return `<li>${this.parser.parse(token.tokens ?? [])}</li>`;
  },
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
    ayat,
    butirList,
    butirItem,
  ],
};
