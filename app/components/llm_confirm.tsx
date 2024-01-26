import { useEffect, useState } from 'react';
import { Tabs, Center } from '@mantine/core';
import NewEvent from './createEvent';
import NewReminder from './createReminder'
import { start } from 'repl';

interface LLMConfirmationProps {
    onUpdate: () => void;
    onClose: () => void;
    type: string;
    title: string;
    description: string;
    dateTime: string;
    endDate: string;
}

const LLMConfirmation: React.FC<LLMConfirmationProps> = ({
    onUpdate,
    onClose,
    type,
    title,
    description,
    dateTime,
    endDate,
    }) => {

    const [activeTab, setActiveTab] = useState<string | null>('Event');
    const [information, setInformation] = useState(false)
    
    const [header, setHeader] = useState('')
    const [summary, setSummary] =  useState('')
    const [eventTime, setEventTime] = useState('')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endingDate, setEndingDate] = useState<Date | null>(null)

    useEffect(() => {
        if (type !== 'NONE') {
            setActiveTab(type)
            if (title !== 'UNSPECIFIED') setHeader(title)
            if (description !== 'UNSPECIFIED') setSummary(description)
            if (dateTime !== 'UNSPECIFIED') formatDates()
        }
        setInformation(true)
    }, []);

    function formatDates() {
    
        const startDateTime = new Date(dateTime);
        const endDateTime = endDate !== 'UNSPECIFIED' ? new Date(endDate) : null;
    
        const eventHours = startDateTime.getUTCHours().toString().padStart(2, '0');
        const eventMinutes = startDateTime.getUTCMinutes().toString().padStart(2, '0');
        const eventTime = `${eventHours}:${eventMinutes}`;
    
        setStartDate(startDateTime);
        setEndingDate(endDateTime);
        setEventTime(eventTime);
    }
    
    

    return (
        <Tabs value={activeTab} onChange={setActiveTab} color="orange" variant="pills" radius="xl">
            <Tabs.List style={{marginBottom : 20}} justify='center' grow>
                <Tabs.Tab value="Event" fw={650}>+ Event</Tabs.Tab>
                <Tabs.Tab value="Assignment"fw={650}>+ Assignment</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Event">
                    {information && 
                    <NewEvent
                        onUpdate={onUpdate}
                        onClose={onClose}
                        title={header}
                        description={summary}
                        startDate={startDate}
                        endDate={endingDate}
                        eventTime={eventTime}/> }
            </Tabs.Panel>
            <Tabs.Panel value="Assignment">
                    {information && 
                    <NewReminder 
                        onClose={close} 
                        onUpdate={onUpdate}
                        title={header}
                        description={summary}
                        dueDate={startDate}/> }
            </Tabs.Panel>
        </Tabs>             
    );
};

export default LLMConfirmation;
