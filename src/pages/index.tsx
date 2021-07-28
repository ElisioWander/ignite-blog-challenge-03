import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Head from 'next/head';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | EWW-blog</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <h1>Como utilizar hooks</h1>
            <h2>Pensando em sincronização em vez de ciclos de vida</h2>
            <time>15 mar 2021</time>
            <span>Diego Fernandes</span>
          </a>
          <a>
            <h1>Como utilizar hooks</h1>
            <h2>Pensando em sincronização em vez de ciclos de vida</h2>
            <time>15 mar 2021</time>
            <span>Diego Fernandes</span>
          </a>
          <a>
            <h1>Como utilizar hooks</h1>
            <h2>Pensando em sincronização em vez de ciclos de vida</h2>
            <time>15 mar 2021</time>
            <span>Diego Fernandes</span>
          </a>
          <a>
            <h1>Como utilizar hooks</h1>
            <h2>Pensando em sincronização em vez de ciclos de vida</h2>
            <time>15 mar 2021</time>
            <span>Diego Fernandes</span>
          </a>

          <button type="button">
            Carregar posts
          </button>
        </div>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
