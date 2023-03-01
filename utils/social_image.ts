import { dirname, fromFileUrl, resolve } from "$std/path/mod.ts";
import { decode, Image, TextLayout } from "$imagescript/mod.ts";

const getFont = () =>
  Deno.readFile(
    resolve(
      dirname(fromFileUrl(import.meta.url)),
      "../static/fonts/Roboto-Regular.ttf",
    ),
  );

const getBackground = () =>
  Deno.readFile(
    resolve(
      dirname(fromFileUrl(import.meta.url)),
      "../static/backgrounds/subtle-prism.png",
    ),
  );

const getLogo = () =>
  Deno.readFile(
    resolve(
      dirname(fromFileUrl(import.meta.url)),
      "../static/icons/pwa-512x512.png",
    ),
  );

export const generate_social_image = async (
  { title, description, url, format }: {
    title: string;
    description: string;
    url: string;
    format?: "png" | "jpg" | "webp";
  },
) => {
  const image = new Image(1280, 640);
  const background = await decode(await getBackground()) as Image;
  const logo = await decode(await getLogo()) as Image;
  const fontBytes = await getFont();
  const textTitle = await Image.renderText(
    fontBytes,
    28,
    title,
    Image.rgbToColor(255, 255, 255),
    new TextLayout({
      maxWidth: 960,
      verticalAlign: "center",
      wrapStyle: "word",
    }),
  );
  const textDescription = await Image.renderText(
    fontBytes,
    14,
    description,
    Image.rgbToColor(255, 255, 255),
    new TextLayout({
      maxWidth: 720,
      verticalAlign: "center",
      wrapStyle: "word",
    }),
  );
  const textUrl = await Image.renderText(fontBytes, 11, url);
  const result = image.composite(background, 0, 0).composite(
    logo.resize(256, Image.RESIZE_AUTO).rotate(30) as Image,
    960,
    -80,
  )
    .composite(
      textTitle,
      580 - (textTitle.width / 2),
      160,
    ).composite(
      textDescription,
      580 - (textDescription.width / 2),
      180 + textTitle.height,
    ).composite(textUrl, 20, 600);
  switch (format) {
    case "jpg":
      return result.encodeJPEG();
    // case "webp":
    //   return result.encodeWEBP();
    default:
      return result.encode();
  }
};
