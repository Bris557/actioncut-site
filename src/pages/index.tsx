import Layout from '@theme/Layout';
import CameraOverlayMock from '@site/src/components/phone/CameraOverlayMock';
import EventMock from '@site/src/components/phone/EventMock';
import HomeMock from '@site/src/components/phone/HomeMock';
import IphoneLiveMock from '@site/src/components/phone/IphoneLiveMock';
import MomentMock from '@site/src/components/phone/MomentMock';
import PhoneFrame from '@site/src/components/phone/PhoneFrame';
import Screen from '@site/src/components/phone/Screen';
import {QUICK_TAGS} from '@site/src/data/tags';

// Temporary: visual check of the mocks. Replaced by the landing page in Task 5.
export default function Home() {
  return (
    <Layout title="Mocks">
      <main style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32, padding: 32}}>
        <PhoneFrame label="Camera">
          <CameraOverlayMock count={6} recTime="01:24" chipsVisible countdown={0.6} chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))} />
        </PhoneFrame>
        <PhoneFrame label="Home">
          <HomeMock highlightNew />
        </PhoneFrame>
        <PhoneFrame label="Home live">
          <HomeMock live />
        </PhoneFrame>
        <PhoneFrame label="Favorites">
          <HomeMock tab="favorites" />
        </PhoneFrame>
        <PhoneFrame label="Event">
          <EventMock />
        </PhoneFrame>
        <PhoneFrame label="Moment">
          <MomentMock versions />
        </PhoneFrame>
        <PhoneFrame platform="iphone" label="iPhone">
          <IphoneLiveMock />
        </PhoneFrame>
        <Screen name="Event screen" caption="Placeholder" />
      </main>
    </Layout>
  );
}
