import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: string
  bio: string
  avatarUrl: string
}

export default function Schedule({ user, avatarUrl, bio }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user} | Ignite Call`} />

      <Container>
        <UserHeader>
          <Avatar src={avatarUrl} />
          <Heading>{user}</Heading>
          <Text>{bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  )
}

// Informa para o next quais serão os paths que serão gerados no momento do build.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Não temos nenhum path pré-definido, então deixamos vazio. Será gerado no momento da requisição
    fallback: 'blocking', // Se não existir o path, o next irá gerar no momento da requisição.
  }
}

// Sempre executa do lado do servidor, portanto podemos trabalhar com informações do back-end e dados sensiveis.
// É gerado no momento do build, portanto não tem acesso a req, res.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: user.name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
