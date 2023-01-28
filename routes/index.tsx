import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Peraturan.deno.dev</title>
        <meta
          name="description"
          content="Database Peraturan Perundang-undangan Republik Indonesia"
        />
      </Head>
      <div>
        <h1>
          Peraturan<span style={{ color: "var(--muted-color)" }}>
            .deno.dev
          </span>
        </h1>
        <p>
          Selamat datang di situs Database Peraturan Perundang-undangan Republik
          Indonesia.
        </p>
      </div>
    </>
  );
}
