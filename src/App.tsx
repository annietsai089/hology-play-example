import 'reflect-metadata'
import './App.css';
import { HologyScene, useService } from '@hology/react'
import shaders from './shaders'
import actors from './actors'
import Game from './services/game'
import GameState from './services/state';
import { useEffect } from 'react';

function TextView() {
  const state = useService(GameState)
  const text = state.text.value

  useEffect(() =>  {
    console.log("text", text)
  }, [text])
  
  
  if (text == null) {
    return <div className="text-box gradient-bg">
    <h1>Founders Story<br/>Click & Learn</h1>
  
  </div>
  }


  return <div className="text-box gradient-bg">
    <h1>{text.title}</h1>
    <p>{text.body}</p>
    {text.link && <p>
      <a href={text.link}>Read more</a>
      </p>}
    <button onClick={() => state.return()}>Go back</button>
  </div>
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function App() {
  return (
    <div>
      <HologyScene gameClass={Game} sceneName='main' dataDir='data' shaders={shaders} actors={actors} 
      rendering={{
        resolutionScale: 1,
        maxPixelRatio: window.devicePixelRatio,
        shadows: {
          enabled: !isMobile,
          autoUpdate: false
        }
      }}>
      <TextView></TextView>
    </HologyScene>
    </div>
  );
}

export default App;