import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FaCalendar, FaUser } from 'react-icons/fa'
import { RichText } from 'prismic-dom'
import { format } from 'date-fns'
import { useState } from 'react';
import ptBR from 'date-fns/locale/pt-BR'

import Prismic from '@prismicio/client'
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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)


  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a key={post.uid}>
              <h1>{post.data.title}</h1>
              <h2>{post.data.subtitle}</h2>
              <div>
                <time>
                  <span><FaCalendar style={{fontSize: 20}} /></span>
                  {post.first_publication_date}
                  </time>
                <p>
                  <span><FaUser style={{fontSize: 20}} /></span>
                  {post.data.author}
                </p>
              </div>
            </a>
          )) }

          <button type="button">
            Carregar mais posts
          </button>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      pageSize: 2,
    }
  );

  return {
    props: {
      postsPagination: postsResponse
    }
  }
};
