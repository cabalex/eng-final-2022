import BaseObject from "./BaseObject.js";
import Animation from "../Animation.js";

export default class Cab extends BaseObject {
    onReady() {
        this.object.position.x = 0;
        this.object.scale.set(0.5, 0.5, 0.5);

        this.name = "Taxi Cab";
        this.description = `
        The taxi cab represents a transition in Holden’s life, as Holden often uses them to get around or visit new places in New York. It is a physical representation of Holden’s search for who or what he wants to be, and shows he is actively searching for his maturity. The cabs also put Holden’s thoughts and feelings into perspective as Holden chats with the driver, providing a realism check and a challenge to his feelings. For example, when he asks the cab driver about the ducks, they choose to sympathize with the fish in the pond instead, providing perspective to Holden’s normally one-sided view. This aligns with the steps we must go through in order to mature; as we grow older, we begin to search for what makes ourselves who we are, and for our purpose in life. The wandering Holden does in these cabs is representative not only of his physical journey, but also his mental journey to maturity.
`;
    }

    
}