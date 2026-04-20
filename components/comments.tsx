import Script from "next/script";

export default function Comments() {
  return (
    <div className="card card-border my-2 lg:my-3">
      <div className="card-body">
        <h2 className="card-title text-2xl">Komentar!</h2>
        <div
          id="mouthful-comments"
          data-url="https://mouthful.inoxsegar.com"
          data-domain="peraturan.info"
        />
        <Script src="/mouthful-client.js" />
      </div>
    </div>
  );
}
