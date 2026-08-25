import IconGithub from "@components/icons/github";

const Footer = () => {
  return (
    <div class="mt-8 flex w-full justify-center border-t border-(--sl-color-gray-5) p-8 text-sm">
      <div class="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div class="font-bold text-(--sl-color-white)">Qurescent</div>
          <p class="mt-1 text-(--sl-color-gray-3)">
            Tajweed font courtesy of{" "}
            <a href="https://qul.tarteel.ai" class="underline">
              QUL / qul.tarteel.ai
            </a>
            .
          </p>
        </div>
        <a
          href="https://github.com/kihonq/qurescent"
          aria-label="Qurescent on GitHub"
          class="inline-block text-(--sl-color-gray-2)"
        >
          <IconGithub />
        </a>
      </div>
    </div>
  );
};

export default Footer;
