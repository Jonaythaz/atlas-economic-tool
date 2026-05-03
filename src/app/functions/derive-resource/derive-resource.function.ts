import { computed, type Resource, resourceFromSnapshots } from '@angular/core';

export function deriveResource<T, R>(opts: DeriveResourceOptions<T, R>): Resource<R | undefined> {
	const derived = computed(() => {
		const snapshot = opts.source.snapshot();
		if (snapshot.status === 'error') {
			return snapshot;
		}
		return { status: snapshot.status, value: isDefined(snapshot.value) ? opts.computation(snapshot.value) : undefined };
	});
	return resourceFromSnapshots(derived);
}

type DeriveResourceOptions<T, R> = {
	source: Resource<T>;
	computation: (value: NoInfer<Exclude<T, undefined>>) => R;
};

function isDefined<T>(value: T): value is Exclude<T, undefined> {
	return value !== undefined;
}
