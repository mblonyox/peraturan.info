import logoBase64 from "@/assets/logo.png?inline";
import { ellipsis } from "@/lib/utils/string";

interface Props {
  title: string;
  description: string;
  url: string;
}

export default function DetailOpenGraphImage({
  title,
  description,
  url,
}: Props) {
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
      <img
        src={logoBase64}
        alt=""
        style={{
          width: 256,
          height: 256,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
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
          fontSize: 48,
          marginLeft: "10%",
          marginRight: "10%",
          color: "#ffffff",
        }}
      >
        {description}
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
    </div>
  );
}
