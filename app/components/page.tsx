'use client'
import { supabase } from "../supabase/client";
import { useEffect } from "react";

export default function test() {

  useEffect(() => {
    // Fetch the current session and update the accessToken state
    supabase.auth.getSession().then((response: any) => {
      const token = response.data.session?.access_token;
      if (token) {
        // call api test functions with this token as Bearer
        console.log('testing delete');
        testDELETE(token, "3");
        // Other test calls can be added here
      }
    });
  }, []);

  // Function to fetch reminder data from Flask backend
  const testGET = async (token : string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/todo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.log('Unauthorized');
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const testPOST = async (token: string) => {
    try {
      // Define the new reminder object
      const newReminder = {
        title: "Finish Project",
        description: "Complete the final phase of the project",
        due: "2023-01-20T10:00:00" // Use ISO 8601 format for timestamps
      };

      // Send a POST request to the Flask backend
      const response = await fetch('http://127.0.0.1:5000/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReminder)
      });

      if (response.status === 401) {
        console.log('Unauthorized');
      } else if (response.status === 201) {
        console.log('Reminder created successfully');
        const data = await response.json();
        console.log(data);
      } else {
        console.log('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const testPUT = async (token : string, reminderId : string) => {
    try {
      // Define the updated reminder details
      const updatedReminder = {
        title: "Updated Reminder Title",
        description: "Updated description",
        // ... other fields you want to update
      };

      // Send a PUT request to the Flask backend
      const response = await fetch(`http://127.0.0.1:5000/todo/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedReminder)
      });

      if (response.status === 401) {
        console.log('Unauthorized');
      } else if (response.status === 200) {
        console.log('Reminder updated successfully');
        const data = await response.json();
        console.log(data);
      } else {
        console.log('Failed to update reminder');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const testDELETE = async (token : string, reminderId : string) => {
    try {
      // Send a DELETE request to the Flask backend
      const response = await fetch(`http://127.0.0.1:5000/todo/${reminderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.log('Unauthorized');
      } else if (response.status === 200) {
        console.log('Reminder deleted successfully');
      } else {
        console.log('Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <>
      Testing page. Everything will occur in the console.
    </>
  )
}
