import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Navigate from './Components/Navigate';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ChatArea from './Components/ChatArea';
import Sidebar from './Components/Sidebar';


function App() {
  return (
      // <>
      //   <div className='chat-container'>
      //   <Sidebar/>
      //   <ChatArea/>
      //   </div>
      // </>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/chat' element={<><div className='chat-container'><Sidebar/><ChatArea/></div></>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
