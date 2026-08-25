/// <reference types="astro/client" />

/** Starlight virtual modules used by component overrides. */
declare module "virtual:starlight/user-config" {
  const config: {
    pagefind?: boolean;
    components: Record<string, string>;
    [key: string]: unknown;
  };
  export default config;
}

declare module "virtual:starlight/components/LanguageSelect";
declare module "virtual:starlight/components/Search";
declare module "virtual:starlight/components/SiteTitle";
declare module "virtual:starlight/components/SocialIcons";
declare module "virtual:starlight/components/ThemeSelect";
declare module "virtual:starlight/pagefind-config" {
  export const pagefindUserConfig: Record<string, unknown>;
}
declare module "virtual:starlight/project-context" {
  const project: { trailingSlash?: string };
  export default project;
}
