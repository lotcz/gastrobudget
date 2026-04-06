import {ArrayUtil, EntityWithName, StringUtil} from "zavadil-ts-common";
import {GenericStorageWithSearch} from "./GenericStorageWithSearch";
import {LocalStorage} from "./LocalStorage";

export class LocalStorageWithSearch<T extends EntityWithName> extends LocalStorage<T> implements GenericStorageWithSearch<T> {

	search(text: string): Promise<Array<T>> {
		if (StringUtil.isBlank(text)) {
			return this.loadAll().then(
				(result) => ArrayUtil.extractStart(result, 10)
			);
		} else {
			return this.loadAll().then(
				(result) => result.filter((d) => StringUtil.safeContains(d.name, text))
			);
		}
	}

}
