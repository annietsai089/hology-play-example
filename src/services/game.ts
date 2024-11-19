import { GameInstance, inject, Service, ViewController, World } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { Object3D, Vector2, Vector3 } from 'three';
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
    document.addEventListener('touchstart', this.handleTouchStart)
    document.addEventListener('touchmove', this.handleTouchMove)
  }

  onShutdown(): void | Promise<void> {
    //document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('touchmove', this.handleTouchMove)
    document.removeEventListener('touchstart', this.handleTouchStart)
  }

  private prevTouch = new Vector2()
  private newTouch = new Vector2()

  
  private handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length < 1) return
    const touch = event.touches[0]
    this.prevTouch.x = touch.clientX
    this.prevTouch.y = touch.clientY  
  }

  private handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length < 1) return
    const touch = event.touches[0]
  
    this.newTouch.x = touch.clientX
    this.newTouch.y = touch.clientY  
  
    const diffX = this.newTouch.x - this.prevTouch.x
  

    // I am currently rotating the camera now but it is the actor that rotates which 
    // makes it weird.

    const camera = this.view.getCamera().parent
    if (camera == null) {
      console.log("no parent camera")
      return
    }
    if (this.tween.isTweening(camera.parent!)) {
      console.log("Can not rotate while tweening")
      return
    }

    const rotationFactor = 0.003
    camera.rotateOnWorldAxis(vecY, diffX * rotationFactor)
    this.prevTouch.copy(this.newTouch)
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (isTouchDevice()) {
      return
    }
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

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     // @ts-expect-error In some browsers
     (navigator['msMaxTouchPoints'] > 0));
}

export default Game
