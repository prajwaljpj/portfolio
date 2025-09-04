
import { AppProps } from 'next/app';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
