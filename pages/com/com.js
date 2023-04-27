// pages/com/com.js
import { sdBLE } from "../../utils/sdBLE.js";
const app = getApp();
let sdBLEObj = new sdBLE();
//index.js

//引入wx-three.js
import * as THREE from './wx-three.js'

//连接蓝牙设备并监听数据
wx.createBLEConnection({
  deviceId: deviceId,
  success: function (res) {
    console.log("连接成功");
    //开始监听接收数据
    wx.onBLECharacteristicValueChange(function (characteristic) {
      let data = characteristic.value;
      let x = data.getInt16(0, true);
      let y = data.getInt16(2, true);
      let z = data.getInt16(4, true);
      let xyzArray = [x, y, z];
      //将解析后的xyz轴的数组传给绘制模型的方法
      drawModel(xyzArray);
    });
  }
});

//绘制模型的方法
function drawModel(xyzArray) {
  //创建scene和camera
  const canvas = wx.createCanvasContext('myCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  //创建渲染器renderer，并将其绑定到canvas上
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  //设置渲染器renderer的大小，以及背景颜色
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#000000");

  //创建一个立方体模型，并将解析出的xyz轴的数组传入
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = xyzArray[0];
  cube.position.y = xyzArray[1];
  cube.position.z = xyzArray[2];
  scene.add(cube);

  //设置camera的位置
  camera.position.z = 5;

  //创建动画循环
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    canvas.draw();
  }
  animate();
}
