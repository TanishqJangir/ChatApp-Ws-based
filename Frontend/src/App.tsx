
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["hi", "hii there"]);
  const wsRef = useRef<WebSocket | null>(null);

  const messageRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }


    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }


    wsRef.current = ws;

    return () => ws.close();

  }, [])


  function sendMessage() {
    const chatMessage = messageRef.current?.value;

    if (!chatMessage || !wsRef.current) return;

    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: {
        message: chatMessage
      }
    }))

    if(messageRef.current){
    messageRef.current.value = "";
    }
  }



  return (
    <>
      <div className='h-screen bg-black w-screen flex flex-col justify-center'>


        <div className='h-[95%]'>

          <div className='flex gap-2 pl-8 pt-8 flex-col items-start'>
            {messages.map((msg, index) => (
              <div key={index} className='bg-gray-200 p-2 pr-4 rounded-md max-w-[60%] wrap-break-word'>{msg}</div>
            ))}
          </div>

        </div>




        <div className='h-[5%] flex justify-center gap-1 fixed bottom-0 left-1/3'>

          <input type='text'
            ref={messageRef}
            placeholder='enter text'
            className='text-2xl text-white pl-4 rounded-md border-2 outline-none'
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
          />

          <button className='cursor-pointer bg-red-200 rounded-md px-9 w-full' onClick={sendMessage}>Send Message</button>

        </div>
      </div>
    </>

  )
}

export default App





