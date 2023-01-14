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
    <div class="transition duration-150 bg-white dark:bg-neutral-900 w-full p-8 mt-8 flex justify-center">
      <div class="container flex flex-col md:flex-row gap-8 md:gap-16 text-sm">
        <div class="flex-1">
          <div class="flex items-center gap-1">
            <div class="transition duration-150 font-bold dark:text-slate-200 text-2xl">
              Qurescent
            </div>
          </div>
          <div class="transition duration-150 text-gray-500 dark:text-slate-400">
            With&nbsp;
            <a
              href="https://github.com/astrojs"
              class="transition duration-150 hover:text-gray-700 dark:hover:text-amber-300"
            >
              AstroJS
            </a>
            &nbsp;&&nbsp;
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
            <div class="transition duration-150 dark:text-slate-200 mb-4">
              <div class="font-bold">{menu.title}</div>
              <ul class="mt-2">
                <For each={menu.children}>
                  {(child) => (
                    <li class="mt-2">
                      <a
                        class="transition duration-150 dark:text-slate-200 hover:text-gray-700 dark:hover:text-amber-300"
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

        <div class="transition duration-150 dark:text-slate-200 space-y-2 text-right">
          <div class="text-xs">
            Copyright © 2023 kihong
            <br />
            All right reserved.
          </div>

          <a href="https://github.com/kihonq" class="inline-block">
            <IconGithub />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
