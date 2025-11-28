import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type CommunityLink = {
  name: string;
  description: string;
  url: string;
  icon?: string;
};

const CommunityLinks: CommunityLink[] = [
  {
    name: 'Discord',
    description: 'Bergabung dengan komunitas developer Sui Indonesia di Discord',
    url: 'https://discord.gg/sui',
  },
  {
    name: 'Telegram',
    description: 'Diskusi dan tanya jawab seputar pengembangan di Sui',
    url: 'https://t.me/moveindonesia',
  },
  {
    name: 'Twitter/X',
    description: 'Ikuti update terbaru dan berita dari ekosistem Sui',
    url: 'https://x.com/SuiCommunity_ID',
  },
  {
    name: 'GitHub',
    description: 'Kontribusi ke proyek open source Sui dan dokumentasi',
    url: 'https://github.com/xfajarr/dokumentasi-sui-developer-indonesia',
  },
];

function CommunityLinkCard({name, description, url}: CommunityLink) {
  return (
    <div className={clsx('col col--6')}>
      <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx('card', 'shadow--md', styles.communityCard)}>
        <div className={clsx('card__body', 'padding-horiz--md', 'padding-vert--md')}>
          <Heading as="h3" className={styles.communityName}>{name}</Heading>
          <p className={styles.communityDescription}>{description}</p>
          <div className={styles.communityArrow}>→</div>
        </div>
      </Link>
    </div>
  );
}

export default function Community(): ReactNode {
  return (
    <section className={styles.community}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className={styles.sectionTitle}>
              Bergabung dengan Komunitas Sui Indonesia
            </Heading>
            <p className={styles.sectionDescription}>
              Terhubung dengan developer dan builder lainnya. Dapatkan dukungan, 
              berbagi pengetahuan, dan ikuti perkembangan terbaru dari ekosistem Sui.
            </p>
          </div>
        </div>
        <div className="row">
          {CommunityLinks.map((link, idx) => (
            <CommunityLinkCard key={idx} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
}

