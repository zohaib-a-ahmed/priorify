import { TextInput } from "@mantine/core"
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

const LLMInput = () => {

    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState('')
  
    useEffect(() => {
          supabase.auth.getSession().then((response: any) => {
            setAccessToken(response.data.session?.access_toke)
          });
      }
    );

    async function parseCommandWithLLM(token: string, command: string) {
        console.log('trying this shit')
        try {
          const response = await fetch('http://127.0.0.1:5000/ai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ input: command })
          });
      
          if (response.status === 401) {
            console.log('Unauthorized');
            // Handle unauthorized error
          } else if (response.ok) { // If the response is successful (status 200-299)
            console.log('Command processed successfully');
            const data = await response.json();
            console.log(data); // Print the output to the console
            return data;
          } else {
            console.log('Failed to process command');
            // Handle other errors
          }
        } catch (error) {
          console.error('Error fetching data:', error);
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
                if (inputValue.length > 0) parseCommandWithLLM(accessToken, inputValue)
                setInputValue(''); // Clear the input field
              }
            }}
          />
        </>
    )
}

export default LLMInput