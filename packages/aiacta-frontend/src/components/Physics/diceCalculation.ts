import { Body, ConvexPolyhedron, Quaternion, Vec3, World } from 'cannon-es';

export function calculateResults(
  world: World,
  dice: { body: Body; type: string }[],
) {
  const vectorsPreCalculation = world.bodies.map((body) => ({
    position: body.position.clone(),
    quaternion: body.quaternion.clone(),
    velocity: body.velocity.clone(),
    angularVelocity: body.angularVelocity.clone(),
  }));

  let iteration = 0;
  do {
    world.step(1 / 60);
  } while (world.hasActiveBodies && ++iteration < 1000);

  if (iteration >= 1000) {
    console.log('Could not settle dice');
  }

  const results = new Map<
    typeof dice[0],
    { position: Vec3; quaternion: Quaternion; value: number }
  >();

  dice.forEach((die) => {
    const { body, type } = die;
    const value = calculateFaceValue(body, type === 'd4' ? -1 : 1);
    if (value) {
      results.set(die, {
        position: die.body.position.clone(),
        quaternion: die.body.quaternion.clone(),
        value,
      });
    } else {
      console.log('No face found');
    }
  });

  vectorsPreCalculation.forEach((vectors, idx) => {
    world.bodies[idx].position.copy(vectors.position);
    world.bodies[idx].quaternion.copy(vectors.quaternion);
    world.bodies[idx].velocity.copy(vectors.velocity);
    world.bodies[idx].angularVelocity.copy(vectors.angularVelocity);
    world.bodies[idx].wakeUp();
  });

  return results;
}

export function calculateFaceValue(body: Body, upside: -1 | 1) {
  const shape = body.shapes[0] as ConvexPolyhedron;
  const faces = (shape.faces as any) as (number[] & {
    faceValue: number;
  })[];
  const upVec = new Vec3(0, 0, upside);
  let closestFace = -1;
  for (const [idx, faceNormal] of shape.faceNormals.entries()) {
    const worldNormal = body.quaternion.vmult(faceNormal);
    if (worldNormal.dot(upVec) >= 1 - 1e-3) {
      closestFace = idx;
      break;
    }
  }
  if (closestFace >= 0) {
    return faces[closestFace].faceValue;
  } else {
    return null;
  }
}

export function calculateQuaternionForResult(
  body: Body,
  currentValue: number,
  targetValue: number,
) {
  const shape = body.shapes[0] as ConvexPolyhedron;
  const faces = (shape.faces as any) as (number[] & {
    faceValue: number;
  })[];

  const currentNormal =
    shape.faceNormals[faces.findIndex((n) => n.faceValue === currentValue)];
  const targetNormal =
    shape.faceNormals[faces.findIndex((n) => n.faceValue === targetValue)];

  if (currentNormal && targetNormal) {
    const rotation = new Quaternion().setFromVectors(
      currentNormal,
      targetNormal,
    );

    // const deg = new Vec3();
    // rotation.toEuler(deg);
    // console.log(
    //   `rotation need from ${currentValue} to ${targetValue}`,
    //   deg.vmul(new Vec3(180 / Math.PI, 180 / Math.PI, 180 / Math.PI)),
    // );

    return body.quaternion.clone().mult(rotation.inverse());
  }
  return null;
}
