import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { Footer, Navigation } from '../components';

export default function AiactaApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Aiacta - Next-gen virtual tabletop</title>
        <meta
          name="description"
          content="Virtual tabletop simulator software run in browser"
        />
      </Head>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
