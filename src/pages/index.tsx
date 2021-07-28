import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FaCalendar, FaUser } from 'react-icons/fa'
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
            <div>
              <time>
                <span><FaCalendar style={{fontSize: 20}} /></span>
                15 mar 2021
                </time>
              <p>
                <span><FaUser style={{fontSize: 20}} /></span>
                Diego Fernandes
              </p>
            </div>
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
