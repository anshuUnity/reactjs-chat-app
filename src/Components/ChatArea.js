import React, { useEffect, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import withAuthentication from '../utils/withAuthentication'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom'

function ChatArea() {
  const BASE_URL_SOCKET = "ws://127.0.0.1:8000/";
  const {id} = useParams();
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
    if(authToken && id !== undefined){
      const socket = new WebSocket(`${BASE_URL_SOCKET}ws/chat/${id}/?token=${authToken}`)
      socket.onopen = function(e){
        console.log("CONNECTION ESTABLISHED");
      }

      socket.close = function(e){
        console.log("CONNECTION CLOSED");
      }

      socket.onerror = function(e){
        console.log("ERROR ", e);
      }

      socket.onmessage = function(e){
        
      }
    }
  }, [id])
  return (
    <>
    <div className='chat-container'>
    <Sidebar/>
      <div className='chat-area'>
          <div className='chat-header'></div>
          <div className='messages'>
              <Message text="Hey, how's it going" sent/>
              <Message text="I am good" recieved/>
          </div>
          <MessageInput/>
      </div>
    </div>
    </>
  )
}
export default ChatArea