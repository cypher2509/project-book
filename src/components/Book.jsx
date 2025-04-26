import { BoxGeometry, Vector3 } from "three";
import { useRef } from "react";

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
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

const Page = (props) => {
    return (
        <group {...props}>
            <mesh scale={0.1} geometry={pageGeometry}>
                <meshStandardMaterial color="Red" />
            </mesh>
        </group>
    );
}

export const Book = () => {
    return (
        <group>
            <Page position={[1 * 0.15, 0, 0]} />
        </group>
    );
}
