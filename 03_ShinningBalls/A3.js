/**
 * UBC CPSC 314 (2016_W1)
 * Assignment 3
 */

// CREATE SCENE
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(25.0,(window.innerWidth/window.innerHeight), 0.1, 10000);
camera.position.set(0.0,15.0,40.0);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4,4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(30.0, 30.0), floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

//TEXTURES
var rocksTexture =  new THREE.ImageUtils.loadTexture('images/gravel-rocks-texture.jpg');

//LIGHTING PROPERTIES
var lightColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var ambientColor = {type: "c", value: new THREE.Color(0.4,0.4,0.4)};
var baseColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var lightPosition = {type: "v3", value: new THREE.Vector3(0.49,0.79,0.49)};
var texture1 = {type:"t", value: rocksTexture};

//MATERIAL PROPERTIES 
var kAmbient = {type: "f", value: 0.4 };
var kDiffuse = {type: "f", value: 0.8 };
var kSpecular = {type: "f", value: 0.8 };
var shininess = {type: "f", value: 10.0 };


// SHADER MATERIALS (Remember to change this, in order to use uniform variables.)
var gouraudMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColorUni: lightColor,
    ambientColorUni: ambientColor,
    lightPositionUni: lightPosition,
    kAmbientUni: kAmbient,
    kDiffuseUni: kDiffuse,
    kSpecularUni: kSpecular,
    shininessUni: shininess,
    baseColorUni: baseColor
  }
});
var phongMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColorUni: lightColor,
    ambientColorUni: ambientColor,
    lightPositionUni: lightPosition,
    kAmbientUni: kAmbient,
    kDiffuseUni: kDiffuse,
    kSpecularUni: kSpecular,
    shininessUni: shininess,
    baseColorUni: baseColor
  }
});
var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColorUni: lightColor,
    ambientColorUni: ambientColor,
    lightPositionUni: lightPosition,
    kAmbientUni: kAmbient,
    kDiffuseUni: kDiffuse,
    kSpecularUni: kSpecular,
    shininessUni: shininess,
    baseColorUni: baseColor
  }
});
var textureMaterial = new THREE.ShaderMaterial({
  uniforms: {
    
    textureUni: texture1
  }
});
var toonMaterial = new THREE.ShaderMaterial({
  uniforms:{
    lightColorUni: lightColor,
    ambientColorUni: ambientColor,
    lightPositionUni: lightPosition,
    kAmbientUni: kAmbient,
    kDiffuseUni: kDiffuse,
    kSpecularUni: kSpecular,
    shininessUni: shininess,
    baseColorUni: baseColor
  }
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gouraud.fs.glsl','glsl/gouraud.vs.glsl',
  'glsl/phong.vs.glsl','glsl/phong.fs.glsl',
  'glsl/blinnPhong.vs.glsl','glsl/blinnPhong.fs.glsl',
  'glsl/texture.fs.glsl','glsl/texture.vs.glsl',
  'glsl/toon.fs.glsl','glsl/toon.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
 gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
 phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
 phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
 blinnPhongMaterial.vertexShader = shaders['glsl/blinnPhong.vs.glsl'];
 blinnPhongMaterial.fragmentShader = shaders['glsl/blinnPhong.fs.glsl'];
 textureMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 textureMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
 toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
 toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
})

// CREATE SPHERES
var sphereRadius = 2.0;
var sphere = new THREE.SphereGeometry(sphereRadius, 16, 16);

var gouraudSphere = new THREE.Mesh(sphere, gouraudMaterial); 
gouraudSphere.position.set(-7.5, sphereRadius, 0);
//scene.add(gouraudSphere);

var phongSphere = new THREE.Mesh(sphere, phongMaterial); 
phongSphere.position.set(-2.5, sphereRadius, 0);
//scene.add(phongSphere);

var blinnPhongSphere = new THREE.Mesh(sphere, blinnPhongMaterial); 
blinnPhongSphere.position.set(2.5, sphereRadius, 0);
//scene.add(blinnPhongSphere);

var textureSphere = new THREE.Mesh(sphere, textureMaterial); 
textureSphere.position.set(7.5, sphereRadius, 0);
//scene.add(textureSphere);

var toonSphere = new THREE.Mesh(sphere, toonMaterial); 
toonSphere.position.set(12.5, sphereRadius, 0);


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  if (keyboard.pressed("l")){
    lightColor.value = new THREE.Color(Math.random(),Math.random(),Math.random());
  }else if (keyboard.pressed("m")){
    ambientColor.value = new THREE.Color(0.4*Math.random(),0.4*Math.random(),0.4*Math.random());
    baseColor.value = new THREE.Color(Math.random(),Math.random(),Math.random());
  }else if (keyboard.pressed("1")){
    scene.add(gouraudSphere);
  }else if (keyboard.pressed("2")){
    scene.add(phongSphere);
  }else if (keyboard.pressed("3")){
    scene.add(blinnPhongSphere);
  }else if (keyboard.pressed("4")){
    scene.add(textureSphere);
  }else if (keyboard.pressed("5")){
    scene.add(toonSphere);
  }

  
}

// SETUP UPDATE CALL-BACK
var render = function() {
  checkKeyboard();
  toonMaterial.needsUpdate = true;
	textureMaterial.needsUpdate = true;
	phongMaterial.needsUpdate = true;
	blinnPhongMaterial.needsUpdate = true;
  gouraudMaterial.needsUpdate = true;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();