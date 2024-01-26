import { TextInput, Modal, LoadingOverlay } from "@mantine/core"
import { useDisclosure, useToggle } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { fetchLLMResponse } from "./util";
import { useRouter } from "next/navigation";
import LLMConfirmation from "./llm_confirm";

type LLMInput = {
    onUpdate : () => void;
}

const LLMInput: React.FC<LLMInput> = ({ onUpdate }) => {

    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [visible, toggle] = useToggle([false, true]);
    const router = useRouter()

    const [type, setType] = useState('NONE');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token);
          }
        });
      });

    function getCurrDay(){
        // Get the current date
        const currentDate = new Date();
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekdays[currentDate.getDay()];
        const formattedDate = currentDate.toISOString();

        return `Today is ${dayOfWeek}, ${formattedDate}`;
    }

    async function parseCommandWithLLM(command: string) {
        if (accessToken && accessToken.length > 0) {
          toggle()
            fetchLLMResponse(accessToken, command, getCurrDay()).then((response : any) => {
                if (response == 401 || response == 500)
                // Unauthorized, redirect
                router.push('/')
                else {
                    console.log(response.details)
                    setType(response.details.Type)
                    setTitle(response.details.Title)
                    setDescription(response.details.Description)
                    setDateTime(response.details.Date)
                    setEndDate(response.details.End)
                    open()
                }
                toggle()
            })
        }
    };

    function handleClose(){
        setType('');
        setTitle('');
        setDescription('');
        setDateTime('');
        setEndDate('');
        close();
    }

    return (
        <>
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'orange', type: 'bars' }}
          />
        <TextInput
            variant='filled'
            placeholder="How would you like me to assist you today?"
            description='Google Gemini Assistant'
            size="md"
            radius="md"
            style={{ width: '100%'}}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputValue.length > 0) parseCommandWithLLM(inputValue)
                setInputValue(''); // Clear the input field
              }
            }}
          />
        <Modal opened={opened} onClose={() => handleClose()} title="Confirmation" radius='lg'>
            <LLMConfirmation
                onClose={handleClose}
                onUpdate={onUpdate}
                type={type}
                title={title}
                description={description}
                dateTime={dateTime}
                endDate={endDate}
            />
        </Modal> 
        </>
    )
}

export default LLMInput