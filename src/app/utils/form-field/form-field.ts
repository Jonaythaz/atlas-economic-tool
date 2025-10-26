import { computed, linkedSignal, Signal, signal, WritableSignal } from "@angular/core";

export type FormField<T> = WritableSignal<T> & {
    message(): string | null;
    isDirty(): boolean;
    isInvalid(): boolean;
};
type Fn<T> = (value: T) => string | null;

export function formField<T>(initialValue: T | (() => T), validationFn?: Fn<T>): FormField<T> {
    const initialSignal = initialValue instanceof Function ? computed(initialValue) : signal(initialValue).asReadonly();
    const value = linkedSignal(initialSignal);
    const validation = validationFn ? computed(() => validationFn(value())) : signal(null).asReadonly();
    const isDirty = signal(false);
    const message = computed(() => isDirty() ? validation() : null);
    const isInvalid = computed(() => validation() !== null);

    const formField = linkedSignal(value);

    return Object.assign(formField, {
        set: (newValue: T) => {
            isDirty.set(true);
            value.set(newValue);
        },
        update: (updateFn: (value: T) => T) => {
            isDirty.set(true);
            value.update(updateFn);
        },
        asReadonly: () => value.asReadonly(),
        message,
        isDirty: isDirty.asReadonly(),
        isInvalid,
    });
}