import { Card, Text, Modal, Button, Paper, Center, Checkbox, LoadingOverlay } from "@mantine/core";
import { useToggle, useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Event, Reminder } from "../supabase/types";
import { supabase } from "../supabase/client";
import { deleteEvent } from "./util";

type CalendarDateProps = {
    date: string;
    month : string;
    events: Event[];
    reminders : Reminder[];
    onUpdate : () => void;
};

const CalendarDate: React.FC<CalendarDateProps> = ({ date, month, events, reminders, onUpdate }) => {

    const isInactive = date === "";
    const [opened, { open, close }] = useDisclosure(false);
    const [visible, toggle] = useToggle([false, true]);
    const [isEdit, setIsEdit] = useState(false)
    const [toDelete, setToDelete] = useState<number[]>([])
    const [accessToken, setAccessToken] = useState<string>("")
    const currDay = month + " " + date

    useEffect(() => {
        // Fetch the current session and update the accessToken state
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token)
          }
        });
      }, []);

    function changeDeletions(id: number, checked: boolean) {
        setToDelete(prevToDelete => {
            if (checked) {
                return [...prevToDelete, id];
            } else {
                return prevToDelete.filter(eventId => eventId !== id);
            }
        });
    };

    async function submitDeletions(identifiers: number[]) {
        toggle()
        if (accessToken && accessToken.length > 0 && identifiers.length > 0) {
            try {
                console.log('trying to toggle 1')
                // Convert each ID to a string and map to an array of fetch promises
                const deletionPromises = identifiers.map(id =>
                    deleteEvent(id, accessToken)
                );
    
                const responses = await Promise.all(deletionPromises);
    
                responses.forEach(response => {
                    if (response.status === 200) {
                        console.log('Event deleted successfully');
                    } else {
                        console.error('Failed to delete event with status:', response.status);
                    }
                });
    
                setToDelete([]);
                close()
            } catch (error) {
                console.error('Errors deleting data:', error);
            }
            onUpdate()
        }
        setIsEdit(false);
        toggle()
    }

    const eventDetails = events.sort((a, b) => {
        if (!a.event_time) return 1;
        if (!b.event_time) return -1;
        return a.event_time.localeCompare(b.event_time);
    }).map((event, index) => (
        <div key={index} className="mb-4">
            <Paper shadow="xs" radius="lg" p="xl" withBorder>
                <div id="EventInformation">
                    <div className="flex justify-between items-center mb-2">
                        <Text size="md" fw={500} className="truncate">{event.title}</Text>
                        {event.event_time && (
                            <Text size="sm" className="text-gray-600">
                                {new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </Text>
                        )}
                    </div>
                    {event.description && <Text size="sm" className="text-gray-500">{event.description}</Text>}
                </div>
                {isEdit && 
                <div className="flex justify-end mt-3">
                    <Checkbox
                        labelPosition="left"
                        label="Remove"
                        color="red"
                        radius="md"
                        size="sm"
                        onChange={(checkEvent) => changeDeletions(+event.id, checkEvent.currentTarget.checked)}
                    />                 
                </div>
                }
            </Paper>
        </div>
    ));
    

    const reminderDetails = reminders.map((reminder, index) => (
        <div key={index} className="mb-4">
            <Paper shadow="xs" radius="lg" p="xl" withBorder>
                <div className="flex justify-between items-center mb-2">
                    <Text size="md" fw={500} className="truncate">{reminder.title}</Text>
                    {reminder.due && (
                        <Text size="sm" className="text-gray-600">
                            {new Date(reminder.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </Text>
                    )}
                </div>
                {reminder.description && <Text size="sm" className="text-gray-500">{reminder.description}</Text>}
            </Paper>
        </div>
    ));
    

    return (
        <Card 
            withBorder 
            radius={'md'} 
            shadow="sm" 
            style={{ backgroundColor: isInactive ? '#f0f0f0' : 'white'}}
            className='h-32'
        >
            <Card.Section withBorder inheritPadding >
                <Center>
                    {isInactive ? null : <Text fw={600} size="lg" className="text-blue-600">{date}</Text>}
                </Center>
            </Card.Section>
            {isInactive ? null : (
                <Card.Section className="cursor-pointer p-2">
                    {events.length > 0 && (
                        <Button onClick={open} variant="transparent" color="orange" size="sm" fullWidth className="mb-1">
                            {events.length} event{events.length === 1 ? '' : 's'}
                        </Button>
                    )}
                    {reminders.length > 0 && (
                        <Button onClick={open} variant="transparent" color="orange" size="sm" fullWidth>
                            {reminders.length} assignment{reminders.length === 1 ? '' : 's'}
                        </Button>
                    )}
                    {events.length === 0 && reminders.length === 0 && (
                        <Text size="sm" className="text-gray-500"></Text>
                    )}
                </Card.Section>
            )}
            <Modal opened={opened} onClose={close} title={currDay} centered radius="lg">
                <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color : 'orange', type : 'bars'}}/>
                <div className="flex flex-col h-full justify-between">
                    <div>
                        {eventDetails.length > 0 ? (
                            <>
                                <Text size="md" className="text-gray-700" fw={550} style={{marginBottom : 10}}>Events </Text>
                                {eventDetails}
                            </>
                        ) : <Text size="sm" className="text-gray-500"></Text>}
                        {reminderDetails.length > 0 ? (
                            <>
                                <Text size="md" className="text-gray-700" fw={550} style={{marginBottom : 10}}>Assignments </Text>
                                {reminderDetails}
                            </>
                        ) : null}
                    </div>
                    <div className="flex justify-end">
                        {!isEdit && 
                            <Button
                                variant="light"
                                color="orange"
                                radius="md"
                                size="sm"
                                onClick={() => setIsEdit(!isEdit)}
                            >
                                Edit
                            </Button>}                        
                        {isEdit && 
                            <Button
                                variant="filled"
                                color="orange"
                                radius="md"
                                size="sm"
                                onClick={() => submitDeletions(toDelete)}
                            >
                                Submit
                            </Button>}   
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default CalendarDate;
