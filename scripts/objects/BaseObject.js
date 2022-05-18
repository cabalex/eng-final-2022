import { GLTFLoader } from 'GLTFLoader';
import { Vector3, SmoothShading } from 'three';
import Animation from '../Animation.js';

// https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
function unproject(camera, vec) {
    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    var distance = - camera.position.z / vec.z;

    return new Vector3().copy( camera.position ).add( vec.multiplyScalar( distance ) );

}

export default class BaseObject {
    constructor(scene, parent, url) {
        this.scene = scene;
        this.parent = parent;
        this.ready = false;
        this._loader = new GLTFLoader();

        this.animations = [];

        this.addVelocityY = 0;

        this.name = "Base Object";
        this.description = "This is an example object.";

        this.loadObject(url).then((object) => {
            this.object = object;
            this.objectChildren = object.children;
            this.objectChildren.forEach(child => {
                child.castShadow = true;
                child.geometry.computeVertexNormals(true);
                child.material.flatShading = false;
            })
            this.scene.add(this.object);

            this.ready = true;
            this.onReady();
        });
    }

    deconstructor() {
        this.scene.remove(this.object);
        this.ready = false;
    }

    onReady() {
        // data
        return true;
    }

    loadObject(url) {
        return new Promise((resolve, reject) => {
            this._loader.load(url, (gltf) => {
                resolve(gltf.scene);
            })
        })
    }

    showObjectDetails() {
        $('.description h1').text(this.name);
        $('.description > p').remove();
        $('.description').animate({scrollTop: 0}, 100);
        $('.description').append('<p>' + this.description.split('\n').join('</p><p>') + '</p>').addClass('open');


        let x = ((window.innerWidth - Math.min(window.innerWidth / 2, 520) ) / 1.5 / window.innerWidth) * -2 + 1;
        let destination = unproject(this.parent.camera, new Vector3(x, 0, 0));
        destination.x += this.object.position.x;
        destination.z = 5;

        this.parent.isDescriptionOpen = true;

        this.parent.addAnimation(
            new Animation(
                this.parent.camera,
                60,
                (object, frame, duration) => {
                    object.position.x -= (object.position.x - destination.x) / 8;
                    object.position.z -= (object.position.z - destination.z) / 8;
                },
                (object, duration) => {
                    object.position.x = destination.x;
                    object.position.z = destination.z;
                }
            )
        );
    }

    onClick() {
        if (!this.parent.isDescriptionOpen) this.showObjectDetails();
    }

    onDrag(startPos, currentPos) {
        this.addVelocityY = (currentPos.x - startPos.x) * 0.1;
    }

    render(scene, camera, delta, isHovered) {
        this.object.rotation.y += delta + this.addVelocityY;
        this.addVelocityY *= 0.99;
        this.object.rotation.z = Math.sin(this.object.rotation.y) * 0.5;

        this.object.updateMatrixWorld(true);
        if ((isHovered || this.parent.isDescriptionOpen) && !this.object.userData.hovered) {
            this.object.userData.hovered = true;
            this.parent.addAnimation(
                new Animation(
                    this.object,
                    10,
                    (object, frame, duration) => {
                        object.scale.x = 0.5 + (frame / duration * 0.2);
                        object.scale.y = 0.5 + (frame / duration * 0.2);
                        object.scale.z = 0.5 + (frame / duration * 0.2);
                    },
                    (object, duration) => {
                        object.scale.x = 0.7;
                        object.scale.y = 0.7;
                        object.scale.z = 0.7;
                    }
                )
            )
        } else if (!(isHovered || this.parent.isDescriptionOpen) && this.object.userData.hovered) {
            this.object.userData.hovered = false;
            this.parent.addAnimation(
                new Animation(
                    this.object,
                    10,
                    (object, frame, duration) => {
                        object.scale.x = 0.7 - (frame / duration * 0.2);
                        object.scale.y = 0.7 - (frame / duration * 0.2);
                        object.scale.z = 0.7 - (frame / duration * 0.2);
                    },
                    (object, duration) => {
                        object.scale.x = 0.5;
                        object.scale.y = 0.5;
                        object.scale.z = 0.5;
                    }
                )
            )
        }
    }
}