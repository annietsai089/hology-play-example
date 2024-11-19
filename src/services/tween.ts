import { inject, Service, ViewController } from '@hology/core/gameplay';
import { takeWhile } from 'rxjs';
import { Object3D, Quaternion, Vector3 } from 'three';

@Service()
class TweenService {
  
  view = inject(ViewController)

  private objects = new Set<Object3D>()

  isTweening(object: Object3D) {
    return this.objects.has(object)
  }

  moveObject(object: Object3D, target: Object3D) {
    if (this.objects.has(object)) {
      // Avoid starting multiple tweens.
      // There could be better ways to do this
      return
    }
    this.objects.add(object)
    let done = false
    // TODO Handle object already being animated. It should stop the update
    // TODO Automatically cancel subscription after some time. 
    // TODO Use world position so that objects can be grouped. 
    const startPos = object.getWorldPosition(new Vector3())
    const startRot = object.getWorldQuaternion(new Quaternion())
    const targetPos = target.getWorldPosition(new Vector3())
    const tartgetRot = target.getWorldQuaternion(new Quaternion()) 
    let a = 0
    this.view.onUpdate().pipe(takeWhile(() => !done)).subscribe(dt => {
      if (a >= 1) {
        done = true
        this.objects.delete(object)
        return
      }
      a += dt
      if (a > 1) {
        a = 1
      }
      object.position.lerpVectors(startPos, targetPos, a)
      object.quaternion.slerpQuaternions(startRot, tartgetRot, a)
    })
  }

}

export default TweenService
