import { Service, GameInstance, inject, World, ViewController } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { Object3D, Quaternion, Vector3 } from 'three';
import GameState from './state';

@Service()
class Game extends GameInstance {
  view = inject(ViewController)
  world = inject(World)
  state = inject(GameState)
  // TODO Make rapier world hidden somehow

  cameraStartObj = new Object3D()

  constructor() {
    super()
    console.log("new game")
  }

  onStart() {
    
    const camera = this.world.findActorByType(CameraActor)
    this.view.setCamera(camera)

    this.state.init(camera)
  }
}

export default Game
