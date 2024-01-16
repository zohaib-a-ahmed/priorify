'use client'
import { supabase } from '../supabase/client';
import CalendarComponent from '../components/calendar';
import ToDo from '../components/todo';
import { useRouter } from 'next/navigation';
import { Button, Container, Grid, TextInput, Title, Center, Divider } from '@mantine/core';

export default function Home() {

  const router = useRouter();

  // Function to handle sign-out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    else router.push('/');
  };

  return (
    <div>
      <Container fluid >
        <Grid align="center" justify="space-between" style={{ margin: 20}}>
          <Grid.Col span={3}>
            <Title order={1} style={{marginLeft : 30}}>Priorify</Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              placeholder="Graduation on May 18 at 2 PM"
              description='Google Gemini Assistant'
              size="md"
              radius="md"
              style={{ width: '100%'}}
            />
          </Grid.Col>
          <Grid.Col span={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="gradient"
              gradient={{ from: 'red', to: 'orange', deg: 50 }}
              radius="md"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </Grid.Col>
        </Grid>
        <Divider></Divider>
        <Grid justify='center' align='flex-start' gutter={0}>
          <Grid.Col span={{ base: 12, md: 7, lg: 7, xl: 8 }} style={{ margin: 20 }}>
            <CalendarComponent />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4, xl : 3}} style={{ margin: 20}}>
            <Center>
              <ToDo/>
            </Center>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}