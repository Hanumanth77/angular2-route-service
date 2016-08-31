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
            try {
                immutableObject['c']['f']['h'] = 'hello2';
            } catch (e) {
                expect(e.message).toBe('Attempted to assign to readonly property.');
            }
        });
    });
});
