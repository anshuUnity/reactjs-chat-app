import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import UserItems from './UserItems';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Sidebar() {

  const [userlist, setuserlist] = useState([]);
  const [userLoader, setuserLoader] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000/";
  const getAuthTokenFromCookie = () =>{
    const cookies = document.cookie.split(';');
    for(const cookie of cookies){
      const [name, value] = cookie.trim().split("=");
      if(name === 'token'){
        return value;
      }
    }
    return null
  }

  useEffect(() => {
    const authToken = getAuthTokenFromCookie()

    if(authToken){
      axios.get(`${BASE_URL}api/users/`, {
        headers:{
          'Authorization': `Bearer ${authToken}`
        }
      }).then(response => {
        setuserlist(response.data);
        setuserLoader(false);
      }).catch(error => {
        console.error('Error making API request:', error);
      })
    }
  }, [])

  return (
    <div className='sidebar'>
      {userLoader ? (<Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>):
      (<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {userlist.map((user, index) => (
          <UserItems key={index} email={user.email} name={`${user.first_name} ${user.last_name}`} id={user.id}></UserItems>
        ))}
      </List>)
      }
    </div>
  )
}
