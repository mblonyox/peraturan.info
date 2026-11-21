import PresidenRIlogo from "@/assets/PresidenRIlogo.png?inline";

interface Props {
  jenis: string;
  nomor: string;
  judul: string;
}

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function Thumbnail({ jenis, nomor, judul }: Props) {
  return (
    <div
      style={{
        width: 540,
        height: 890,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        backgroundColor: "white",
        filter: "blur(2.5)",
      }}
    >
      <img
        src={PresidenRIlogo}
        style={{ marginTop: 80, width: 100, height: 100 }}
      />
      <span>{jenis.toUpperCase()} REPUBLIK INDONESIA</span>
      <span>{nomor.toUpperCase()}</span>
      <span>TENTANG</span>
      <span>{judul.toUpperCase()}</span>
      <div>DENGAN RAHMAT TUHAN YANG MAHA ESA</div>
      <div>PRESIDEN REPUBLIK INDONESIA,</div>
      <div
        style={{
          width: 480,
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ width: "15%" }}>Menimbang</div>
        <span>:</span>
        <div style={{ width: "75%" }}>{loremIpsum}</div>
      </div>
      <div
        style={{
          width: 480,
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ width: "15%" }}>Mengingat</div>
        <span>:</span>
        <div style={{ width: "75%" }}>{loremIpsum}</div>
      </div>
    </div>
  );
}
