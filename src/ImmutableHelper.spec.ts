import {ImmutableHelper} from './ImmutableHelper';

describe('ImmutableHelper', ()=> {

    describe('ImmutableHelper should work correctly', ()=> {
        it('Check cloning & freezing', ()=> {
            const source = {
                a: 1,
                b: 2,
                c: {
                    d: 3,
                    e: 4,
                    f: {
                        g: 5,
                        h: 'hello!'
                    }
                }
            };
            const immutableObject = ImmutableHelper.toImmutable(source);

            expect(immutableObject).toEqual(source);
            expect(function(){immutableObject['c']['f']['h'] = 'hello2'}).toThrow(new TypeError("Cannot assign to read only property 'h' of object '#<Object>'"));
        });
    });
});
