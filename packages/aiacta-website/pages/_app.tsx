import 'tailwindcss/tailwind.css';
import { Footer, Navigation } from '../components';

export default function AiactaApp({ Component, pageProps }: any) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
