import logoBase64 from "@/assets/logo.png?inline";
import { ellipsis } from "@/lib/utils/string";

interface Props {
  title: string;
  description: string;
  url: string;
  thumbnail?: ArrayBuffer;
}

export default function OpenGraphImage({
  title,
  description,
  url,
  thumbnail,
}: Props) {
  const thumbnailSrc = thumbnail
    ? `data:image/png;base64,${Buffer.from(thumbnail).toString("base64")}`
    : undefined;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-around",
        background: "linear-gradient(to left, #212529, #343a40, #2b3035)",
      }}
    >
      <div
        style={{
          marginLeft: "10%",
          marginRight: "10%",
          fontSize: 32,
          fontWeight: "bold",
          color: "#ffffff",
          lineClamp: 3,
        }}
      >
        {ellipsis(title, 200)}
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          marginLeft: "10%",
          marginRight: "10%",
          justifyContent: "space-between",
          gap: "10%",
        }}
      >
        {thumbnailSrc && (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 210,
              height: 330,
            }}
          >
            <div
              style={{
                width: 210,
                height: 330,
                backgroundColor: "white",
                border: "solid 1px",
                transform: "rotate(10deg)",
                transformOrigin: "bottom left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <div
              style={{
                width: 210,
                height: 330,
                backgroundColor: "white",
                border: "solid 1px",
                transform: "rotate(5deg)",
                transformOrigin: "bottom left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <img
              src={thumbnailSrc}
              alt=""
              style={{
                width: 210,
                height: 330,
                position: "relative",
                top: 0,
                left: 0,
                border: "solid 1px",
              }}
            />
          </div>
        )}
        <div
          style={{
            alignSelf: "center",
            textAlign: "center",
            fontSize: 48,
            color: "#ffffff",
            padding: 20,
            border: "2px solid",
            borderRadius: 10,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          alignSelf: "center",
          fontSize: 16,
          color: "#ffffff",
        }}
      >
        {url}
      </div>
      <img
        src={logoBase64}
        alt=""
        style={{
          width: 196,
          height: 196,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
    </div>
  );
}
