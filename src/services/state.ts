import { inject, Service, World } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { signal } from '@preact/signals-react';
import { ReactElement } from 'react';
import { Object3D } from 'three';
import TweenService from './tween';

export type TextContent = {
  title: string
  body: string|ReactElement
  link?: string
}

@Service()
class GameState {
  cameraStartObj = new Object3D()

  tween = inject(TweenService)
  world = inject(World)

  text = signal<TextContent>()

  constructor() {
    
  }

  init(camera: CameraActor) {
    this.cameraStartObj.position.copy(camera.object.position)
    this.cameraStartObj.quaternion.copy(camera.object.quaternion)
  }

  return() {
    const mainCamera = this.world.findActorByType(CameraActor)
    this.tween.moveObject(mainCamera.object, this.cameraStartObj)
    this.text.value = undefined
  }
}

export default GameState
