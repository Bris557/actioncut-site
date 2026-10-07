import Layout from '@theme/Layout';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main className="container margin-vert--xl">
        <h1>Tap. Tag. Done.</h1>
        <p>
          <a href={site.apkUrl} download>
            Download for Android
          </a>
        </p>
      </main>
    </Layout>
  );
}
