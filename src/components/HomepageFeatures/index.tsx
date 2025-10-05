import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Parallel Execution & Low Gas Fees',
    Svg: require('../../../static/img/Sui_Symbol_Sea.svg').default,
    description: (
      <>
        Sui memproses transaksi secara paralel dengan throughput tinggi dan biaya rendah.
        Bangun aplikasi yang responsif dan skalabel sejak awal.
      </>
    ),
  },
  {
    title: 'Smart Contract Move yang Aman',
    Svg: require('../../../static/img/Sui_Symbol_Sea.svg').default,
    description: (
      <>
        Move berorientasi objek dan mengutamakan keamanan.
        Pelajari modul, kemampuan, dan kepemilikan aset untuk mencegah bug kelas umum.
      </>
    ),
  },
  {
    title: 'Alat & Ekosistem Sui',
    Svg: require('../../../static/img/Sui_Symbol_Sea.svg').default,
    description: (
      <>
        Gunakan Sui CLI, SDK TypeScript, dan devnet untuk iterasi cepat.
        Integrasikan dompet, pembayaran, dan layanan DeFi dengan mudah.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card', 'shadow--md')}>
        <div className={clsx('card__body', 'text--center', 'padding-horiz--md')}>
          <Svg className={styles.featureSvg} role="img" />
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
