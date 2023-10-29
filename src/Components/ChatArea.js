import React, { useEffect, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import withAuthentication from '../utils/withAuthentication'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom'

function ChatArea() {
  const BASE_URL_SOCKET = "ws://127.0.0.1:8000/";
  const [socket, setSocket] = useState(null);
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
    console.log(id);
    if(authToken && id !== undefined){
      const newsocket = new WebSocket(`${BASE_URL_SOCKET}ws/chat/${id}/?token=${authToken}`)
      newsocket.onopen = function(e){
        console.log("CONNECTION ESTABLISHED");
      }

      newsocket.close = function(e){
        console.log("CONNECTION CLOSED");
      }

      newsocket.onerror = function(e){
        console.log("ERROR ", e);
      }

      newsocket.onmessage = function(e){
        const data = JSON.parse(e.data);
        console.log(data, "ONMESSAGE");
      }

      // function sendMessage(messageObject){
      //   socket.send(JSON.stringify(messageObject))
      // }

      // const sendMessage = (messageObject) =>{
      //   socket.send(JSON.stringify(messageObject))
      // }
      setSocket(newsocket)
      // Clean up the WebSocket when the component unmounts
      return () => {
        newsocket.close();
      };
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
          <MessageInput socket={socket}/>
      </div>
    </div>
    </>
  )
}
export default ChatArea