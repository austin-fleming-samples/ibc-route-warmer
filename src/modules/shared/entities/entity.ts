import { v4 as uuidv4 } from "uuid";

export class Entity {
	readonly uuid: string;

	constructor() {
		this.uuid = uuidv4()
	}

	equals(entity: Entity): boolean {
		return entity.uuid === this.uuid
	}
}