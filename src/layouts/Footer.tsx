import IconGithub from "@components/icons/github";

export default function Footer() {
  return (
    <div className="mt-8 flex w-full justify-center border-t border-(--sl-color-gray-5) p-8 text-sm">
      <div className="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="font-bold text-(--sl-color-white)">Qurescent</div>
          <p className="mt-1 max-w-md text-(--sl-color-gray-2)">
            Static techdoc for the Quran. Tajweed fonts via{" "}
            <a href="https://qul.tarteel.ai" className="underline">
              QUL / qul.tarteel.ai
            </a>
            .
          </p>
        </div>
        <a
          href="https://github.com/kihonq/qurescent"
          aria-label="Qurescent on GitHub"
          className="inline-block text-(--sl-color-gray-2)"
        >
          <IconGithub />
        </a>
      </div>
    </div>
  );
}
