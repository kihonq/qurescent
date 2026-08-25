import { For } from "solid-js";

import IconGithub from "@components/icons/github";

const Footer = () => {
  const menus = [
    {
      title: "Documentation",
      children: [
        { name: "Getting Started", href: "#" },
        { name: "Guide", href: "#" },
        { name: "API", href: "#" },
        { name: "Showcase", href: "#" },
        { name: "Pricing", href: "#" },
      ],
    },
    {
      title: "Community",
      children: [
        { name: "Forum", href: "#" },
        { name: "Discord", href: "#" },
      ],
    },
  ];

  return (
    <div class="mt-8 flex w-full justify-center bg-white p-8 transition duration-150 dark:bg-neutral-900">
      <div class="container flex flex-col gap-8 text-sm md:flex-row md:gap-16">
        <div class="flex-1">
          <div class="flex items-center gap-1">
            <div class="text-2xl font-bold transition duration-150 dark:text-slate-200">
              Qurescent
            </div>
          </div>
          <div class="text-gray-500 transition duration-150 dark:text-slate-400">
            With&nbsp;
            <a
              href="https://github.com/astrojs"
              class="transition duration-150 hover:text-gray-700 dark:hover:text-amber-300"
            >
              AstroJS
            </a>
            &nbsp;+&nbsp;
            <a
              href="https://github.com/solidjs"
              class="transition duration-150 hover:text-gray-700 dark:hover:text-amber-300"
            >
              SolidJS
            </a>
          </div>
        </div>

        <For each={menus}>
          {(menu) => (
            <div class="mb-4 transition duration-150 dark:text-slate-200">
              <div class="font-bold">{menu.title}</div>
              <ul class="mt-2">
                <For each={menu.children}>
                  {(child) => (
                    <li class="mt-2">
                      <a
                        class="transition duration-150 hover:text-gray-700 dark:text-slate-200 dark:hover:text-amber-300"
                        href={child.href}
                      >
                        {child.name}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>

        <div class="space-y-2 text-center transition duration-150 dark:text-slate-200 md:text-right">
          <div class="text-xs">
            Copyright © 2023 kihong
            <br />
            All right reserved.
          </div>

          <a
            href="https://github.com/kihonq"
            aria-label="Go to kihonq's Github"
            class="inline-block"
          >
            <IconGithub />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
