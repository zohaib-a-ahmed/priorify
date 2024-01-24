import { useState, useEffect } from 'react';
import { Input, LoadingOverlay, Textarea, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { supabase } from '../supabase/client';
import { createReminder } from './util';

interface NewReminderProps {
    onUpdate : () => void;
    onClose : () => void;
}

const NewReminder: React.FC<NewReminderProps> = ({ onUpdate, onClose }) => {

    const [accessToken, setAccessToken] = useState("")
    const [date, setDate] = useState<Date>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visible, { toggle }] = useDisclosure(false);

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token);
          }
        });
      }, []);
    
      const createNewAssignment = async () => {
        toggle();
        if (date) {
            // Convert the selected date to the local time zone format
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const event = {
                title: title,
                due: localDate,
                description: description.length ? description : null,
            };
            console.log(event.due);
            await createReminder(accessToken, event).then((response: any) => {
                onUpdate();
                onClose();
            });
        }
    };
    

    return (
        <form action="Create New Reminder">
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color : 'orange', type : 'bars'}}/>
            <Input.Wrapper label="Assignment" withAsterisk description="" error="" style={{marginBottom : 10}}>
                <Input variant='filled' placeholder="Assignment Name" radius='md'value={title} onChange={(event) => setTitle(event.currentTarget.value)}/>
            </Input.Wrapper>
            <Input.Wrapper description="" error="" style={{marginBottom : 10}}>
                <DateTimePicker 
                    label="Select Due Date" 
                    variant='filled' 
                    placeholder='DD MMM YYYY hh:mm AM/PM' 
                    valueFormat="DD MMM YYYY hh:mm A"
                    withAsterisk 
                    clearable
                    value={date}
                    onChange={(newDate) => {
                        if (newDate instanceof Date) {
                            setDate(newDate);
                        }}}
                />
            </Input.Wrapper>
            <Input.Wrapper label='Assignment Description' style={{marginBottom : 10}}>
            <Textarea
                variant="filled"
                radius="md"
                placeholder="What's this about?"
                autosize
                minRows={2}
                maxRows={4}
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
            />
            </Input.Wrapper>
            <div id='submissionbutton' className='flex justify-end'>
            <Button 
                style={{marginTop : 5}}                                
                variant="filled"
                color="orange"
                radius="md"
                size="sm"
                leftSection={<Text>{'+'}</Text>}
                disabled={!(title && date )}
                onClick={(event) => createNewAssignment()}
            >Assignment</Button>
            </div>
        </form>
)};

export default NewReminder