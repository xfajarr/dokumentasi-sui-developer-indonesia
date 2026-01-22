import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Dokumentasi Sui Development (Indonesia)',
  tagline: 'Menguasai Pengembangan Blockchain Sui',
  favicon: 'img/Sui_Symbol_Sea.png',

  future: {
    v4: true,
  },

  url: 'https://sui-docs-id.vercel.app',
  baseUrl: '/',

  organizationName: 'facebook',
  projectName: 'docusaurus',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/xfajarr',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'light',
      disableSwitch: false,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Logo Sui',
        src: '/img/Sui_Logo_Ocean.svg',
        srcDark: '/img/Sui_Logo_White.svg',
        width: 140,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Dokumentasi',
        },
        {
          to: 'https://github.com/xfajarr/suidev-workshop-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Dokumentasi',
          items: [
            {
              label: 'Pengenalan',
              to: '/docs/intro',
            },
            {
              label: 'Setup Lingkungan',
              to: '/docs/setup/01-setup-lingkungan-development',
            },
            {
              label: 'Setup Wallet',
              to: '/docs/setup/02-setup-wallet-dan-faucet',
            },
          ],
        },
        {
          title: 'Materi Workshop',
          items: [
            {
              label: 'Blockchain Fundamentals',
              to: '/docs/day1/00-pengenalan-blockchain-smartcontract',
            },
            {
              label: 'Pengenalan Sui',
              to: '/docs/day1/01-pengenalan-sui-blockchain',
            },
            {
              label: 'Move Syntax Dasar',
              to: '/docs/day2/01-move-sintaks-dasar',
            },
            {
              label: 'Escrow Contract',
              to: '/docs/day2/05-praktik-escrow-contract',
            },
          ],
        },
        {
          title: 'Komunitas',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/moveindonesia',
            },
            {
              label: 'Twitter/X',
              href: 'https://x.com/SuiCommunity_ID',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/xfajarr',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Sui Official Docs',
              href: 'https://docs.sui.io',
            },
            {
              label: 'Move Language',
              href: 'https://move-language.github.io/move',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sui Developer Workshop Indonesia. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
