import { TextInput } from "@mantine/core"
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { fetchLLMResponse } from "./util";
import { useRouter } from "next/navigation";

const LLMInput = () => {

    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [details, setDetails] = useState(null)
    const router = useRouter()
  
    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
          const token = response.data.session?.access_token;
          if (token) {
            setAccessToken(token);
          }
        });
      });


    async function parseCommandWithLLM(command: string) {
        if (accessToken && accessToken.length > 0) {
            fetchLLMResponse(accessToken, command).then((response : any) => {
                console.log(response)
                if (response == 401 || response == 500)
                // Unauthorized, redirect
                router.push('/')
                else setDetails(response)
            })
        }
    };

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
        </>
    )
}

export default LLMInput