import { BoxGeometry, SkinnedMesh , Skeleton, Uint16BufferAttribute, Float32BufferAttribute, Vector3, MeshStandardMaterial, Bone, Color, SRGBColorSpace } from "three";
import { useMemo, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { useCursor, useTexture } from "@react-three/drei";
import { useAtom } from "jotai";
import { MathUtils } from "three/src/math/MathUtils.js";

import { pages } from "./pages.jsx";
import { pageAtom } from "../App.jsx";
import { createImageDataTexture } from "./ImageCanvas.jsx";
import { createNotebookTexture } from "./NotebookCanvas.jsx";
import { createImageTextureWithRoughness } from "./ImageCanvasRoughness.jsx";

//page dimensions
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.006;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
// intial page position
pageGeometry.translate(PAGE_WIDTH/2 , 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;

  const skinIndex = Math.floor(x / SEGMENT_WIDTH);
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);

pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);


// page material color
const whiteColor = new Color("white");
const emissiveColor = new Color("white");

const pageMaterials = [
    new MeshStandardMaterial({
      color: whiteColor,
    }),
    new MeshStandardMaterial({
      color: "#111",
    }),
    new MeshStandardMaterial({
      color: whiteColor,
    }),
    new MeshStandardMaterial({
      color: whiteColor,
    }),
  ];

const Page = ({index, front, back,setPage, imageData, fillColor, opened, bookClosed,title, description,tech, page, ...props}) => {

  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  const safeFront = front ?? 'cover-page.png'; // fallback texture
  const safeBack = back ?? 'book-back.png'; 
  const [picture, backCover] = useTexture([`textures/${safeFront}`, `textures/${safeBack}`]);

  picture.colorSpace = SRGBColorSpace;
  backCover.colorSpace = SRGBColorSpace;
  const group = useRef();
  const skinnedMeshRef = useRef();

  //page textures
  const notebookTexture = useMemo(() => createNotebookTexture(title, description,tech), []);
  const ImageTexture = useMemo(() => createImageDataTexture(imageData, fillColor), [imageData,fillColor]);

  //front page and cover page roughness
  const backCoverRoughness = useTexture('/textures/book-back-roughness.png');
  const frontCoverRoughness = useTexture('/textures/cover-texture.png')

  //image roughness
  const { texture: ImageTextureRoughness, roughnessMap } = useMemo(
    () => createImageTextureWithRoughness(imageData),
    [imageData]
  );
  

  //page mesh
  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      if (i === 0) {  
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
  
    const materials = [...pageMaterials,
      new MeshStandardMaterial({
        map: index === 0 ? picture : 
        notebookTexture, 
        roughness: 0.8,
        roughnessMap: index === 0 ? frontCoverRoughness: null,
        metalness: 0.3,
        emissive: emissiveColor,
        emissiveIntensity: 0,

      }),
      new MeshStandardMaterial(
        index === pages.length - 1
          ? {
              map: backCover,
              metalness: 0.3,
              roughness: 0.8,
              roughnessMap: backCoverRoughness,
              emissive: emissiveColor,
              emissiveIntensity: 0,
      
            }
          : {
              map: ImageTexture,
              roughnessMap,
              metalness: 0.3,
              roughness: 1.0,
              emissive: emissiveColor,
              emissiveIntensity: 0,      
            }
      )
    ]
    const skeleton = new Skeleton(bones);
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);

    return mesh;
  }, []);


  
  useFrame(({ clock },_, delta) => {
    const t = clock.getElapsedTime();
      group.current.position.y = Math.sin(t * 2) * 0.05; //floating animation

    //getting back to place when book closed
    if(bookClosed) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, 0.9 , 0.01);
    }

    if (!skinnedMeshRef.current || !group.current) {
      return;
    }
    const bones = skinnedMeshRef.current.skeleton.bones;

    //setting the target rotation
    let targetRotation = opened ? -Math.PI : -Math.PI / 2;

    //adding space between the pages when book is open
    if (!bookClosed) {
      targetRotation += degToRad(index * 0.25);
    }

    //all bones set to  initial position
    for (let i = 0; i < bones.length; i++) {
      bones[i].rotation.set(0, 0, 0);
    }

    //page turning animation
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, targetRotation, 0.02);

    //bending the pages on the right side using cosin function
    if(!opened && !bookClosed) {
      const amplitude = Math.PI / 50; 
      const frequency = 0.08;
  
      for (let i = 3; i < bones.length; i++) {
        const bend = Math.cos(frequency * i) * amplitude;
        bones[i].rotation.y = bend;
      }
    }
    //bending the pages on the left side using sine function
    if (opened ) {
      const amplitude = Math.PI / 10 ; 
      const frequency =  0.005  ;
  
      for (let i = 0; i < bones.length; i++) {
        const bend = Math.sin(-i * frequency) * amplitude;
        bones[bones.length-1 - i].rotation.y = bend;
      }
    }

    // changing the color page when hovering using the highlighted state
    const emissiveIntensity = highlighted ? 0.22 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );
  
  });

  return (
    <group {...props} ref={group}>
    
      {/* page mesh */}
      <primitive
        object={manualSkinnedMesh}
        ref={(instance) => {
          skinnedMeshRef.current = instance;
        }}
        position-z={ -index * PAGE_DEPTH}
        onClick={(e) => {
          e.stopPropagation();
          opened? setPage(index): setPage(index+1);
          setHighlighted(false);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHighlighted(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHighlighted(false);
        }}

      />
    </group>
  );
};

export const Book = () => {
  const [page,setPage] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);


  //page change function. sets delay between the page change animation so pages turn one after the other
  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150
          );
          if (page > delayedPage) {
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  return (
    <group>
      {
        [...pages].map((pageData, i) => (
          <Page 
            key={i}
            index = {i} 
            page = {delayedPage} 
            setPage={setPage}
            front={pageData.front}
            imageData={pageData.imageData} 
            fillColor= {pageData.fillColor} 
            opened={delayedPage > i && delayedPage !== pages.length}
            title={pages[i - 1]?.title ?? ''}
            description={pages[i - 1]?.description ?? ''}
            tech = {pages[i - 1]?.tech ?? ''}
            bookClosed={delayedPage === 0 || delayedPage === pages.length}
          />
        ))
    }
    </group>  
  );
};
