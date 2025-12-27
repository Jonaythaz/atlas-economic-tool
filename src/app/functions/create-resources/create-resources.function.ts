import { WritableSignal } from "@angular/core";
import { DocumentResource } from "../../types";

type CreateResourcesParams<T, R> = {
    resources: WritableSignal<DocumentResource<T, R>[]>;
    createFn: (model: T) => Promise<R>;
    equalFn: (m1: T | R, m2: T | R) => boolean;
};

export async function createResources<T, R>(params: CreateResourcesParams<T, R>): Promise<boolean> {
    params.resources.update((resources) => resources.map((resource) => resource.status === 'created' ? resource : { ...resource, status: 'loading' }));
    const resultPromises = params.resources()
        .filter((resource) => resource.status === 'loading')
        .map((resource) => params.createFn(resource.model)
            .then<DocumentResource<T, R>, DocumentResource<T, R>>(
                (model) => ({ model, status: 'created' }),
                (error) => ({ ...resource, status: 'error', message: error.message })
            )
            .then((result) => {
                params.resources.update((resources) => resources.map((r) => params.equalFn(r.model, result.model) ? result : r));
                return result.status === 'created';
            })
        );
    return Promise.all(resultPromises).then((results) => results.every((result) => result))
}