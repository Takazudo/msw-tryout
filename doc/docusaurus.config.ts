import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MSW Tryout Documentation',
  tagline: 'Technical documentation and development notes',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://takazudo.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/msw-tryout/',

  // Don't add trailing slash
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Add noindex meta tag to prevent search engine indexing
  noIndex: true,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          // Disable edit links since this is private documentation
          editUrl: undefined,
          // Show last update time and author from git history
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // Add remark plugin to inject creation dates
          beforeDefaultRemarkPlugins: [[require('./plugins/remark-creation-date.js'), {}]],
        },
        // Disable blog feature
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'msw-tryout',
            spec: 'static/api-spec/msw-tryout/openapi.yaml',
            route: '/api/msw-tryout',
          },
        ],
        theme: {
          primaryColor: '#1890ff',
        },
      },
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        language: ['en'],
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        docsRouteBasePath: '/docs',
        // Disable indexing for search engines
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    // Force dark mode and disable theme switching
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    // Add meta tags for SEO protection
    metadata: [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
    navbar: {
      title: 'MSW Tryout Docs',
      logo: {
        alt: 'MSW Tryout Logo',
        src: 'img/takazudo-logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'inboxSidebar',
          position: 'left',
          label: 'INBOX',
          docsPluginId: 'default',
        },
        {
          type: 'docSidebar',
          sidebarId: 'dataSidebar',
          position: 'left',
          label: 'Data',
          docsPluginId: 'default',
        },
        {
          type: 'docSidebar',
          sidebarId: 'miscSidebar',
          position: 'left',
          label: 'Misc',
          docsPluginId: 'default',
        },
        {
          to: '/api/msw-tryout',
          label: 'API',
          position: 'left',
        },
        {
          href: 'http://localhost:8888',
          label: 'Main Site',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} MSW Tryout. Documentation built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
