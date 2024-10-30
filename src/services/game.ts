import { Service, GameInstance, inject, World, ViewController } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { Object3D, Quaternion, Vector2, Vector3 } from 'three';
import GameState from './state';
import TweenService from './tween';

@Service()
class Game extends GameInstance {
  view = inject(ViewController)
  world = inject(World)
  state = inject(GameState)
  tween = inject(TweenService)
  cameraStartObj = new Object3D()

  onStart() {
    
    const camera = this.world.findActorByType(CameraActor)
    this.view.setCamera(camera)

    this.state.init(camera)

    document.addEventListener('mousemove', this.handleMouseMove)
  }

  onShutdown(): void | Promise<void> {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  private handleMouseMove = (event: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the relative position from the center
    const relativeX = event.clientX - centerX;
    const relativeY = event.clientY - centerY;

    // Normalize the values to a range of -1 to 1
    const normalizedX = relativeX / centerX;
    const normalizedY = relativeY / centerY;

    const camera = this.view.getCamera()
    //if (this.tween.isTweening(camera.parent!)) {
      //console.log("Can not rotate while tweening")
      //return
    //}

    const rotationFactor = 0.5
    camera.rotation.set(0,0,0)
    //camera.rotation.x = -normalizedY * rotationFactor;
    //camera.rotation.y = -normalizedX * rotationFactor;
    camera.rotateOnWorldAxis(vecX, -normalizedY * rotationFactor)
    camera.rotateOnWorldAxis(vecY, -normalizedX * rotationFactor)
    
  } 
}

const vecX = new Vector3(1,0,0)
const vecY = new Vector3(0,1,0)

export default Game
