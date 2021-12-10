import type { GetServerSideProps, NextPage } from 'next';

import { FormEvent, useState } from 'react';

import { Text, Icon, VStack, Flex, Button, Image } from '@chakra-ui/react';
import Head from 'next/head';
import { AiFillGithub, AiOutlineShoppingCart } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { getSession, signIn } from 'next-auth/react';
import { Session } from 'next-auth';

type LoginProps = {
  session: Session | null;
};

const Login: NextPage<LoginProps> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const titleInitialAnimation = {
    x: 0,
    y: -200,
    scale: 1.2,
    rotate: 360,
  };

  const titleFinalAnimation = {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      velocity: 2,
    },
  };

  const cartInitialAnimation = {
    x: -1000,
    y: -200,
  };

  const cartFinalAnimation = {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      velocity: 0.1,
    },
  };

  const handleSignIn = async (event: FormEvent<HTMLDivElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 5000)); // auth user with github

      await signIn('github');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      flex={1}
      backgroundColor="blue.600"
      marginX="auto"
      justifyContent="center"
      position="relative"
    >
      <Head>
        <title>dev-shop</title>
        <meta
          name="description"
          content="Login into devshop and buy awesome products"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        as="main"
        backgroundColor="blue.600"
        height="100vh"
        width="100%"
        flex={1}
        maxWidth="2560px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={2}
      >
        <VStack
          as="form"
          onSubmit={handleSignIn}
          spacing={8}
          align="center"
          zIndex={2}
        >
          <motion.div
            initial={titleInitialAnimation}
            animate={titleFinalAnimation}
          >
            <Text as="h1" fontSize="5xl" color="white" fontWeight="bold">
              DevShop
            </Text>
          </motion.div>
          <motion.div
            initial={cartInitialAnimation}
            animate={cartFinalAnimation}
          >
            <Icon
              as={AiOutlineShoppingCart}
              role="img"
              width={60}
              height={60}
              fill="white"
            />
          </motion.div>
          <Button
            type="submit"
            leftIcon={<Icon as={AiFillGithub} fill="black" />}
            variant="solid"
            size="lg"
            isLoading={isLoading}
          >
            Entrar com github
          </Button>
        </VStack>
        <Image
          src="/assets/wave.svg"
          role="presentation"
          alt=""
          zIndex={1}
          width="100%"
          position="fixed"
          bottom="0"
          left="0"
        />
      </Flex>
    </Flex>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  console.info('session', session);
  console.info('params', params);

  const isUserAuthenticated = Boolean(session);

  if (isUserAuthenticated) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
