import { Service, GameInstance, inject, World, ViewController } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { Object3D, Quaternion, Vector3 } from 'three';
import { signal } from '@preact/signals-react';

export type TextContent = {
  title: string
  body: string
  link?: string
}

@Service()
class GameState {
  cameraStartObj = new Object3D()

  text = signal<TextContent>()

  init(camera: CameraActor) {
    this.cameraStartObj.position.copy(camera.object.position)
    this.cameraStartObj.quaternion.copy(camera.object.quaternion)
  }
}

export default GameState
