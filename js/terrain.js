import * as THREE from "three";
import { Config } from "./config.js";

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying float vErosion;
  varying float vCrack;
  varying vec3 vPos;
  uniform float uTime, uProgress, uSubsidenceDepth, uErosionIntensity, uRidgeDensity, uSedimentThickness, uAridRate;
  
  vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);
    vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  void main(){
    vUv=uv;
    vec3 pos=position;
    float baseNoise=snoise(uv*3.0)*0.12;
    pos.y+=baseNoise;
    float d=distance(uv,vec2(0.5));
    float basinMask=smoothstep(0.6,0.12,d);
    
    // 阶段1: 地壳下沉
    float subProg=smoothstep(0.0,0.25,uProgress);
    pos.y-=basinMask*uSubsidenceDepth*subProg;
    
    // 阶段2-3: 沉积层
    float sedProg=smoothstep(0.25,0.45,uProgress);
    if(d<0.5) pos.y+=uSedimentThickness*sedProg*basinMask*0.25;
    
    // 阶段4: 干裂纹 - 干旱化速率影响裂隙密度和深度
    float crackStart = 0.45 / uAridRate;
    float crackEnd = 0.6 / uAridRate;
    float crackProg=smoothstep(crackStart, crackEnd, uProgress);
    vec2 crackUv=vec2(uv.x*2.0, uv.y*uRidgeDensity);
    float crackNoise=snoise(crackUv*5.0);
    float crackWidth = 0.15 * uAridRate;
    float crackMask=1.0-smoothstep(0.0, crackWidth, abs(crackNoise));
    float crack=crackMask*0.1*crackProg*basinMask*uAridRate;
    vCrack=crackMask*crackProg;
    
    // 阶段5: 风蚀
    float eroProg=smoothstep(0.6,1.0,uProgress);
    float eroWidth=0.15+eroProg*0.25*uErosionIntensity;
    float eroMask=1.0-smoothstep(0.0,eroWidth,abs(crackNoise));
    float eroDepth=eroProg*uErosionIntensity*1.8;
    float finalEro=eroMask*eroDepth*basinMask;
    
    pos.y-=crack;
    pos.y-=finalEro;
    
    vElevation=pos.y;
    vErosion=finalEro;
    vPos=pos;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying float vErosion;
  varying float vCrack;
  varying vec3 vPos;
  uniform float uProgress;
  void main(){
    vec3 cBase=vec3(0.65,0.55,0.4);
    vec3 cSed=vec3(0.55,0.45,0.35);
    vec3 cClay=vec3(0.75,0.55,0.35);
    vec3 cCrack=vec3(0.3,0.22,0.15);
    vec3 cEro=vec3(0.35,0.25,0.18);
    vec3 cRidge=vec3(0.82,0.72,0.52);
    
    vec3 col=cBase;
    float d=distance(vUv,vec2(0.5));
    float basin=smoothstep(0.55,0.2,d);
    
    col=mix(col,cSed,basin*smoothstep(0.25,0.45,uProgress));
    float dryProg=smoothstep(0.45,0.6,uProgress);
    col=mix(col,cClay,dryProg*basin*0.7);
    col=mix(col,cCrack,vCrack*0.8);
    
    float eroProg=smoothstep(0.6,1.0,uProgress);
    if(vErosion>0.05){
      col=mix(col,cEro,min(vErosion*1.5,1.0));
    }else if(eroProg>0.0&&basin>0.3&&vErosion<0.02){
      col=mix(col,cRidge,eroProg*0.6);
    }
    
    vec3 dx=dFdx(vPos),dy=dFdy(vPos);
    vec3 n=normalize(cross(dx,dy));
    float diff=max(dot(n,normalize(vec3(-1,2,1))),0.0);
    col*=(0.5+0.6*diff);
    
    gl_FragColor=vec4(col,1.0);
  }
`;

export function createTerrain(scene) {
  const geo = new THREE.PlaneGeometry(20, 20, 256, 256);
  geo.rotateX(-Math.PI / 2);

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uSubsidenceDepth: { value: Config.subsidenceDepth },
    uErosionIntensity: { value: Config.erosionIntensity },
    uRidgeDensity: { value: Config.ridgeDensity },
    uSedimentThickness: { value: Config.sedimentThickness },
    uAridRate: { value: Config.aridRate },
  };

  const terrain = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    }),
  );
  terrain.receiveShadow = true;
  scene.add(terrain);

  return { terrain, uniforms };
}

export function updateTerrainUniforms(uniforms) {
  uniforms.uProgress.value = Config.progress;
  uniforms.uSubsidenceDepth.value = Config.subsidenceDepth;
  uniforms.uErosionIntensity.value = Config.erosionIntensity;
  uniforms.uRidgeDensity.value = Config.ridgeDensity;
  uniforms.uSedimentThickness.value = Config.sedimentThickness;
  uniforms.uAridRate.value = Config.aridRate;
}
