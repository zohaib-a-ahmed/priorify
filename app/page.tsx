'use client'
import { useEffect } from 'react';
import { supabase } from '../app/supabase/client';
import { useRouter } from 'next/navigation';
import { Center, Title, Button, Text, Container, Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';


export default function Index() {

  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  async function handleSignInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) console.error('Error signing in:', error);
  }

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.data.user?.aud) router.push('/home')
    })
  }, [])

  return (
    <div style={{ backgroundColor: '#333333', minHeight: '100vh' }}>
      <Container>
        <Center style={{ height: '100vh' }}>
          <Paper shadow="lg" radius="md" withBorder p="xl">
            <Center>
              <Title fw={800} order={1} style={{ marginBottom: 10, color: '#F39C12' }}>Priorify</Title>             
            </Center>
            <Text fw={550}> LLM-Assisted Productivity Hub</Text>
            {isSmallScreen ? (
              <Text color="red" size="sm" mt='lg'>
                Smaller screens are not yet supported.
              </Text>
            ) : (
              <Button
                fullWidth
                variant="gradient"
                gradient={{ from: 'red', to: 'orange', deg: 50 }}
                radius="md"
                mt='lg'
                size='lg'
                onClick={handleSignInWithGoogle}
              >
                Sign In With Google
              </Button>
            )}
          </Paper>         
        </Center>
      </Container>      
    </div>
  );
}