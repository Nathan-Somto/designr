type Listener<T> = (data: T) => void;

export class EventBus {
    private static listeners = new Map<string, Set<Listener<any>>>();

    static on<T>(event: string, listener: Listener<T>) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(listener);
    }

    static off<T>(event: string, listener: Listener<T>) {
        this.listeners.get(event)?.delete(listener);
    }

    static once<T>(event: string, listener: Listener<T>) {
        const wrapper = (data: T) => {
            listener(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    static emit<T>(event: string, data: T) {
        this.listeners.get(event)?.forEach((listener) => {
            (listener as Listener<T>)(data);
        });
    }
}
