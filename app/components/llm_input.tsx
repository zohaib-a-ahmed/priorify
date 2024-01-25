import { TextInput, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { fetchLLMResponse } from "./util";
import { useRouter } from "next/navigation";

const LLMInput = () => {

    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [details, setDetails] = useState(null)
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter()
  
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
            fetchLLMResponse(accessToken, command, getCurrDay()).then((response : any) => {
                if (response == 401 || response == 500)
                // Unauthorized, redirect
                router.push('/')
                else {
                    setDetails(response)
                    open()
                }
            })
        }
    };

    function handleClose(){
        setDetails(null)
        close()
    }

    return (
        <>
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
            ooga booga
        </Modal> 
        </>
    )
}

export default LLMInput