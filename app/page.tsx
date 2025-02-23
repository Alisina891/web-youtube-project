'use client'
import { useState } from 'react';
import Header from './components/Header'
import Main from './components/Main'

export default function Home() {
  const [light  , setLight ] = useState(false);
 

  const handleChangeColor = () => {
    setLight((preve) => !preve);
    
  }
  
  return (
    <div className={`bg-${light === true ? "white" : "black"}`}>
      <Header 
       light={light}
       setLight={setLight}
       onClick={handleChangeColor}/>
       
       <Main  light={light}/>
    </div>
  );
}
