import { Accordion, Text, Group, Button, Divider, Center } from "@mantine/core"
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Reminder } from "../supabase/types";
import { useRouter } from "next/navigation";
import { fetchReminders } from "./util";

export default function MyComponent() {

    const [reminders, setReminders] = useState<Reminder[]>([])
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            fetchReminders(token).then((response : any) => {
                if (response == 401)
                  // Unauthorized, redirect
                  router.push('/')
                else setReminders(response)
              })
          }
        });
    }, []);

    function getItems() {
        if (reminders && reminders.length > 0)
            return reminders.map((reminder) => (
            <Accordion.Item key={reminder.id} value={reminder.title} >
                <Accordion.Control className="flex justify-between items-center">
                    <Text fw={600}>{reminder.title}</Text>
                    {/* Optional: Show due date or other info */}
                </Accordion.Control>
                <Accordion.Panel className="pt-2">
                    <Text size="sm">{reminder.description}</Text>
                        <div className="mt-2 flex justify-end">
                            <Button variant="outline"
                                    color="red"
                                    radius="md"
                                    size="xs">Delete</Button>
                        </div>                    
                </Accordion.Panel>
            </Accordion.Item>
    ));
    }

    return (
        <div className="w-full"> {/* Full width container */}
            <Center style={{marginBottom : 20 }}>
                <Text size="xl" fw={650} style={{ margin: '0 20px' }}>To Do</Text>                        
            </Center>
            <Divider style={{marginBottom : 30}}>
            </Divider>
            <Accordion variant="separated" radius="lg" className="w-full">
                {(reminders && reminders.length > 0) ? getItems() : null}
            </Accordion>                        
        </div>
    );
};