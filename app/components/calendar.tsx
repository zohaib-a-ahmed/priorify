import { SimpleGrid, Text, Center, Button, Group, Modal, Divider } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Event, Reminder } from '../supabase/types';
import { fetchEvents, fetchReminders } from './util';
import { useRouter } from 'next/navigation';
import CalendarDate from './date';
import NewEvent from './createEvent';

type CalendarProps = {
  key : number;
}

const CalendarComponent: React.FC<CalendarProps> = ( key ) => {

    const [accessToken, setAccessToken] = useState<string>("")
    const [events, setEvents] = useState<Event[]>([])
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [currentDate, setCurrentDate] = useState(new Date());
    const [opened, { open, close }] = useDisclosure(false);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const router = useRouter();

    const getMonthDays = (year : number, month : number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year : number, month : number) => new Date(year, month, 1).getDay();
  

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            fetchEvents(token).then((response : any) => {
              if (response == 401)
                // Unauthorized, redirect
                router.push('/')
              else setEvents(response)
            })
            fetchReminders(token).then((response : any) => {
              if (response == 401)
                // Unauthorized, redirect
                router.push('/')
              else setReminders(response)
            })
            setAccessToken(token);
          }
        });
      }, [key]);

    const formatDate = (year : number, month : number, day : number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const goToPreviousMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
    };
    
    const goToNextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
    };

    function retrieveMatching(data: (Event | Reminder)[], date: string) {
      return data.filter(item => {
          if ('event_date_start' in item) {
              // Handle Event objects
              const eventStartDate = item.event_date_start;
              const eventEndDate = item.event_date_end || item.event_date_start; // Use start date if end date is not provided
              return date >= eventStartDate && date <= eventEndDate;
          } else if ('due' in item) {
              // Handle Reminder objects
              // Compare only the date part of the due timestamp
              const dueDatePart = item.due.substring(0,10); // Extracts date part (YYYY-MM-DD) from the timestamp
              return date === dueDatePart;
          } else {
              // Return false if the item doesn't match either type
              return false;
          }
      });
    }

    const retrieveEventsAndReminders = (date: string, combinedData : (Event | Reminder)[]) => {
      const filteredData = retrieveMatching(combinedData, date);
      const dayEvents = filteredData.filter(item => 'event_date_start' in item) as Event[];
      const dayReminders = filteredData.filter(item => 'due' in item) as Reminder[];

      return { dayEvents, dayReminders };
  };
    
    const handleUpdate = () => {
      fetchEvents(accessToken).then((response : any) => {
        if (response == 401)
          // Unauthorized, redirect
          router.push('/')
        else setEvents(response)
      })
    };    

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = getFirstDayOfMonth(year, month);
        const totalDays = getMonthDays(year, month);
    
        let days = [];
        const combinedData = [...events, ...reminders];
    
        // Add days from the previous month
        for (let i = firstDay; i > 0; i--) {
            days.push(<CalendarDate onUpdate={handleUpdate} key={`prev-${i}`} month='' date={""} events={[]} reminders={[]}/>);
        }
    
        // Add days of the current month
        for (let i = 1; i <= totalDays; i++) {
            // Format the date to match your events date format
            const formattedDate = formatDate(year, month, i);
            
            const { dayEvents, dayReminders } = retrieveEventsAndReminders(formattedDate, combinedData);

            days.push(<CalendarDate onUpdate={handleUpdate} key={i} date={String(i)} month={currentDate.toLocaleString('default', { month: 'long' })} events={dayEvents} reminders={dayReminders}/>);
        }
    
        // Add days from the next month
        for (let i = totalDays + firstDay, day = 1; i < 35; i++, day++) {
            days.push(<CalendarDate onUpdate={handleUpdate} key={`next-${day}`} date={""} month={""} events={[]} reminders={[]}/>);
        }
    
        return days;
    };

    return (
        <>
            <Center style={{ marginBottom: 20, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Group>
                    <Button size='lg' variant="subtle" color="orange" onClick={goToPreviousMonth}>{"<"}</Button>
                    <div className="w-[200px]"> {/* Adjust the width as needed */}
                        <Text size="xl" fw={650} className="text-center">
                            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                        </Text>
                    </div>
                    <Button size='lg' variant="subtle" color="orange" onClick={goToNextMonth}>{">"}</Button>
                </Group>
                <Button size='md' variant="subtle" color="orange" onClick={open} leftSection={<Text>{'+'}</Text>}>{"Event"}</Button>
            </Center>
            <SimpleGrid cols={7} verticalSpacing='xl' style={{ marginBottom: 10 }}>
                {days.map((day, index) => (
                    <Center key={index}>
                        <Text fw={700}>{day}</Text>
                    </Center>
                ))}
            </SimpleGrid>
            <SimpleGrid cols={7} verticalSpacing="xl">
                {(events && events.length > 0) ? renderCalendar() : null}
            </SimpleGrid>
            <Modal opened={opened} onClose={close} title="Create Event" radius='lg'>
                <NewEvent onUpdate={handleUpdate} onClose={close}></NewEvent>
            </Modal>          
        </>
    );
    
}

export default CalendarComponent;
