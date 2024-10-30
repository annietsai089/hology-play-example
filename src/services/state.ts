import { Service, GameInstance, inject, World, ViewController } from '@hology/core/gameplay';
import { CameraActor } from '@hology/core/gameplay/actors';
import { Object3D, Quaternion, Vector3 } from 'three';

@Service()
class GameState {
  cameraStartObj = new Object3D()

  init(camera: CameraActor) {
    this.cameraStartObj.position.copy(camera.object.position)
    this.cameraStartObj.quaternion.copy(camera.object.quaternion)
  }
}

export default GameState
