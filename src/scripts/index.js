import * as THREE from 'three';

import Animation from './Animation.js';
import Cab from './objects/Cab.js';
import Cocktail from './objects/Cocktail.js';
import Baseball from './objects/Baseball.js';

class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.clock = new THREE.Clock();
        this.animations = [];

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2().set(-1, -1);
        this.mouseDownPointer = null;
        this.mouseDownIntersects = null;
        $(this.renderer.domElement).off('mousemove').on('mousemove', this.mouseMove.bind(this));
        $(this.renderer.domElement).off('touchmove').on('touchmove', this.mouseMove.bind(this));
        $(this.renderer.domElement).off('mousedown').on('mousedown', this.mouseClick.bind(this));
        $(this.renderer.domElement).off('mouseup').on('mouseup', this.mouseClick.bind(this));
        $(this.renderer.domElement).off('touchstart').on('touchstart', this.mouseClick.bind(this));
        $(this.renderer.domElement).off('touchend').on('touchend', this.mouseClick.bind(this));
        $(this.renderer.domElement).off('mouseout').on('mouseout', this.mouseClick.bind(this));

        // Setup sidebar
        $('.description > h1').text('');
        $('.description > p').text('');

        let closeDescription = () => {
            $('.description').css('display', 'block').removeClass('open');

            this.addAnimation(new Animation(
                this.camera,
                60,
                (object, frame, duration) => {
                    object.position.x -= (object.position.x - 0) / 8;
                    object.position.z -= (object.position.z - 10) / 8;
                },
                (object, duration) => {
                    object.position.x = 0;
                    object.position.z = 10;
                }
            ))
            this.isDescriptionOpen = false;

            setTimeout(() => {
                $('.description').css('display', '');
            }, 200)
        }

        this.isDescriptionOpen = false;
        $('.description #closeDescription').off('click').on('click', (event) => {
            event.stopPropagation();
            closeDescription();
        })
        $(document).on('keydown', (event) => {
            if (event.keyCode === 27 && this.isDescriptionOpen) {
                event.stopPropagation();
                closeDescription();
            }
        })

        this.camera.position.z = 10;
        
        // Set renderer parameters
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        window.addEventListener('resize', this.resize.bind(this));
        document.body.appendChild(this.renderer.domElement);

        // Create scene > add lights
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(0, 2, 1);
        directionalLight.lookAt(0, 0, 0)
        this.scene.add(directionalLight);


        let pointLight = new THREE.PointLight(0xED4245, 3, 10, 2);
        pointLight.position.set(0, 5, 0);
        pointLight.rotation.set(0, 0, Math.PI / 2);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        let pointLight2 = pointLight.clone();
        pointLight2.color.set(0x57F287);
        pointLight2.position.set(-8, 5, 0);
        this.scene.add(pointLight2);

        let pointLight3 = pointLight.clone();
        pointLight3.color.set(0x5865F2);
        pointLight3.position.set(8, 5, 0);
        this.scene.add(pointLight3);
        
        // Create scene > add plane
        let planeGeometry = new THREE.PlaneGeometry(40, 90, 1, 1);
        let planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.y = -2;
        plane.position.z = 40;
        this.scene.add(plane);

        let boxGeometry = new THREE.BoxGeometry(20, 1, 5);
        let boxMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        let box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.y = -2;
        box.receiveShadow = true;
        box.castShadow = true;
        this.scene.add(box);

        // Create scene > add objects
        this.objects = {
            cab: new Cab(this.scene, this, './models/cab/cab.glb'),
            cocktail: new Cocktail(this.scene, this, './models/cocktail/cocktail.glb'),
            softball: new Baseball(this.scene, this, './models/softball/softball.glb')
        }

        new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                if (Object.values(this.objects).map(object => object.ready).filter(ready => !ready).length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10)
        }).then(() => {
            // done loading
            document.getElementById('loadingMuseumBtn').style.display = 'none';
            document.getElementById('enterMuseumBtn').style.display = 'block';

            document.getElementById('enterMuseumBtn').addEventListener('click', this.enterMuseum.bind(this));
        })

        // Render
        this.render();
    }

    enterMuseum() {
        document.getElementById('introModal').style.display = 'none';
        this.addAnimation(new Animation(
            this.camera,
            200,
            (object, frame, duration) => {
                object.position.z -= (object.position.z - 10) / 32;
                object.rotation.x -= (object.rotation.x - 0) / 32;
            },
            (object, duration) => {
                object.position.z = 10;
                object.rotation.x = 0;
            },
            () => {
                this.camera.position.set(0, 0, 30);
                this.camera.rotation.x = -Math.PI / 2;
            }
        ))
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    mouseClick(event) {
        //if (event.type.includes('mouse') && "ontouchend" in document) return;
        event.preventDefault();
        event.stopPropagation();
        
        if (event.type === 'mousedown' || event.type === 'touchstart') {
            // touchend for some reason doesn't have touch properties
            this.mouseMove(event);

            this.mouseDownPointer = this.pointer.clone();

            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects( this.getObjectsInScene(), false )
                .map(intersect => intersect.object);
            
            this.mouseDownIntersects = Object.values(this.objects)
                .filter(object => object.objectChildren.map(obj => intersects.includes(obj)).includes(true));

        } else if (event.type === 'mouseup' || event.type === 'touchend' || event.type === 'mouseout') {
            if (this.mouseDownPointer && this.pointer.distanceTo(this.mouseDownPointer) < 0.1) {
                if (this.mouseDownIntersects.length) {
                    this.mouseDownIntersects.forEach(object => {
                        object.onClick();
                    })
                } else {
                    if (this.isDescriptionOpen) $('.description #closeDescription')[0].click();
                }
            }
            this.mouseDownPointer = null;
            this.mouseDownIntersects = null;
        }

        
        
    }

    mouseMove(event) {
        this.pointer.x = ( (event.clientX + 0.1 || event.originalEvent.touches[0].clientX) / window.innerWidth ) * 2 - 1;
		this.pointer.y = - ( (event.clientY + 0.1 || event.originalEvent.touches[0].clientY) / window.innerHeight ) * 2 + 1;

        if (this.mouseDownPointer && this.mouseDownIntersects && this.pointer.distanceTo(this.mouseDownPointer) > 0.1) {

            if (this.mouseDownIntersects.length) {
                this.mouseDownIntersects.forEach(object => {
                    object.onDrag(this.mouseDownPointer, this.pointer);
                })
            }
        }
    }

    addAnimation(animation) {
        // Destroy any in progress animations to prevent flickering
        this.animations.forEach(anim => {
            if (anim.object === animation.object) {
                anim.destroy();
            }
        })
        this.animations = [...this.animations.filter(anim => anim.object !== animation.object), animation];
        this.animations.push(animation);
    }

    getObjectsInScene() {
        return [].concat.apply([], Object.values(this.objects)
            .map((obj) => {
                if (obj.ready) {
                    return obj.objectChildren;
                }})
            .filter((obj) => obj)
        );
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        let delta = this.clock.getDelta();

        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects( this.getObjectsInScene(), false )
            .map(intersect => intersect.object);

        let intersectsObject = false;

        Object.values(this.objects)
            .filter(object => object.ready)
            .forEach(object => {
                let intersectsSpecificObject = object.objectChildren.map(obj => intersects.includes(obj)).includes(true);
                if (intersectsSpecificObject) intersectsObject = true;
                
                object.render(this.scene, this.camera, delta, intersectsSpecificObject);
            })
        
        if (intersectsObject) {
            $('body').addClass('cursorHover');
        } else {
            $('body').removeClass('cursorHover');
        }
        
        this.animations.forEach(animation => animation.step());
        this.animations = this.animations.filter(animation => !animation.ended);
        
        this.renderer.render(this.scene, this.camera);
    }
}

new App();