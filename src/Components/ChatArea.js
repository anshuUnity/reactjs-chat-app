import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import withAuthentication from '../utils/withAuthentication'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

function ChatArea() {
  const BASE_URL_SOCKET = "ws://127.0.0.1:8000/";
  const BASE_URL_API = "http://127.0.0.1:8000/";
  const [socket, setSocket] = useState(null);
  const [messagesLoading, setmessagesLoading] = useState(false);
  const [messageData, setMessageData] = useState([]);
  const [token, setToken] = useState(null);
  const [hasMore, sethasmore] = useState(true)
  const [next, setNext] = useState(null)
  const {id} = useParams();

  const getAuthTokenFromCookie = () =>{
    const cookies = document.cookie.split(';');
    for(const cookie of cookies){
      const [name, value] = cookie.trim().split("=");
      if(name === 'token'){
        setToken(value)
        return value;
      }
    }
    return null
  }

  const get_previous_messages = (id, cookie) => {
    if(messagesLoading) return;
    setmessagesLoading(true)
    var url = ``
    if(next === null){
      url = `${BASE_URL_API}api/chat/${id}/`
    }else{
      url = next
    }
    axios.get(url, {
      headers:{
        'Authorization': `Bearer ${cookie}`
      }
    }).then(response => {
      if(response.data.next !== null){
        setNext(response.data.next)
        sethasmore(true)
      }else{
        sethasmore(false)
      }
      var datalist = []
      response.data.results.forEach(element => {
        if(element.sender_id == localStorage.getItem("userid")){
          // setMessageData([...messageData, {"message":data.message,"sent":true}])
          datalist.push({"message":element.message,"sent":true})
        }else{
          // setMessageData([...messageData, {"message":data.message,"sent":false}])
          datalist.push({"message":element.message,"sent":false})
        }
      });
      setMessageData(messageData.concat(datalist))
      setmessagesLoading(false)
    }).catch(error => {
      console.error('Error making API request:', error);
      setmessagesLoading(false)
    })
  }

  useEffect(() => {
    const authToken = getAuthTokenFromCookie()

    if(authToken && id !== undefined){
      get_previous_messages(id, authToken)
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
      setSocket(newsocket)
      // Clean up the WebSocket when the component unmounts
      return () => {
        newsocket.close();
      };
    }
  }, [id])

  useEffect(() => {
    if(socket !== null){
      socket.onmessage = function(e){
        const data = JSON.parse(e.data);
        console.log(data, "ONMESSAGE");
        if(data.id === localStorage.getItem("userid")){
          setMessageData([{"message":data.message,"sent":true}, ...messageData])
        }else{
          setMessageData([{"message":data.message,"sent":false}, ...messageData])
        }
      }
    }
  }, [messageData, socket])


  return (
    <>
      <div className='chat-container'>
        <Sidebar/>
        <div className='chat-area'>
          <div className='chat-header'></div>
          <div className='messages' id="scrollableDiv">
            {messageData.length === 0 ? (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">No Messages Yet</Alert>
              </Stack>
            ) : (
              <InfiniteScroll
                dataLength={messageData.length}
                next={() => get_previous_messages(id, token)}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
                loader={<Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>}>

              {messageData.map((message, index) => (
                <Message text={message.message} sent={message.sent} key={index} />
              ))}
              </InfiniteScroll>
            )}
          </div>
          <MessageInput socket={socket} />
        </div>
      </div>
    </>

  )
}
export default ChatArea