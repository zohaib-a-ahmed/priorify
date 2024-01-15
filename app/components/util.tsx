
export async function fetchEvents(token : string){
    try {
        const response = await fetch('http://127.0.0.1:5000/calendar', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.status === 401) {
            // Unauthorized
            return 401
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
      const response = await fetch('http://127.0.0.1:5000/todo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Unauthorized
        return 401
      } else {
        const data = await response.json();
        return data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };