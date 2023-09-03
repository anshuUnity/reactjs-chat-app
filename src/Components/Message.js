import React from 'react'

export default function Message({text, sent}) {
  return (
    <div className={`message ${sent ? 'sent':'recieved'}`}>
        <div className='message-bubble'>{text}</div>
    </div>
  )
}
