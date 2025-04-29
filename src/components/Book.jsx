import { BoxGeometry, SkinnedMesh , Skeleton, Uint16BufferAttribute, Float32BufferAttribute, Vector3, MeshStandardMaterial, Bone, SkeletonHelper, Color, SRGBColorSpace } from "three";
import { useMemo, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { useTexture } from "@react-three/drei";
import { pages } from "./pages.jsx";
import { pageAtom } from "../App.jsx";
import { useAtom } from "jotai";
import { MathUtils } from "three/src/math/MathUtils.js";

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.01;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

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

const whiteColor = new Color("white");
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

const Page = ({index, front, imageData, opened, bookClosed, page, ...props}) => {
  const [picture, picture2, pictureRoughness, ...photoTextures] = useTexture([
    `textures/${front}`,
    '/textures/book-cover-roughness.jpg',
    ...imageData.map((d) => d.src),

  ])
  const group = useRef();
  const skinnedMeshRef = useRef();
  picture.colorSpace =picture2.colorSpace = SRGBColorSpace;
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
        map: picture,
      
      }),
      new MeshStandardMaterial({
        map: picture2,
        
      }),
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

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !group.current) {
      return;
    }
  
    const bones = skinnedMeshRef.current.skeleton.bones;
  
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(index * 0.8);
    }

    group.current.rotation.y = targetRotation;
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, targetRotation, 0.2);
  
    for (let i = 0; i < bones.length; i++) {
      bones[i].rotation.set(0, 0, 0);
    }
  });

  return (
    <group {...props} ref={group}>
      <primitive
        object={manualSkinnedMesh}
        ref={(instance) => {
          skinnedMeshRef.current = instance;
        }}
        position-z={ index * PAGE_DEPTH}

      />
      {imageData.map((data, i) => (
        <mesh
          key={i}
          position={data.position}
          rotation={data.rotation}
        >
          <planeGeometry args={data.size} />
          <meshStandardMaterial
            map={photoTextures[i]}
            roughness={0.05}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export const Book = () => {
  const [page,setPage] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

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
            page = {page} 
            setPage={setPage}
            front={pageData.front}
            imageData={pageData.imageData}  
            opened={delayedPage > i}
            bookClosed={delayedPage === 0 || delayedPage === pages.length}
          />
        ))
    }
    </group>  
  );
};
