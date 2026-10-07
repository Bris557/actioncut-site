import Layout from '@theme/Layout';
import Benefits from '@site/src/components/landing/Benefits';
import ButtonDemo from '@site/src/components/landing/ButtonDemo';
import Features from '@site/src/components/landing/Features';
import FinalCta from '@site/src/components/landing/FinalCta';
import FreeLater from '@site/src/components/landing/FreeLater';
import Hero from '@site/src/components/landing/Hero';
import HowItWorks from '@site/src/components/landing/HowItWorks';
import IphoneSoon from '@site/src/components/landing/IphoneSoon';
import PrivacyFaq from '@site/src/components/landing/PrivacyFaq';
import Problem from '@site/src/components/landing/Problem';
import UseCases from '@site/src/components/landing/UseCases';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <ButtonDemo />
        <UseCases />
        <Features />
        <Benefits />
        <IphoneSoon />
        <FreeLater />
        <PrivacyFaq />
        <FinalCta />
      </main>
    </Layout>
  );
}
