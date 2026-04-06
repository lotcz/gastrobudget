import {EntityBase, HashCacheAsync, StringUtil} from "zavadil-ts-common";
import {GenericStorage} from "./GenericStorage";

export class LocalStorageSummary {
	ids: Array<number> = [];
}

export class LocalStorage<T extends EntityBase> implements GenericStorage<T> {

	name: string;

	summary: LocalStorageSummary;

	cache: HashCacheAsync<number, T>;

	constructor(name: string) {
		this.name = name;
		this.summary = this.loadSummary();
		this.cache = new HashCacheAsync((k) => this.loadByIdInternal(k));
	}

	getKeyBase() {
		return `gastro-${this.name}`;
	}

	getItemKey(id: number) {
		return `${this.getKeyBase()}-${id}`;
	}

	loadSummary(): LocalStorageSummary {
		const json = localStorage.getItem(this.getKeyBase());
		if (StringUtil.isBlank(json)) return new LocalStorageSummary();
		return JSON.parse(json);
	}

	saveSummary() {
		const json = JSON.stringify(this.summary);
		localStorage.setItem(this.getKeyBase(), json);
	}

	loadByIdInternal(id: number): Promise<T> {
		const itemJson = localStorage.getItem(this.getItemKey(id));
		if (StringUtil.isBlank(itemJson)) throw new Error(`Item of type ${this.name} with id ${id} not found!`);
		const item = JSON.parse(itemJson);
		return Promise.resolve(item);
	}

	loadById(id: number): Promise<T> {
		return this.cache.get(id);
	}

	loadFirst(): Promise<T> {
		if (this.summary.ids.length <= 0) Promise.reject("No data");
		return this.loadById(this.summary.ids[0]);
	}

	save(data: T): Promise<T> {
		if (!data.id) {
			const maxId = this.summary.ids.length > 0 ? Math.max(...this.summary.ids) : 0;
			data.id = maxId + 1;
			data.createdOn = new Date();
			this.summary.ids.push(data.id);
			this.saveSummary();
		}
		data.lastUpdatedOn = new Date();
		const json = JSON.stringify(data);
		localStorage.setItem(this.getItemKey(data.id), json);
		const n = {...data};
		this.cache.set(data.id, n);
		return Promise.resolve(n);
	}

	loadAll(): Promise<Array<T>> {
		return Promise.all(
			this.summary.ids.map((id) => this.loadById(id))
		);
	}

	total(): Promise<number> {
		return Promise.resolve(this.summary.ids.length);
	}

}
