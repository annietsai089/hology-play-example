
import { Actor, BaseActor, inject, Parameter, PointerEvents, ViewController, World } from "@hology/core/gameplay";
import { CameraActor } from "@hology/core/gameplay/actors";
import { ComponentsMat4Node, ConstantMat4Node, float, glslFunction, Mat4Node, mix, NodeShaderMaterial, rgba, select, transformed, uniformBool, uniforms, Vec4Node } from "@hology/core/shader-nodes";
import { map, merge, takeUntil } from "rxjs";
import { BufferGeometry, Material, Matrix4, Mesh, MeshBasicMaterial, Object3D, Sprite, SpriteMaterial, SRGBColorSpace, TextureLoader } from "three";
import * as Fonts from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { texts } from "../content";
import GameState from "../services/state";
import TweenService from "../services/tween";
import FocusPosition from "./focus-position";


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

const buttonOptions = Object.entries(texts).map(([key, {title}]) => ({name: title, value: key}))

@Actor()
class FocusButton extends BaseActor {

  @Parameter()
  focusPosition?: FocusPosition

  @Parameter({options: buttonOptions, type: String})
  textKey?: keyof typeof texts

  /*

  When click, set the selected text. 
  These texts can be defined in a separate typescript file

  texts[this.textKey]

  When you click somewhere or lose focus, it needs to remove the text. 
  I think another approach to this is that you select focus and that itself 
  makes the text show and the camera to move. 
  
  
  To show the text, use the game state. 
  Update the state using a function or signal. 
  The UI is using the signal to display the correct thing. 

  I think I could have used a signal for the focused target 

  Also, maybe the text should be selected on the camera not the button. 
  Doesn't really matter though

  */

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

  async onInit(): Promise<void> {

    //const buttonMaterialInstance = buttonMaterial.clone()
    //const textGeometry = new TextGeometry("!", {font: new Font(Fonts), size: 1, height: .1})
    //textGeometry.scale(0.2, 0.2, 0.2)
    //const buttonMesh = new Mesh<BufferGeometry, Material>(textGeometry, buttonMaterialInstance)
    const texture = await new TextureLoader().loadAsync('/info.png')
    texture.colorSpace = SRGBColorSpace
    const buttonMesh = new Sprite(new SpriteMaterial({map: texture}))
    const initScale = 0.2
    const hoverScale = 0.26
    buttonMesh.scale.set(initScale, initScale, initScale)
    buttonMesh.material.userData.hasBloom = false
    this.object.add(buttonMesh)

    if (this.focusPosition == null) {
      //buttonMesh.material = missingTargetMaterial
    }

    this.isHovering(buttonMesh).subscribe((hover) => {
      if (hover) {
        buttonMesh.scale.set(hoverScale, hoverScale, hoverScale)
      } else {
        buttonMesh.scale.set(initScale, initScale, initScale)
      }
      //buttonMaterialInstance.uniforms.hover.value = hover 
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
        if (this.textKey != null) {
          this.state.text.value = texts[this.textKey]
        }
      } else {
        this.tween.moveObject(mainCamera.object, this.state.cameraStartObj)
        this.state.text.value = undefined
      }
    })
  }

  onBeginPlay() {

  }

  onEndPlay() {

  }

}

export default FocusButton
