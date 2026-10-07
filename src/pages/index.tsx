import Layout from '@theme/Layout';
import ButtonDemo from '@site/src/components/landing/ButtonDemo';
import Hero from '@site/src/components/landing/Hero';
import HowItWorks from '@site/src/components/landing/HowItWorks';
import Problem from '@site/src/components/landing/Problem';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <ButtonDemo />
      </main>
    </Layout>
  );
}
