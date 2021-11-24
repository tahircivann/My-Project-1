import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from "three/examples/jsm/libs/dat.gui.module"
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xa0a0a0);
const axesHelper = new THREE.AxesHelper(1000)
axesHelper.position.set(0, -10, 0)
scene.add(axesHelper)
const group = new THREE.Group();
const gui = new GUI();
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(0.75, 0.75, 1.0).normalize();
scene.add(directionalLight);
const helper = new THREE.GridHelper(2000, 45);
helper.material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
});
helper.position.y = - 10;
scene.add(helper)
var jsonName = Object;
var jsonAction = new Array;
var jsonCameraOffset = "";
var jsonCameraRotation = "";
var value = -1;

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
scene.add(ambientLight);

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(45, 45, 50.55)
const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
const pickableObjects: THREE.Mesh[] = []
const LOD2level: THREE.Mesh[] = []
controls.screenSpacePanning = true

//Raycasting
let intersectedObjects: THREE.Object3D | null
const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {}
const highlightedMaterial = new THREE.MeshBasicMaterial({
    //wireframe: true,
    color: 0x00ff00,
    transparent: true,
    opacity: 0.7,
})

const lod = new THREE.LOD();
const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]
const loader = new GLTFLoader()
//let m =  new THREE.Mesh
var partnames = new Array
var searchTerm = new Array

var buttonTutorail = {
    StartTutorial: function tutorialfun() {
        function OpenJson(param: any) {
            value++;
            var data = fetch("Tutorials.json")
                .then(response => response.json())
                .then(veri => {
                    console.log(value)
                    console.log(veri.steps[value].name)
                    jsonAction = veri.steps[value].actions;
                    // Highlight Structure Element

                    var liste = { 'name': new Array, 'materials': new Array };
                    for (let abc of Object.values(pickableObjects)) {
                        liste['name'].push(abc.name)
                        liste['materials'].push(abc.material)
                    }
                    console.log(liste)
                    for (var i = 0; i < jsonAction.length; i++) {
                        let name = jsonAction[i].structureName
                        console.log(name)
                        if (liste['name'].includes(name)) {
                            console.log(jsonAction[i].structureName)
                            let index = liste['name'].indexOf(jsonAction[i].structureName)
                            console.log(index)
                            pickableObjects[index].material = new THREE.MeshBasicMaterial({
                                //wireframe: true,
                                color: 0x00ff00,
                                transparent: true,
                                opacity: 0.7,
                            });
                        }
                        //Use Part Names for in Popup for make it invisible or visible
                        partnames = ['BRep_2012_LOD0', 'BRep_2008_LOD0', 'BRep_1955_LOD0']

                        if (liste[`name`].indexOf(jsonAction[i].structureName) && jsonAction[2].structureName) {

                            let index = liste['name'].indexOf(partnames[1])
                            pickableObjects[index].material = new THREE.MeshBasicMaterial({
                                color: 0xff0000,
                                transparent: true,
                                opacity: 0.1,
                                visible: false,
                            })
                        }
                        if (value === 0) {
                            let index = liste['name'].indexOf(partnames[1])
                            pickableObjects.forEach((o: THREE.Mesh, i) => {
                                pickableObjects[index].material = originalMaterials[o.name]
                            })
                        }
                        if (liste[`name`].indexOf(jsonAction[i].structureName) && jsonAction[2].structureName) {
                            let index2 = liste['name'].indexOf(partnames[2])
                            pickableObjects[index2].material = new THREE.MeshBasicMaterial({
                                color: 0xff0000,
                                transparent: true,
                                opacity: 0.1,
                                visible: false,
                            })
                        }
                        if (value === 0) {
                            let index2 = liste['name'].indexOf(partnames[2])
                            pickableObjects.forEach((o: THREE.Mesh, i) => {
                                pickableObjects[index2].material = originalMaterials[o.name]
                            })
                        };
                        if (liste[`name`].indexOf(jsonAction[i].structureName) && jsonAction[2].structureName) {
                            let index3 = liste['name'].indexOf(partnames[0])
                            pickableObjects[index3].material = new THREE.MeshBasicMaterial({
                                color: 0xff0000,
                                transparent: true,
                                opacity: 0.1,
                                visible: false,
                            })

                        };
                    }
                    document.getElementById('content')!.style.display = `block`
                    //Show and Close Popup
                    function togglePopup() {
                        document.getElementById("popup-1")?.classList.toggle("active")
                        var textpopup = document.getElementById("textpop")!.innerHTML = veri.steps[value].name
                        console.log(textpopup)

                    }
                    togglePopup()
                    var closeinfo = document.getElementById("close")
                    if (closeinfo) {
                        closeinfo.addEventListener('click', function () {
                            document.getElementById('content')!.style.display = `none`
                        })

                    }
                    console.log(veri.steps[value].actions)
                    jsonCameraOffset = veri.steps[value].cameraOffset;
                    jsonCameraRotation = veri.steps[value].cameraRotation;
                    console.log(jsonCameraOffset)


                    var cameraCoordinats = jsonCameraOffset.split(",");
                    console.log(jsonCameraOffset)
                    if (cameraCoordinats.length === 3) {
                        camera.position.set(Number(cameraCoordinats[0]), Number(cameraCoordinats[1]), Number(cameraCoordinats[2]))
                        const p = Number(cameraCoordinats[0])
                        const p1 = Number(cameraCoordinats[1])
                        const p2 = Number(cameraCoordinats[2])
                    }
                    console.log(camera.position)
                    console.log(camera.rotation)
                })

            if (value >= 3) {


                pickableObjects.forEach((o: THREE.Mesh, i) => {
                    pickableObjects[i].material = originalMaterials[o.name]
                })
                if (!param) {
                    return
                }
                value = -1
                document.getElementById('content')!.style.display = `none`
                camera.position.set(-6, 12, 80.99)


            }

        }
        OpenJson(param)

    }

};


var tutorialFolder = gui.addFolder("Tutorial")
tutorialFolder.add(buttonTutorail, "StartTutorial")
tutorialFolder.open()

loader.load(
    'models/testNew4LOD.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh && (child as THREE.Mesh).material instanceof THREE.MeshStandardMaterial)) {
                child.castShadow = true
                child.receiveShadow = true
                let m = child as THREE.Mesh
                m.castShadow = true

                // Secilebilir objeler
                // console.log(m.material)
                // Pickable Objects
                pickableObjects.push(m)
                //store reference to original materials for later
                originalMaterials[m.name] = (m as THREE.Mesh).material
            }
        })

        let theResult0 = new THREE.Object3D();
        let theResult1 = new THREE.Object3D();
        let theResult2 = new THREE.Object3D();

        theResult0.add(gltf.scene.getObjectByName("Object_LOD0") as THREE.Mesh)
        theResult1.add(gltf.scene.getObjectByName("Object_LOD1") as THREE.Mesh)
        theResult2.add(gltf.scene.getObjectByName("Object_LOD2") as THREE.Mesh)

        lod.addLevel(theResult0, 30)
        lod.addLevel(theResult1, 60)
        lod.addLevel(theResult2, 80)
        lod.scale.set(0.1, 0.1, 0.1)
        lod.rotation.set(0, -1.5, 1.555)
        lod.position.set(-7, 0, 0)
        scene.add(lod)
    },
    (xhr) => {
        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        //console.log(error)
    }
)
renderer.domElement.addEventListener('dblclick', onDoubleClick, false)
function onDoubleClick(event: MouseEvent) {
    const mouse = {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    }
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(pickableObjects, false)

    if (intersects.length > 0) {
        const p = intersects[0].point
        // camera.lookAt(p.x, p.y, p.z)
        new TWEEN.Tween(camera.position)
            .to({
                x: p.x,
                y: p.y,
                z: p.z
            }, 500)
            .delay(100)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => render())
            .start()
        console.log(intersects.length)
    }
}


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


var LOD0 = ["", false]
var LOD1 = ["", false]
var LOD2 = ["", false]
var selectedObjectName = ""
var isNotLOD = true
function onClick(event: MouseEvent) {
    raycaster.setFromCamera({
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    },
        camera)

    intersects = raycaster.intersectObjects(pickableObjects, false)

    if (intersects.length === 0) {
        intersectedObjects = null
    }
    else {

        if (intersects.length > 0) {
            intersectedObjects = intersects[0].object
            let selectedMesh = intersectedObjects.name
            //add Scene
            const ObjectName = document.querySelector("#ObjectName")
            ObjectName!.innerHTML = selectedMesh.toString()
            //get name LOD
            const tmp = selectedMesh.split("LOD")
            if (tmp.length > 1) {
                let select = tmp[0]
                LOD0 = [select + "LOD0", false]
                LOD1 = [select + "LOD1", false]
                LOD2 = [select + "LOD2", false]
                isNotLOD = false
            } else {
                isNotLOD = true
                selectedObjectName = intersectedObjects.name
            }

        }
        else {
            intersectedObjects = null
        }
        if (isNotLOD) {
            pickableObjects.forEach((o: THREE.Mesh, i) => {
                if (selectedObjectName === o.name) {
                    if (pickableObjects[i].material === highlightedMaterial) {
                        pickableObjects[i].material = originalMaterials[o.name]
                    }
                    else {
                        pickableObjects[i].material = highlightedMaterial

                    }
                }
            })
        } else {
            pickableObjects.forEach((o: THREE.Mesh, i) => {
                if ((LOD0[0] === o.name)) {
                    if (pickableObjects[i].material === highlightedMaterial) {
                        pickableObjects[i].material = originalMaterials[o.name]
                    }
                    else {
                        pickableObjects[i].material = highlightedMaterial
                    }
                }
            })
            pickableObjects.forEach((o: THREE.Mesh, i) => {
                if ((LOD1[0] === o.name)) {
                    if (pickableObjects[i].material === highlightedMaterial) {
                        pickableObjects[i].material = originalMaterials[o.name]
                    }
                    else {
                        pickableObjects[i].material = highlightedMaterial
                    }
                }
            })
            pickableObjects.forEach((o: THREE.Mesh, i) => {
                if ((LOD2[0] === o.name)) {
                    if (pickableObjects[i].material === highlightedMaterial) {
                        pickableObjects[i].material = originalMaterials[o.name]
                    }
                    else {
                        pickableObjects[i].material = highlightedMaterial
                    }
                }
            })
        }
    }
}


let param = {
    raycaster: true
}
gui.add(param, "raycaster").onChange(function (event) {
    pickableObjects.forEach((o: THREE.Mesh, i) => {
        pickableObjects[i].material = originalMaterials[o.name]
    })
})

const PositionFolder = gui.addFolder("Position")
PositionFolder.add(lod.position.normalize(), "x", 0, Math.PI * 20)
PositionFolder.add(lod.position, "y", 0, Math.PI * 20)
PositionFolder.add(lod.position, "z", 0, Math.PI * 20)

const RotationFolder = gui.addFolder("Rotation")
RotationFolder.add(lod.rotation, "x", -6.45, Math.PI * 2)
RotationFolder.add(lod.rotation, "y", 0, Math.PI * 2)
RotationFolder.add(lod.rotation, "z", 0, Math.PI * 2)


document.addEventListener("click", onClick, false)
function myScript(event: MouseEvent) {
}
document.addEventListener("wheel", myScript, false)
const stats = Stats()
document.body.appendChild(stats.dom)
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    TWEEN.update()
    render()
    stats.update()
}
const trianglesElem = document.querySelector("#Triangles")
const LODElem = document.querySelector("#LOD")


function render() {

    // console.log( renderer.info.render.triangles );
    renderer.info.autoReset = true;
    trianglesElem!.innerHTML = renderer.info.render.triangles.toString()
    LODElem!.innerHTML = lod.getCurrentLevel().toString()
    renderer.render(scene, camera)
}
animate()
