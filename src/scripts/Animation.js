
/**
 * @class Animation
 * @classdesc Represents an animation of an object that is rendered by the App class.
 * @param {THREE.Object3D} object The object to animate.
 * @param {number} duration The duration of the animation in frames.
 * @param {function(object, frame)} onFrame The function to call on each frame.
 * @param {function(object, duration)} onEnd The function to call when the animation is complete.
 * @param {function(object, duration)} onStart The function to call when the animation starts.
 * 
 */
export default class Animation {
    constructor(object, duration, onFrame, onEnd=() => {}, onStart=() => {}) {
        this.object = object;
        this.onFrame = onFrame;
        this.onStart = onStart;
        this.onEnd = onEnd;

        this.duration = duration;
        this.time = 0;
        this.ended = false;
    }

    destroy(graceful=true) {
        this.ended = true;
        if (graceful) {
            this.onEnd(this.object, this.duration);
        }
    }

    step() {
        if (this.time === 0) {
            this.onStart(this.object, this.duration);
        }

        this.onFrame(this.object, this.time, this.duration);

        if (this.time === this.duration) {
            this.onEnd(this.object, this.duration);
            this.ended = true;
        }

        this.time++;
    }
}