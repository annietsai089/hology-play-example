
import { Actor, attach, BaseActor } from "@hology/core/gameplay";
import { CameraComponent } from "@hology/core/gameplay/actors";

@Actor()
class FocusPosition extends BaseActor {

  camera = attach(CameraComponent)
  
  onInit(): void | Promise<void> {
    
  }

  onBeginPlay() {

  }

  onEndPlay() {

  }

}

export default FocusPosition
