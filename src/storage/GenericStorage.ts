import {EntityBase} from "zavadil-ts-common";

export interface GenericStorage<T extends EntityBase> {

	loadById(id: number): Promise<T>;

	loadFirst(): Promise<T>;

	save(data: T): Promise<T>;

	loadAll(): Promise<Array<T>>;

	total(): Promise<number>;

}
