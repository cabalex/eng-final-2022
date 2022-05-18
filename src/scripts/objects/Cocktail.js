import BaseObject from "./BaseObject.js";
import { GLTFLoader } from 'GLTFLoader';

export default class Cocktail extends BaseObject {
    // cocktail includes two objects

    onReady() {
        this.object.position.x = -8;
        this.object.rotation.y = Math.PI / 3;
        this.object.scale.set(0.5, 0.5, 0.5);
        this.objectChildren.filter(child => child.name === "Glass")[0].material.thickness = 1;

        this.name = "Cocktail";
        this.description = `
        The cocktail represents Holden’s unrealistic idea of what maturity and adulthood should look like. In the novel, he is constantly asking the adults around him to go out for cocktails, only to get rejected by everyone he asks. Thus, it is clearly a poor representation of what adults do, and it shows how far Holden has to go before he understands what it means to be one. Like Holden, when we are growing up, we have our own ideas of what being an adult should be, whether it be the freedom to stay up late, to drive anywhere you please, or to drink whatever you want. The cocktail, and its corresponding alcoholic parties, is one of the many scenarios we see as distinctly “adult”. As we yearn to be adults during our adolescence, we often admire these fictitious scenarios for what they represent, even in actuality we may not actually like to indulge in them when we get older.
`;
    }

    
}