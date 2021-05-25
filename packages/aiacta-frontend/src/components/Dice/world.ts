import {
  Body,
  BODY_TYPES,
  ContactMaterial,
  Material,
  NaiveBroadphase,
  Plane,
  World,
} from 'cannon-es';

export const DieMaterial = new Material();
export const FloorMaterial = new Material();
export const BarrierMaterial = new Material();

export const linearDamping = 0.1;
export const angularDamping = 0.1;

export function createWorld(width: number, height: number, gravity = -500) {
  const world = new World({ allowSleep: true });

  world.broadphase = new NaiveBroadphase();

  world.gravity.set(0, 0, gravity);

  world.addContactMaterial(
    new ContactMaterial(FloorMaterial, DieMaterial, {
      friction: 0.01,
      restitution: 0.5,
    }),
  );
  world.addContactMaterial(
    new ContactMaterial(BarrierMaterial, DieMaterial, {
      friction: 0,
      restitution: 1,
    }),
  );
  world.addContactMaterial(
    new ContactMaterial(DieMaterial, DieMaterial, {
      friction: 0,
      restitution: 0.5,
    }),
  );

  // ground
  const body = new Body({ type: BODY_TYPES.STATIC, mass: 0 });
  body.addShape(new Plane());
  body.material = FloorMaterial;
  world.addBody(body);

  // barriers
  const left = new Body({ type: BODY_TYPES.STATIC, mass: 0 });
  left.addShape(new Plane());
  left.position.set(-width / 2, 0, 0);
  left.quaternion.setFromEuler(0, Math.PI / 2, 0);
  left.material = BarrierMaterial;
  world.addBody(left);

  const top = new Body({ type: BODY_TYPES.STATIC, mass: 0 });
  top.addShape(new Plane());
  top.position.set(0, height / 2, 0);
  top.quaternion.setFromEuler(Math.PI / 2, 0, 0);
  top.material = BarrierMaterial;
  world.addBody(top);

  const right = new Body({ type: BODY_TYPES.STATIC, mass: 0 });
  right.addShape(new Plane());
  right.position.set(width / 2, 0, 0);
  right.quaternion.setFromEuler(0, -Math.PI / 2, 0);
  right.material = BarrierMaterial;
  world.addBody(right);

  const bottom = new Body({ type: BODY_TYPES.STATIC, mass: 0 });
  bottom.addShape(new Plane());
  bottom.position.set(0, -height / 2, 0);
  bottom.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  bottom.material = BarrierMaterial;
  world.addBody(bottom);

  return world;
}
