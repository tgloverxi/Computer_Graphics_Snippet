/*
 * UBC Computer Graphics 
 *
 */

//*****************************TEMPLATE CODE DO NOT MODIFY********************************//
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
// SETUP RENDERER AND SCENE
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);
// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
camera.position.set(-28,10,28);
camera.lookAt(scene.position);
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
// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
//****************************************************************************************//

// OCTOPUS MATRIX: To make octopus move, modify this matrix in updatebody()
var octopusMatrix = {type: 'm4', value: new THREE.Matrix4().set(
  1.0,0.0,0.0,0.0, 
  0.0,1.0,0.0,3.0, 
  0.0,0.0,1.0,0.0, 
  0.0,0.0,0.0,1.0
  )};

//*****************************TEMPLATE CODE DO NOT MODIFY********************************//
// MATERIALS
var normalMaterial = new THREE.MeshNormalMaterial();
var octopusMaterial = new THREE.ShaderMaterial({
  uniforms:{
    octopusMatrix: octopusMatrix,
  },
});
var shaderFiles = [
  'glsl/octopus.vs.glsl',
  'glsl/octopus.fs.glsl'
];
new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  octopusMaterial.vertexShader = shaders['glsl/octopus.vs.glsl'];
  octopusMaterial.fragmentShader = shaders['glsl/octopus.fs.glsl'];
})
// GEOMETRY
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function() {
    console.log('Failed to load ' + file);
  };
  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    scene.add(object);
  }, onProgress, onError);
  
}
// We set octopus on (0,0,0) without scaling
// so we can change these values with transformation matrices.
loadOBJ('obj/Octopus_08_A.obj',octopusMaterial,1.0,0,0,0,0,0,0);

//***** YOU MAY FIND THESE FUNCTIONS USEFUL ******//
function defineRotation_X(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    1.0,       0.0,      0.0,       0.0, 
    0.0,       cosTheta, -sinTheta, 0.0, 
    0.0,       sinTheta, cosTheta,  0.0, 
    0.0,       0.0,      0.0,       1.0
  );
  return mtx;
}
function defineRotation_Y(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    cosTheta,  0.0,      sinTheta,  0.0, 
    0.0,       1.0,      0.0,       0.0, 
    -sinTheta, 0.0,      cosTheta,  0.0, 
    0.0,       0.0,      0.0,       1.0
  );
  return mtx;
}
function defineRotation_Z(theta) {
  var cosTheta = Math.cos(theta);
  var sinTheta = Math.sin(theta);
  var mtx = new THREE.Matrix4().set(
    cosTheta,  -sinTheta, 0.0,       0.0, 
    sinTheta,  cosTheta,  0.0,       0.0, 
    0.0,       0.0,       1.0,       0.0, 
    0.0,       0.0,       0.0,       1.0
  );
  return mtx;
}
//************************************************//
function addEyeAndPupil(material, eyeballTS, pupilTS, pupilTheta) {
  var eyegeo = new THREE.SphereGeometry(1.0,64,64);
  // Eyeball
  var eyeball = new THREE.Mesh(eyegeo, material);
    var eyeballMtx = new THREE.Matrix4().multiplyMatrices(
    octopusMatrix.value,
    eyeballTS 
  );
  eyeball.setMatrix(eyeballMtx);
  scene.add(eyeball);
  // Pupil
  var pupilRT = defineRotation_Y(pupilTheta);
  var pupilTSR = new THREE.Matrix4().multiplyMatrices(
    pupilRT, 
    pupilTS
  );
  var pupilMtx = new THREE.Matrix4().multiplyMatrices(
    eyeballMtx, 
    pupilTSR
  );
  var pupil = new THREE.Mesh(eyegeo, material);
  pupil.setMatrix(pupilMtx);
  scene.add(pupil);
  return [eyeball, pupil];
}

// Left eye
var eyeballTS_L = new THREE.Matrix4().set(
  0.5,0.0,0.0,-0.2, 
  0.0,0.5,0.0,4.1, 
  0.0,0.0,0.5,0.92, 
  0.0,0.0,0.0,1.0
);
var pupilTS_L = new THREE.Matrix4().set(
  0.35,0.0,0.0,0.0, 
  0.0,0.35,0.0,0.0, 
  0.0,0.0,0.15,-0.9, 
  0.0,0.0,0.0,1.0
);
var theta_L = Math.PI * (130 /180.0);
// Right eye
var eyeballTS_R = new THREE.Matrix4().set(
  0.5,0.0,0.0,-0.2, 
  0.0,0.5,0.0,4.1, 
  0.0,0.0,0.5,-0.92, 
  0.0,0.0,0.0,1.0
);
var pupilTS_R = new THREE.Matrix4().set(
  0.35,0.0,0.0,0.0, 
  0.0,0.35,0.0,0.0, 
  0.0,0.0,0.15,-0.9, 
  0.0,0.0,0.0,1.0
);
var theta_R = Math.PI * (50 /180.0);
lefteye = addEyeAndPupil(normalMaterial, eyeballTS_L, pupilTS_L, theta_L);
eyeball_L = lefteye[0];
pupil_L = lefteye[1];
righteye = addEyeAndPupil(normalMaterial, eyeballTS_R, pupilTS_R, theta_R);
eyeball_R = righteye[0];
pupil_R = righteye[1];
//****************************************************************************************//


//***** YOUR CODE HERE *****//
// You need to add 3 joints and 3 links for each arm
// Each arm starts with a joint and ends with a link
// joint-link-joint-link-joint-link

// Geometries of the arm
var j1 = new THREE.SphereGeometry(0.5,64,64);
var l1 = new THREE.CylinderGeometry(0.35, 0.45, 2, 64);
var j2 = new THREE.SphereGeometry(0.4, 64, 64);
var l2 = new THREE.CylinderGeometry(0.25, 0.35, 2, 64);
var j3 = new THREE.SphereGeometry(0.3, 64, 64);
var l3 = new THREE.CylinderGeometry(0.1, 0.25, 2, 64);

// ***** Q1 *****//
function addOneArm(angle_Y, angle_Z, socketPosition) {
  /* angle_Y, angle_Z determines the direction of the enire arm
   * i.e. you create a arm on world scene's origin, rotate along
   * y-axis, and z-axis by these angles will let you insert your
   * arm into the socket
  */

  // Add joint1
  /* Hint: You should rotate joint1 so that for future links and joints,
   *       They can be along the direction of the socket
   *       Even though the sphere looks unchanged but future links are
   *       chidren frames of this joint1
   * Hint: You also need to translate joint1
  */
  var joint1 = new THREE.Mesh(j1, normalMaterial);
  //joint1.setMatrix(COMPUTED MATRIX);
  

  joint1.matrixAutoUpdate = false;
  joint1.matrix.copy(octopusMatrix.value);
  
  var j1x = socketPosition[0];
  var j1y = socketPosition[1];
  var j1z = socketPosition[2];
  var joint1Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j1x,
    0.0,1.0,0.0,j1y,
    0.0,0.0,1.0,j1z,
    0.0,0.0,0.0,1.0
  );
  joint1.matrix.multiply(joint1Mtx);
  // var joint1Mtx = new THREE.Matrix4().multiplyMatrices(
  //   octopusMatrix.value,
  //   leg1
  // );
  //  joint1.setMatrix(joint1Mtx);
  //Rotate_z* Rotate_y
  joint1.matrix.multiply(defineRotation_Y(angle_Y));
  joint1.matrix.multiply(defineRotation_Z(angle_Z));
  //joint1.matrix.multiply(defineRotation_X(-angle_Y));
  scene.add(joint1);
  
  // Add link1
  /* Hint: Find out the translation matrix so that
   *       link is connected with joints, without overlaping
   */
  var link1 = new THREE.Mesh(l1, normalMaterial);
  //link1.setMatrix(COMPUTED MATRIX);
  link1.matrixAutoUpdate = false;
  link1.matrix.copy(joint1.matrix);
  var l1x = 0.0;
  // half of the link1 hight = 1.0
  var l1y = 1.0 ;
  var l1z = 0.0;
  var leg1 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l1x,
    0.0,1.0,0.0,l1y,
    0.0,0.0,1.0,l1z,
    0.0,0.0,0.0,1.0
  );
  link1.matrix.multiply(leg1);
  scene.add(link1);

  

  
  // Add joint2
  var joint2 = new THREE.Mesh(j2, normalMaterial);
  //joint2.setMatrix(COMPUTED MATRIX);
  joint2.matrixAutoUpdate = false;
  joint2.matrix.copy(link1.matrix);
  var j2x = 0.0;
  var j2y = 1.0 ;
  var j2z = 0.0;
  var joint2Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j2x,
    0.0,1.0,0.0,j2y,
    0.0,0.0,1.0,j2z,
    0.0,0.0,0.0,1.0
  );
  joint2.matrix.multiply(joint2Mtx);
  scene.add(joint2);

  // Add link2
  var link2 = new THREE.Mesh(l2, normalMaterial);
  //link2.setMatrix(COMPUTED MATRIX);
  link2.matrixAutoUpdate = false;
  link2.matrix.copy(joint2.matrix);
  var l2x = 0.0;
  var l2y = 1.0 ;
  var l2z = 0.0;
  var leg2 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l2x,
    0.0,1.0,0.0,l2y,
    0.0,0.0,1.0,l2z,
    0.0,0.0,0.0,1.0
  );
  link2.matrix.multiply(leg2);


  scene.add(link2);

  // Add joint3
  var joint3 = new THREE.Mesh(j3, normalMaterial);
  //joint3.setMatrix(COMPUTED MATRIX);
  joint3.matrixAutoUpdate = false;
  joint3.matrix.copy(link2.matrix);
  var j3x = 0.0;
  var j3y = 1.0 ;
  var j3z = 0.0;
  var joint3Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j3x,
    0.0,1.0,0.0,j3y,
    0.0,0.0,1.0,j3z,
    0.0,0.0,0.0,1.0
  );
  joint3.matrix.multiply(joint3Mtx);

  scene.add(joint3);

  // Add link3
  var link3 = new THREE.Mesh(l3, normalMaterial);
  //link3.setMatrix(COMPUTED MATRIX);
  link3.matrixAutoUpdate = false;
  link3.matrix.copy(joint3.matrix);
  var l3x = 0.0;
  var l3y = 1.0 ;
  var l3z = 0.0;
  var leg3 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l3x,
    0.0,1.0,0.0,l3y,
    0.0,0.0,1.0,l3z,
    0.0,0.0,0.0,1.0
  );
  link3.matrix.multiply(leg3);

  scene.add(link3);

  return [joint1, link1, joint2, link2, joint3, link3];
}

/* Now, call addOneArm() 4 times with 4 directions and
 * and 4 socket positions, you will add 4 arms on octopus
 * We return a tuple of joints and links, use them to 
 * animate the octupus
*/

// Socket positions
socketPos1 = [-1.29, -0.35, 3.135];
socketPos2 = [1.29, -0.35, 3.135];
socketPos3 = [3.135, -0.35, 1.29];
socketPos4 = [-3.135, -0.35, 1.29];
socketPos5 = [-1.29, -0.35, -3.135];
socketPos6 = [1.29, -0.35, -3.135];
socketPos7 = [3.135, -0.35, -1.29];
socketPos8 = [-3.135, -0.35, -1.29];

var arm1 = addOneArm(Math.PI*(-112.5/180), Math.PI*(-0.5), socketPos1);
var arm2 = addOneArm(Math.PI*(-67.5/180), Math.PI*(-0.5), socketPos2);
var arm3 = addOneArm(Math.PI*(-22.5/180), Math.PI*(-0.5), socketPos3);
var arm4 = addOneArm(Math.PI*(-157.5/180), Math.PI*(-0.5), socketPos4);
var arm5 = addOneArm(Math.PI*(112.5/180), Math.PI*(-0.5), socketPos5);
var arm6 = addOneArm(Math.PI*(67.5/180), Math.PI*(-0.5), socketPos6);
var arm7 = addOneArm(Math.PI*(22.5/180), Math.PI*(-0.5), socketPos7);
var arm8 = addOneArm(Math.PI*(157.5/180), Math.PI*(-0.5), socketPos8);



function animateArm(t, arm, angle_Y, angle_Z, socketPosition) {
  joint1 = arm[0];
  link1 = arm[1];
  joint2 = arm[2];
  link2 = arm[3];
  joint3 = arm[4];
  link3 = arm[5];
  /* copy and paste your function of addOneArm() here,
   * remove the lines of new THREE.mesh(...) and scene.add(...)
   * will update the matrices of the meshes so that 
   * the arms move with the body, but without effects of swimming
   * 
   * Hint: In addOneArm(), you computed the transformation
   *       matrices of joints and links, simulating swimmiing effect
   *       requires you to rotate only links in links' own frame
   *       You also have computed transformation matrices that
   *       transform link to its parent, think about how you can
   *       do rotation only in the link's frame and then transform
   *       points to its parents
   * 
   * Hint: T_{oct-joint} * T_{joint-link}
   *                       |
   *       T_{oct-joint} * R * T_{joint-link}
   *       Your task is to find R for 3 links and multiply R between
   *       transformation matrices.
   * 
   * Hint: To generate time related rotation, use
   *       rotate along axis you want by angle of function of
   *       sine t, then we have a periodic effect
   *       var rotation = defineRotation_{AXIS}(f(sin(t)))
   * 
  */
 
  

  joint1.matrixAutoUpdate = false;
  joint1.matrix.copy(octopusMatrix.value);
  
  var j1x = socketPosition[0];
  var j1y = socketPosition[1];
  var j1z = socketPosition[2];
  var joint1Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j1x,
    0.0,1.0,0.0,j1y,
    0.0,0.0,1.0,j1z,
    0.0,0.0,0.0,1.0
  );
  joint1.matrix.multiply(joint1Mtx);
  // var joint1Mtx = new THREE.Matrix4().multiplyMatrices(
  //   octopusMatrix.value,
  //   leg1
  // );
  //  joint1.setMatrix(joint1Mtx);
  //Rotate_z* Rotate_y
  joint1.matrix.multiply(defineRotation_Y(angle_Y));
  joint1.matrix.multiply(defineRotation_Z(angle_Z));
  //joint1.matrix.multiply(defineRotation_X(-angle_Y));
  
  
  // Add link1
  /* Hint: Find out the translation matrix so that
   *       link is connected with joints, without overlaping
   */
  
  //link1.setMatrix(COMPUTED MATRIX);
  link1.matrixAutoUpdate = false;
  link1.matrix.copy(joint1.matrix);
  var rotation_l1 = defineRotation_Z(Math.sin(t/1.1+1.5*Math.PI)*Math.PI/6);
  link1.matrix.multiply(rotation_l1);
  var l1x = 0.0;
  // half of the link1 hight = 1.0
  var l1y = 1.0 ;
  var l1z = 0.0;
  var leg1 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l1x,
    0.0,1.0,0.0,l1y,
    0.0,0.0,1.0,l1z,
    0.0,0.0,0.0,1.0
  );
  link1.matrix.multiply(leg1);
  
  
  // Add joint2
  
  //joint2.setMatrix(COMPUTED MATRIX);
  joint2.matrixAutoUpdate = false;
  joint2.matrix.copy(link1.matrix);
  var j2x = 0.0;
  var j2y = 1.0 ;
  var j2z = 0.0;
  var joint2Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j2x,
    0.0,1.0,0.0,j2y,
    0.0,0.0,1.0,j2z,
    0.0,0.0,0.0,1.0
  );
  joint2.matrix.multiply(joint2Mtx);
  

  // Add link2
  
  //link2.setMatrix(COMPUTED MATRIX);
  link2.matrixAutoUpdate = false;
  link2.matrix.copy(joint2.matrix);
  var rotation_l2 = defineRotation_Z(Math.sin(t/1.1-1.25*Math.PI)*Math.PI/8);
  link2.matrix.multiply(rotation_l2);
  var l2x = 0.0;
  var l2y = 1.0 ;
  var l2z = 0.0;
  var leg2 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l2x,
    0.0,1.0,0.0,l2y,
    0.0,0.0,1.0,l2z,
    0.0,0.0,0.0,1.0
  );
  link2.matrix.multiply(leg2);


  

  // Add joint3
  
  //joint3.setMatrix(COMPUTED MATRIX);
  joint3.matrixAutoUpdate = false;
  joint3.matrix.copy(link2.matrix);
  var j3x = 0.0;
  var j3y = 1.0 ;
  var j3z = 0.0;
  var joint3Mtx = new THREE.Matrix4().set(
    1.0,0.0,0.0,j3x,
    0.0,1.0,0.0,j3y,
    0.0,0.0,1.0,j3z,
    0.0,0.0,0.0,1.0
  );
  joint3.matrix.multiply(joint3Mtx);

  

  // Add link3
  
  //link3.setMatrix(COMPUTED MATRIX);
  link3.matrixAutoUpdate = false;
  link3.matrix.copy(joint3.matrix);
  var rotation_l3 = defineRotation_Z(Math.sin(t/1.1+6*Math.PI/7)*Math.PI/5);
  link3.matrix.multiply(rotation_l3);
  var l3x = 0.0;
  var l3y = 1.0 ;
  var l3z = 0.0;
  var leg3 = new THREE.Matrix4().set(
    1.0,0.0,0.0,l3x,
    0.0,1.0,0.0,l3y,
    0.0,0.0,1.0,l3z,
    0.0,0.0,0.0,1.0
  );
  link3.matrix.multiply(leg3);

  


}

var clock = new THREE.Clock(true);
var initalMtx = octopusMatrix.value;
function updateBody() {
  octopusMaterial.needsUpdate = true;
  switch(channel)
  {
    case 0: 
      break;

    case 1:
      //***** Example of how to rotate eyes with octopus *****//
      // Your animations should be similar to this
      // i.e. octopus' body parts moves at the same time
      var t = clock.getElapsedTime();
      octopusMatrix.value = new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(t),
        initalMtx
      );
      // Right eye
      eyeball_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_R
      ));
      pupil_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().multiplyMatrices(
          octopusMatrix.value,
          eyeballTS_R
        ),
        new THREE.Matrix4().multiplyMatrices(
          defineRotation_Y(theta_R),
          pupilTS_R
        )
      ));
      scene.add(eyeball_R);
      scene.add(pupil_R);
      // You can also define the matrices and multiply
      // Left eye
      oct_eye_L = new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_L
      );
      pupil_L_TSR = new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(theta_L),
        pupilTS_L
      );
      oct_pupil = new THREE.Matrix4().multiplyMatrices(
        oct_eye_L,
        pupil_L_TSR
      );
      eyeball_L.setMatrix(oct_eye_L);
      pupil_L.setMatrix(oct_pupil);
      break;
    case 2:
      break;

    //animation
    case 3:
      {
        var t = clock.getElapsedTime();

        // Animate Octopus Body
        octopusMatrix.value = new THREE.Matrix4().set(
          1.0,0.0,0.0,0.0, 
          0.0,1.0,0.0,(Math.sin(t/1.1+11)*1.8)+4, 
          0.0,0.0,1.0,0.0, 
          0.0,0.0,0.0,1.0
        );
        //***** Q3.a *****//
        // Animate Right Eye (eyeball and pupil)
        
        // Animate Left Eye (eyeball and pupil)
        // Right eye
      eyeball_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_R
      ));
      pupil_R.setMatrix(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().multiplyMatrices(
          octopusMatrix.value,
          eyeballTS_R
        ),
        new THREE.Matrix4().multiplyMatrices(
          defineRotation_Y(theta_R),
          pupilTS_R
        )
      ));
      scene.add(eyeball_R);
      scene.add(pupil_R);
      // You can also define the matrices and multiply
      // Left eye
      oct_eye_L = new THREE.Matrix4().multiplyMatrices(
        octopusMatrix.value,
        eyeballTS_L
      );
      pupil_L_TSR = new THREE.Matrix4().multiplyMatrices(
        defineRotation_Y(theta_L),
        pupilTS_L
      );
      oct_pupil = new THREE.Matrix4().multiplyMatrices(
        oct_eye_L,
        pupil_L_TSR
      );
      eyeball_L.setMatrix(oct_eye_L);
      pupil_L.setMatrix(oct_pupil);
      scene.add(eyeball_L);
      scene.add(pupil_L);
        // Animate Arms
        
        animateArm(t, arm1, Math.PI*(-135/180), Math.PI*(-0.5), socketPos1);
         animateArm(t, arm2, Math.PI*(-45/180), Math.PI*(-0.5), socketPos2);
         animateArm(t, arm3, Math.PI*(45/180), Math.PI*(-0.5), socketPos3);
        animateArm(t, arm4, Math.PI*(135/180), Math.PI*(-0.5), socketPos4);
      }

      break;
    default:
      break;
  }
}


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var channel = 0;
function checkKeyboard() {
  for (var i=0; i<6; i++)
  {
    if (keyboard.pressed(i.toString()))
    {
      channel = i;
      break;
    }
  }
}


// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateBody();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();