import { WritableSignal } from "@angular/core";
import { DocumentResource } from "../../types";

type CreateResourcesParams<T> = {
    resources: WritableSignal<DocumentResource<T>[]>;
    createFn: (model: T) => Promise<T>;
    equalFn: (m1: T, m2: T) => boolean;
};

export async function createResources<T>(params: CreateResourcesParams<T>): Promise<boolean> {
    params.resources.update((resources) => resources.map((resource) => resource.status === 'created' ? resource : { ...resource, status: 'loading' }));
    const resultPromises = params.resources()
        .filter((resource) => resource.status === 'loading')
        .map((resource) => params.createFn(resource.model)
            .then<DocumentResource<T>, DocumentResource<T>>(
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