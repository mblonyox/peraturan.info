export default function Comments() {
  return (
    <div className="card card-border my-2 lg:my-3">
      <div className="card-body">
        <h1 className="card-title text-2xl">Komentar!</h1>
        <div
          id="mouthful-comments"
          data-url="https://mouthful.inoxsegar.com"
          data-domain="peraturan.info"
        />
        <script src="/mouthful-client.js"></script>
      </div>
    </div>
  );
}
