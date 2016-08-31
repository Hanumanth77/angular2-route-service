export class ImmutableHelper {

    static observeAndFreeze(object) {
        const copied = {};
        for (let i in object) {
            if (object.hasOwnProperty(i)) {
                const propertyValue = object[i];
                if (typeof propertyValue === 'object') {
                    copied[i] = ImmutableHelper.toImmutable(propertyValue);
                } else {
                    copied[i] = propertyValue;
                }
            }
        }
        return Object.freeze(copied);
    }

    static toImmutable<TObject>(object:TObject):TObject {
        return ImmutableHelper.observeAndFreeze(object) as TObject;
    }
}
