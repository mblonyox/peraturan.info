interface Props {
  jenis: string;
  nomor: string;
  judul: string;
}

export default function Thumbnail({ jenis, nomor, judul }: Props) {
  return (
    <div
      style={{
        width: 540,
        height: 890,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          margin: 50,
          height: 70,
          width: 70,
          backgroundColor: "grey",
          alignSelf: "center",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          lineHeight: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <span>{jenis.toUpperCase()} REPUBLIK INDONESIA</span>
        <span>{nomor.toUpperCase()}</span>
        <span>TENTANG</span>
        <span>{judul.toUpperCase()}</span>
      </div>
      <div
        style={{
          height: 21,
          width: "80%",
          backgroundColor: "grey",
          alignSelf: "center",
        }}
      />
      <div
        style={{
          height: 21,
          width: "60%",
          backgroundColor: "grey",
          alignSelf: "center",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 21,
            width: "20%",
            backgroundColor: "grey",
          }}
        />
        <span>:</span>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "80%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "80%",
              backgroundColor: "grey",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 21,
            width: "20%",
            backgroundColor: "grey",
          }}
        />
        <span>:</span>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "80%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "100%",
              backgroundColor: "grey",
            }}
          />
          <div
            style={{
              height: 21,
              width: "80%",
              backgroundColor: "grey",
            }}
          />
        </div>
      </div>
    </div>
  );
}
