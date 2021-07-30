import { GetStaticPaths, GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import { format } from 'date-fns'
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa'
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client'
import Head from 'next/head'
import ptBR from 'date-fns/locale/pt-BR'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()

  if(router.isFallback) {
    return <span>Carregando...</span>
  }

  const readingTime = post.data.content.reduce((acc, content) => {
    const headingWords = content.heading.split(' ')
    const bodyWords = RichText.asText(content.body).split(' ')
    acc += headingWords.length
    acc += bodyWords.length

    return acc
  }, 0)

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      { post.data.banner.url && (
        <section
          className={styles.postBanner}
          style={{ backgroundImage: `url(${post.data.banner.url})` }}
        />
      )}

      <div className={styles.postContainer}>
        <section className={styles.postHeader}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.postHeaderStyle}>
            <time>
              <span>
                <FaCalendar style={{fontSize: 20}} />
              </span>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR
              })} 
            </time>
            <p>
              <span><FaUser style={{fontSize: 20}} /></span>
              {post.data.author}
            </p>
            <time>
              <span>
                <FaClock style={{fontSize: 20}} />
              </span>
              { Math.ceil(readingTime /200) } min
            </time>
          </div>
        </section>

        {post.data.content.map(content => {
          return (
            <main key={content.heading}>
              <article className={styles.postArticle}>
                <h2>{content.heading}</h2>
                <div 
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body)
                  }}
                />
              </article>
            </main>
          )
        })}
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid }
  }))

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps<PostProps> = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params

  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response
    }
  }
};
