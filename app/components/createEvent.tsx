import { useState, useEffect } from 'react';
import { Input, Switch, Textarea, Button, Text } from '@mantine/core';
import { TimeInput, DatePickerInput } from '@mantine/dates';
import { supabase } from '../supabase/client';
import { createEvent } from './util';

const NewEvent = () => {

    const [accessToken, setAccessToken] = useState("")
    const [isRange, setIsRange] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [eventTime, setEventTime] = useState("");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token);
          }
        });
      }, []);

    async function createNewEvent(){
        const event = {
            title : title,
            event_date_start : isRange ? dateRange[0]?.toISOString() : date?.toISOString(),
            event_date_end : isRange ? dateRange[1]?.toISOString() : null,
            description : description.length ? description : null,
            event_time : eventTime ? `${eventTime}:00` : null
        }
        console.log(event)
        await createEvent(accessToken, event).then((response : any) => {
            console.log(response)
        })
    }
 
    return (
        <form action="Create New Event">
            <Input.Wrapper label="Event Title" withAsterisk description="" error="" style={{marginBottom : 10}}>
                <Input variant='filled' placeholder="My New Event" radius='md'value={title} onChange={(event) => setTitle(event.currentTarget.value)}/>
            </Input.Wrapper>
            <Input.Wrapper description="" error="" style={{marginBottom : 10}}>
            {isRange ? (
                    <DatePickerInput
                        withAsterisk
                        clearable
                        variant='filled'
                        label='Select Date Range'
                        type='range'
                        radius='md'
                        placeholder='My New Event Date Range'
                        style={{ marginBottom: 5 }}
                        value={dateRange}
                        onChange={setDateRange}
                    />
                ) : (
                    <DatePickerInput
                        withAsterisk
                        clearable
                        variant='filled'
                        label='Select Date'
                        type='default'
                        radius='md'
                        placeholder='My New Event Date'
                        style={{ marginBottom: 5 }}
                        value={date}
                        onChange={setDate}
                    />
                )}
                    <Switch
                    defaultChecked
                    color="orange"
                    label="Range"
                    checked={isRange}
                    onChange={(event) => setIsRange(event.currentTarget.checked)}
                />
            </Input.Wrapper>
            <Input.Wrapper label='Event Time' style={{marginBottom : 10}}>
                <TimeInput
                    variant="filled"
                    radius="md"
                    description = "ex. 12:00 PM"
                    value={eventTime}
                    onChange={(event) => setEventTime(event.currentTarget.value)}
                />
            </Input.Wrapper>
            <Input.Wrapper label='Event Description' style={{marginBottom : 10}}>
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
                disabled={!(title && (date || (dateRange[0] && dateRange[1])))}
                onClick={(event) => createNewEvent()}
            >Event</Button>
            </div>
        </form>
)};

export default NewEvent