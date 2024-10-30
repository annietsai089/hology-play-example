
import { Actor, BaseActor, inject, Parameter, PointerEvents, ViewController, World } from "@hology/core/gameplay";
import FocusPosition from "./focus-position";
import { BoxGeometry, BufferGeometry, Material, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, SphereGeometry, Vector3 } from "three";
import { CameraActor } from "@hology/core/gameplay/actors";
import TweenService from "../services/tween";
import { ComponentsMat4Node, ConstantMat4Node, float, glslFunction, Mat4Node, mix, NodeShaderMaterial, rgba, select, transformed, uniformBool, uniforms, Vec4Node } from "@hology/core/shader-nodes";
import { map, merge, takeUntil } from "rxjs";
import Game from "../services/game";
import GameState from "../services/state";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const buttonMaterial = (()=>{
  const isHovered = uniformBool('hover', false)

  const hoverScale = 1.2
  const noTransform = new Matrix4().identity()
  //const scaleTransform = new Matrix4().makeScale(hoverScale, hoverScale, hoverScale)
  const scaleTransform = new Matrix4().makeScale(hoverScale, hoverScale, hoverScale)
  // new ConstantMat4Node(scaleTransform)
  const scaleTransform2 = new ComponentsMat4Node(float(hoverScale), float(0), float(0), float(0),
                                                 float(0), float(hoverScale), float(0), float(0),
                                                 float(0), float(0), float(hoverScale), float(0),
                                                 float(0), float(0), float(0),           float(1),
      )

  return new NodeShaderMaterial({
    color: select(isHovered, rgba(0x00A3FF), mix(rgba(0x00A3FF), rgba('white'), float(.2))),
    transform: select<Mat4Node>(isHovered, scaleTransform2, new ConstantMat4Node(noTransform))
  })
})()

const gl_Position = glslFunction(Vec4Node, {position: transformed.position, modelViewMatrix: uniforms.modelViewMatrix}, /*glsl*/`
  vec2 center = vec2(0.5, 0.5);
  float rotation = 0.0;
  vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
  // Using scale form instance matrix instead of modelMatrix
  vec2 scale;
  scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
  scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

  // This times 2 on scale seem to make it appear like when using regular sprites. 
  // Not sure if this is correct though.
  vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * (scale);

  vec2 rotatedPosition;
  rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
  rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

  mvPosition.xy += rotatedPosition;
  return projectionMatrix * mvPosition;
`)

const missingTargetMaterial = new MeshBasicMaterial({color: 'red'})

@Actor()
class FocusButton extends BaseActor {

  @Parameter()
  focusPosition?: FocusPosition

  pointerEvents = inject(PointerEvents)
  view = inject(ViewController)
  world = inject(World)
  tween = inject(TweenService)
  state = inject(GameState)

  private focused = false

  private isHovering(mesh: Object3D) {
    return merge(
      this.pointerEvents.onPointerEnterObject3D(mesh).pipe(map(() => true)),
      this.pointerEvents.onPointerLeaveObject3D(mesh).pipe(map(() => false))
    ).pipe(takeUntil(this.disposed))
  }

  onInit(): void | Promise<void> {

    const buttonMaterialInstance = buttonMaterial.clone()
    const textGeometry = new TextGeometry("adam")
    textGeometry.scale(0.2, 0.2, 0.2)
    const buttonMesh = new Mesh<BufferGeometry, Material>(textGeometry, buttonMaterialInstance)
    this.object.add(buttonMesh)

    if (this.focusPosition == null) {
      buttonMesh.material = missingTargetMaterial
    }

    this.isHovering(buttonMesh).subscribe((hover) => {
      buttonMaterialInstance.uniforms.hover.value = hover 
    })
    
    this.pointerEvents.onClickActor(this).subscribe(() => {
      const mainCamera = this.world.findActorByType(CameraActor)
      if (mainCamera == null) {
        throw "Camera not found"
      }
      this.focused = this.focusPosition?.position.equals(mainCamera.position) ?? false

      if (!this.focused) {
        if (this.focusPosition != null) {
          this.tween.moveObject(mainCamera.object, this.focusPosition?.object)
        }        
      } else {
        this.tween.moveObject(mainCamera.object, this.state.cameraStartObj)
      }

    })
  }

  onBeginPlay() {

  }

  onEndPlay() {

  }

}

export default FocusButton
