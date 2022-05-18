import BaseObject from "./BaseObject.js";
import Animation from "../Animation.js";

export default class Baseball extends BaseObject {
    onReady() {
        this.object.position.x = 8;
        this.object.rotation.y = -Math.PI / 3;
        this.object.scale.set(0.5, 0.5, 0.5);

        this.name = "Baseball";
        this.description = `
        The baseball and, by extension, Allie’s baseball glove, are representative of Holden’s past that he desperately clings to. Holden compares many things to Allie many times throughout the novel, whether it be that he likes what Allie would have liked, done what Allie would have done, and more. It gets to such a point that he pleads to Allie every time he crosses the street: “I’d say to him, ‘Allie, don’t let me disappear. Allie, don’t let me disappear, Allie, don’t let me disappear. Please, Allie’” (Salinger 198). Holden’s constant regrets of how he treated Allie when he was still alive portray a kid clinging to his innocent past that he can never get back. His memories of Allie represent the regrets we have in our own past, and are what we must let go to fully mature as people. Hence why he is so invested in his “catcher in the rye” fantasy- he wants to prevent other kids like him from falling to the same fate he did. Through this experience, he learns what he wants to do with his life away from his past memories, and matures as a result. Through the baseball and its glove, we see that both Holden and ourselves must let go of traumatic past memories if we want to become mature and act on our own.
        `;
    }

    
}