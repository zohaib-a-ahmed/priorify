import { Accordion, Text, LoadingOverlay, Button, Divider, Center, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Reminder } from "../supabase/types";
import { useRouter } from "next/navigation";
import { fetchReminders, deleteReminder } from "./util";
import NewReminder from './createReminder'

type TodoProps = {
    onUpdate : () => void;
    key : number;
}

const ToDo: React.FC<TodoProps> = ({ onUpdate }, key) => {

    const [opened, { open, close }] = useDisclosure(false);
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [accessToken, setAccessToken] = useState("")
    const [visible, setVisibility] = useState(true);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token)
            fetchReminders(token).then((response : any) => {
                if (response == 401 || response == 500)
                  // Unauthorized, redirect
                  router.push('/')
                else setReminders(response)
              })
          }
        });
    }, [key]);

    useEffect(() => {
        if (reminders && reminders.length > 0) setVisibility(false)
    }, [reminders])

    async function deleteAssignment(id : number) {
        await deleteReminder(id, accessToken).then((response) => {
            if (response.status == 401 || response.status == 500) router.push('/')
            else onUpdate()
        })
    }

    function getItems() {
        if (reminders && reminders.length > 0) {
            return reminders.map((reminder) => {
                const dueDate = new Date(reminder.due);
                const formattedDate = dueDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                const formattedTime = dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
                return (
                    <Accordion.Item key={reminder.id} value={reminder.title}>
                        <Accordion.Control className="flex justify-between items-center">
                            <Text size="md" fw={500}>{reminder.title}</Text>
                            <Text size="sm" className="text-gray-600">
                                {formattedDate} | {formattedTime}
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel className="pt-2">
                            <Text size="sm" className="text-gray-500">{reminder.description}</Text>
                            <div className="mt-2 flex justify-end">
                                <Button 
                                    variant="outline"
                                    color="red"
                                    radius="md"
                                    size="xs"
                                    onClick={() => deleteAssignment(reminder.id)}
                                >
                                    Delete
                                </Button>
                            </div>                    
                        </Accordion.Panel>
                    </Accordion.Item>
                );
            });
        }
    }
    
    

    return (
        <div className="w-full"> {/* Full width container */}
            <Center style={{ marginBottom: 20, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Text size="xl" fw={650} >To Do</Text>
                <Button size='sm' variant="subtle" color="orange" onClick={open} leftSection={<Text>{'+'}</Text>}>{"Assignment"}</Button>
            </Center>
            <Divider style={{marginBottom : 30}}>
            </Divider>
            <div id='assignments'>
                <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color : 'orange', type : 'bars'}}/>
                <Accordion variant="separated" radius="lg" className="w-full">
                    {(reminders && reminders.length > 0) ? getItems() : null}
                </Accordion>
            </div>
            <Modal opened={opened} onClose={close} title="Create Assignment" radius='lg'>
                <NewReminder onClose={close} onUpdate={onUpdate}></NewReminder>
            </Modal>                        
        </div>
    );
};

export default ToDo;