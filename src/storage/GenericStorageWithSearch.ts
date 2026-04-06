import {EntityBase} from "zavadil-ts-common";
import {GenericStorage} from "./GenericStorage";

export interface GenericStorageWithSearch<T extends EntityBase> extends GenericStorage<T>{

	search(text: string): Promise<Array<T>>;

}
