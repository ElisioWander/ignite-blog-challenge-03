import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FaCalendar, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'
import { useState } from 'react';
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'

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
  const [showMorePosts, setShowMorePosts] = useState(postsPagination.next_page)

  async function handleShowMorePosts(): Promise<void> {
    if(showMorePosts === null) {
      return
    }

    const results = await fetch(showMorePosts)
    const postsResults = await results.json()
    setShowMorePosts(postsResults.next_page)

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })

    setPosts([...posts, ...newPosts])
  }
  
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <div className={commonStyles.postHeaderStyle}>
                  <time>
                    <span><FaCalendar style={{fontSize: 20}} /></span>
                    {format(new Date(post.first_publication_date), 'dd MMM yyy', {
                      locale: ptBR
                    })}
                    </time>
                  <p>
                    <span><FaUser style={{fontSize: 20}} /></span>
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          )) }

            {showMorePosts && (
              <button type="button" onClick={handleShowMorePosts}>
                Carregar mais posts
              </button>
            )}
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
