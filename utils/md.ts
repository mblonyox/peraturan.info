import { marked } from "marked";

export const pembukaan: marked.TokenizerAndRendererExtension = {
  name: "pembukaan",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(/^\[(\w+)\]\:\n(?:|([\s\S]*?)\n)(?:\n+|$)/);
    if (match) {
      const token = {
        type: "pembukaan",
        raw: match[0],
        nama: match[1],
        tokens: [],
      };
      this.lexer.blockTokens(match[2], token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `<table><tbody><tr><td>${token.nama}</td><td>:</td><td>${
      this.parser.parse(token.tokens ?? [])
    }</td></tr><tbody></table>`;
  },
};

export const bab: marked.TokenizerAndRendererExtension = {
  name: "bab",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(BAB [MDCLXVI]+\n[\s\S]*?)\n\n([\s\S]+?)(?=BAB [MDCLXVI]+|$)/,
    );
    if (match) {
      const token = {
        type: "bab",
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
    return `<div id="${id}" class="bab"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
};

export const bagian: marked.TokenizerAndRendererExtension = {
  name: "bagian",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Bagian [\s\w]+?\n[\s\S]*?)\n\n([\s\S]+?)(?=Bagian [\s\w]+?|$)/,
    );
    if (match) {
      const token = {
        type: "bagian",
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
    return `<div id="${id}" class="bagian"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
};

export const paragraf: marked.TokenizerAndRendererExtension = {
  name: "paragraf",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Paragraf \d+\n[\s\S]*?)\n\n([\s\S]+?)(?=Paragraf \d+|$)/,
    );
    if (match) {
      const token = {
        type: "paragraf",
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
    return `<div id="${id}" class="paragraf"><center>${
      this.parser.parse(token.judul ?? [])
    }</center><br />${this.parser.parse(token.isi ?? [])}</div>`;
  },
};

export const pasal: marked.TokenizerAndRendererExtension = {
  name: "pasal",
  level: "block",
  tokenizer(src: string, _tokens: marked.Token[] | marked.TokensList) {
    const match = src.match(
      /^(Pasal \d+)\n([\s\S]+?)(?=pasal \d+|$)/,
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
};
