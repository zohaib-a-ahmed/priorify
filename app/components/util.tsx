
export async function fetchEvents(token : string){
    try {
        const response = await fetch('https://priorify-api.onrender.com/calendar', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.status === 401) {
            // Unauthorized
            return response
        } else {
            const data = await response.json();
            return data
        }
      } catch (error) {
            console.error('Error fetching data:', error);
      }
};

export async function fetchReminders(token : string){
    try {
      const response = await fetch('https://priorify-api.onrender.com/todo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Unauthorized
        return response
      } else {
        const data = await response.json();
        return data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

export async function deleteEvent(eventId: number, token: string) {

  try {
    const response = await fetch(`https://priorify-api.onrender.com/calendar/${eventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      // Unauthorized
      return response;
    } else if (response.status !== 200) {
      throw new Error(`Failed to delete event with status: ${response.status}`);
    }

    return response; 
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error; 
  }
}

export async function createEvent(token: string, event : any) {

  try {
    const response = await fetch('https://priorify-api.onrender.com/calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });

    if (response.status === 401) {
      return response
    } else if (response.status === 201) {
      console.log('Event created successfully');
      const data = await response.json();
      return data
    } else {
      console.log('Failed to create event');
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

export async function createReminder(token: string, event : any) {

  try {
    const response = await fetch('https://priorify-api.onrender.com/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });

    if (response.status === 401) {
      return response
    } else if (response.status === 201) {
      console.log('Assignment created successfully');
      const data = await response.json();
      return data
    } else {
      console.log('Failed to create assignment');
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

export async function deleteReminder(reminderId: number, token: string) {

  try {
    const response = await fetch(`https://priorify-api.onrender.com/todo/${reminderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      // Unauthorized
      return response;
    } else if (response.status !== 200) {
      throw new Error(`Failed to delete event with status: ${response.status}`);
    }

    return response; 
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error; 
  }
}

export async function fetchLLMResponse(token: string, command: string, currDate: string) {
  try {
    const response = await fetch('https://priorify-api.onrender.com/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ input: command, date: currDate })
    });

    if (response.status === 401) {
      console.log('Unauthorized');
      return response

    } else if (response.ok) { 
      const data = await response.json();
      return data;
    } else {
      console.log('Failed to process command');
      // Handle other errors
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};