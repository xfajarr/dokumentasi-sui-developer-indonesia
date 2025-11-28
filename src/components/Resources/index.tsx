import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ResourceItem = {
  title: string;
  description: ReactNode;
  link: string;
  icon?: string;
};

const ResourceList: ResourceItem[] = [
  {
    title: 'Dokumentasi Resmi',
    description: (
      <>
        Pelajari dokumentasi lengkap Sui dari sumber resmi. 
        Mulai dari konsep dasar hingga implementasi lanjutan.
      </>
    ),
    link: 'https://docs.sui.io',
  },
  {
    title: 'Sui CLI',
    description: (
      <>
        Alat command-line untuk berinteraksi dengan Sui blockchain.
        Install, setup, dan mulai membangun dengan cepat.
      </>
    ),
    link: 'https://docs.sui.io/build/install',
  },
  {
    title: 'Sui SDK',
    description: (
      <>
        TypeScript SDK untuk membangun aplikasi di atas Sui.
        Integrasikan dengan mudah ke dalam proyek Anda.
      </>
    ),
    link: 'https://sdk.mystenlabs.com/typescript',
  },
  {
    title: 'Sui Explorer',
    description: (
      <>
        Jelajahi blockchain Sui dengan mudah. Lihat transaksi,
        alamat, dan aktivitas jaringan secara real-time.
      </>
    ),
    link: 'https://suiexplorer.com',
  },
  {
    title: 'Slush Wallet',
    description: (
      <>
        Dompet resmi untuk Sui. Kelola aset, kirim token,
        dan berinteraksi dengan dApps dengan aman.
      </>
    ),
    link: 'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
  },
  {
    title: 'Sui Testnet',
    description: (
      <>
        Testnet untuk pengembangan dan pengujian aplikasi.
        Dapatkan faucet token dan mulai eksperimen.
      </>
    ),
    link: '#',
  },
];

function Resource({title, description, link}: ResourceItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card', 'shadow--md', styles.resourceCard)}>
        <div className={clsx('card__body', 'padding-horiz--md', 'padding-vert--md')}>
          <Heading as="h3" className={styles.resourceTitle}>{title}</Heading>
          <p className={styles.resourceDescription}>{description}</p>
          <Link
            className={clsx('button', 'button--outline', 'button--primary', styles.resourceLink)}
            to={link}
            target="_blank"
            rel="noopener noreferrer">
            Kunjungi →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Resources(): ReactNode {
  return (
    <section className={styles.resources}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className={styles.sectionTitle}>
              Resources & Tools
            </Heading>
            <p className={styles.sectionDescription}>
              Kumpulan sumber daya dan alat yang Anda butuhkan untuk membangun di Sui
            </p>
          </div>
        </div>
        <div className="row">
          {ResourceList.map((props, idx) => (
            <Resource key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

