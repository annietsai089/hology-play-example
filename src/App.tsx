import 'reflect-metadata'
import './App.css';
import { HologyScene, useService } from '@hology/react'
import shaders from './shaders'
import actors from './actors'
import Game from './services/game'
import GameState from './services/state';

function TextView() {
  const state = useService(GameState)
  const text = state.text.value
  if (text == null) {
    return false
  }
  
  return <>
    <h1>{text.title}</h1>
    <p>{text.body}</p>
    {text.link && <a href={text.link}></a>}
  </>
}

function App() {
  return (
    <HologyScene gameClass={Game} sceneName='main' dataDir='data' shaders={shaders} actors={actors}>
      <TextView></TextView>
    </HologyScene>
  );
}

export default App;