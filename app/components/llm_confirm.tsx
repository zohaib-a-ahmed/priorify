import { useEffect, useState } from 'react';
import { Tabs, Center } from '@mantine/core';

interface LLMConfirmationProps {
    type: string;
    title: string;
    description: string;
    dateTime: string;
    endDate: string;
}

const LLMConfirmation: React.FC<LLMConfirmationProps> = ({
    type,
    title,
    description,
    dateTime,
    endDate,
    }) => {

    const [activeTab, setActiveTab] = useState<string | null>('Event');
    const [eventTime, setEventTime] = useState('')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endingDate, setEndingDate] = useState<Date | null>(null)

    useEffect(() => {
        if (type !== 'NONE') setActiveTab(type)
        formatDates()
    }, [])

    function formatDates() {

        const startDateTime = new Date(dateTime);
        const endDateTime = endDate ? new Date(endDate) : null;
    
        const eventHours = startDateTime.getHours().toString().padStart(2, '0');
        const eventMinutes = startDateTime.getMinutes().toString().padStart(2, '0');
        const eventTime = `${eventHours}:${eventMinutes}`;
    
        setStartDate(startDateTime);
        setEndingDate(endDateTime);
        setEventTime(eventTime);
    }
    

    return (
        <div>
            <Center>
                <Tabs value={activeTab} onChange={setActiveTab} color="orange" variant="pills" radius="xl">
                    <Tabs.List style={{marginBottom : 20}}>
                        <Tabs.Tab value="Event" fw={650}>+ Event</Tabs.Tab>
                        <Tabs.Tab value="Assignment"fw={650}>+ Assignment</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="Event">
                        <Center>
                            {title}
                            {description}
                            {dateTime}
                        </Center>
                    </Tabs.Panel>
                    <Tabs.Panel value="Assignment">
                        <Center>
                            {title}
                            {description}
                        </Center>
                    </Tabs.Panel>
                </Tabs>             
            </Center>
        </div>
    );
};

export default LLMConfirmation;
