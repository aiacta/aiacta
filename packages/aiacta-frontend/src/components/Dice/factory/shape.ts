import { ConvexPolyhedron, Vec3 } from 'cannon-es';
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import type { Geometry } from 'three/examples/jsm/deprecated/Geometry';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';
import { Face } from './geometry';

const useHull = false;

const _v1 = new Vector3();
const _v2 = new Vector3();
const _q1 = new Quaternion();

export function createShape(
  objectOrGeometry: Object3D | BufferGeometry,
  vertices: Vector3[],
  faces: Face[],
) {
  return useHull
    ? createConvexPolyhedron(objectOrGeometry)
    : createBasicShape(vertices, faces);
}

function createBasicShape(position: Vector3[], faces: Face[]) {
  const vertices: Vec3[] = [];

  const shape = new ConvexPolyhedron({
    faces: faces.map((f) => {
      const arr = f.indices.map((idx) => {
        const pos = new Vec3().copy(position[idx] as any);
        const vi = vertices.findIndex((v) => v.almostEquals(pos));
        if (vi >= 0) {
          return vi;
        } else {
          return vertices.push(pos) - 1;
        }
      });
      (arr as any).faceValue = f.value;
      return arr;
    }),
    vertices,
  });

  return shape;
}

export function createConvexPolyhedron(
  objectOrGeometry: Object3D | BufferGeometry,
) {
  const geometry =
    objectOrGeometry instanceof BufferGeometry
      ? objectOrGeometry
      : getGeometry(objectOrGeometry);

  if (!geometry) {
    throw new Error('No geometry found');
  }

  // Perturb.
  // const eps = 1e-4;
  // for (let i = 0; i < geometry.attributes.position.count; i++) {
  //   geometry.attributes.position.setXYZ(
  //     i,
  //     geometry.attributes.position.getX(i) + (Math.random() - 0.5) * eps,
  //     geometry.attributes.position.getY(i) + (Math.random() - 0.5) * eps,
  //     geometry.attributes.position.getZ(i) + (Math.random() - 0.5) * eps,
  //   );
  // }

  // Compute the 3D convex hull.
  const hull = new ConvexHull().setFromObject(new Mesh(geometry));

  const vertices = [];
  const faces = [];
  const hashToIndex: { [key: string]: number } = {};
  let nextIndex = 0;

  for (let i = 0; i < hull.faces.length; i++) {
    const face = hull.faces[i];
    let edge = face.edge;
    const indices = [];
    do {
      const point = edge!.head().point;
      const hash = `${point.x},${point.y},${point.z}`;
      if (hash in hashToIndex) {
        indices.push(hashToIndex[hash]);
      } else {
        vertices.push(new Vec3(point.x, point.y, point.z));
        indices.push(nextIndex);
        hashToIndex[hash] = nextIndex;
        ++nextIndex;
      }
      edge = edge!.next;
    } while (edge !== face.edge);
    faces.push(indices);
  }

  const shape = new ConvexPolyhedron({ vertices, faces });

  return shape;
}

function getGeometry(object: Object3D): BufferGeometry | null {
  const meshes = getMeshes(object);
  if (meshes.length === 0) return null;

  // Single mesh. Return, preserving original type.
  if (meshes.length === 1) {
    return simplifyGeometry(normalizeGeometry(meshes[0]));
  }

  // Multiple meshes. Merge and return.
  let mesh: Mesh | undefined;
  const geometries: BufferGeometry[] = [];
  while ((mesh = meshes.pop())) {
    geometries.push(simplifyGeometry(normalizeGeometry(mesh)));
  }

  return mergeBufferGeometries(geometries);
}

function normalizeGeometry(mesh: Mesh): BufferGeometry {
  let geometry: BufferGeometry = mesh.geometry;
  if (((geometry as unknown) as Geometry).toBufferGeometry) {
    geometry = ((geometry as unknown) as Geometry).toBufferGeometry();
  } else {
    // Preserve original type, e.g. CylinderBufferGeometry.
    geometry = geometry.clone();
  }

  mesh.updateMatrixWorld();
  mesh.matrixWorld.decompose(_v1, _q1, _v2);
  geometry.scale(_v2.x, _v2.y, _v2.z);
  return geometry;
}

function mergeBufferGeometries(geometries: BufferGeometry[]): BufferGeometry {
  let vertexCount = 0;
  for (let i = 0; i < geometries.length; i++) {
    const position = geometries[i].attributes.position;
    if (position && position.itemSize === 3) {
      vertexCount += position.count;
    }
  }

  const positionArray = new Float32Array(vertexCount * 3);

  let positionOffset = 0;
  for (let i = 0; i < geometries.length; i++) {
    const position = geometries[i].attributes.position;
    if (position && position.itemSize === 3) {
      for (let j = 0; j < position.count; j++) {
        positionArray[positionOffset++] = position.getX(j);
        positionArray[positionOffset++] = position.getY(j);
        positionArray[positionOffset++] = position.getZ(j);
      }
    }
  }

  return new BufferGeometry().setAttribute(
    'position',
    new BufferAttribute(positionArray, 3),
  );
}

function simplifyGeometry(
  geometry: BufferGeometry,
  tolerance = 1e-4,
): BufferGeometry {
  tolerance = Math.max(tolerance, Number.EPSILON);

  // Generate an index buffer if the geometry doesn't have one, or optimize it
  // if it's already available.
  const hashToIndex: { [key: string]: number } = {};
  const indices = geometry.getIndex();
  const positions = geometry.getAttribute('position');
  const vertexCount = indices ? indices.count : positions.count;

  // Next value for triangle indices.
  let nextIndex = 0;

  const newIndices = [];
  const newPositions = [];

  // Convert the error tolerance to an amount of decimal places to truncate to.
  const decimalShift = Math.log10(1 / tolerance);
  const shiftMultiplier = Math.pow(10, decimalShift);

  for (let i = 0; i < vertexCount; i++) {
    const index = indices ? indices.getX(i) : i;

    // Generate a hash for the vertex attributes at the current index 'i'.
    let hash = '';

    // Double tilde truncates the decimal value.
    hash += `${~~(positions.getX(index) * shiftMultiplier)},`;
    hash += `${~~(positions.getY(index) * shiftMultiplier)},`;
    hash += `${~~(positions.getZ(index) * shiftMultiplier)},`;

    // Add another reference to the vertex if it's already
    // used by another index.
    if (hash in hashToIndex) {
      newIndices.push(hashToIndex[hash]);
    } else {
      newPositions.push(positions.getX(index));
      newPositions.push(positions.getY(index));
      newPositions.push(positions.getZ(index));

      hashToIndex[hash] = nextIndex;
      newIndices.push(nextIndex);
      nextIndex++;
    }
  }

  // Construct merged BufferGeometry.

  const positionAttribute = new BufferAttribute(
    new Float32Array(newPositions),
    positions.itemSize,
    positions.normalized,
  );

  const result = new BufferGeometry();
  result.setAttribute('position', positionAttribute);
  result.setIndex(newIndices);

  return result;
}

function getMeshes(object: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  object.traverse(function (o) {
    if ((o as Mesh).isMesh) {
      meshes.push(o as Mesh);
    }
  });
  return meshes;
}
