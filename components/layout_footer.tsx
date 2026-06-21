import IconGithub from "./icons/github";

export default function LayoutFooter() {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-8">
      <aside>
        <p>
          {"Crafted\u00a0with\u00a0☕\u00a0by\u00a0"}
          <a
            href="https://mblonyox.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            @mblonyox
          </a>
          {".\u00a0|\u00a0Logo\u00a0created\u00a0by\u00a0"}
          <a
            href="https://id.linkedin.com/in/iqbal-irsyaddi-70988a5a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Iqbal\u00a0Irsyaddi"}
          </a>
          .
        </p>
      </aside>
      <nav className="md:place-self-center md:justify-self-end">
        <a
          href="https://github.com/mblonyox/peraturan.info"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github Repository"
        >
          <IconGithub />
        </a>
      </nav>
    </footer>
  );
}
