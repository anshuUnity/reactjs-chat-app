import React, { useState } from 'react'

export default function MessageInput(props) {
    const [inputValue, setInputValue] = useState('');
    const sender_id = localStorage.getItem("userid")

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
    }

    const handleSendMessage = () => {
        
        if(inputValue.trim() !== "" && sender_id !== undefined){
            const messageObj = {
                "message":inputValue,
                "id": sender_id
            }
            props.socket.send(JSON.stringify(messageObj))
            console.log("MESSAGE SEND")
            setInputValue("")
        }
    }
  return (
    <div className='message-input'>
        <textarea 
            placeholder='Type your message'
            value={inputValue}
            onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}
