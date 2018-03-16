const mediaStyle = require('../lib');

const defaultMedia = () => {
    const deviceSize = { width: 330, height: 660 };
    return mediaStyle(deviceSize);
};

test('complex when chain', () => {
    const deviceSize = { width: 330, height: 660 };
    const media = mediaStyle(deviceSize);
    const styles = media([
        {
            when: true,
            style: { color: 'white' },
        },
        {
            // just one must be true
            whenAny: ['lte', 'eq'], // array, string, or function
            width: 400,
    
            // function can return array or obj
            style: { color: 'blue', backgroundColor: 'yellow' },
        }, {
            whenAll: [
                'lte',
                (deviceSize, constraintSize) => deviceSize.width === 330,
            ],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }, {
            // all must be true
            whenAll: [
                'gt',
                (deviceSize, constraintSize) => deviceSize.width === constraintSize.width,
                true,
            ],
            // combining both = and 
            width: 400,
            height: 600,
            style: [{ color: 'white' }, { margin: 20 }],
        }, {
            when: 'lt', // when=string only, throw if an array
            width: 600,
            style: [{ backgroundColor: 'white' }],
        },
    ]);

    expect(styles).toHaveLength(4);

    const firstStyle = styles[0];
    expect(firstStyle).toEqual({ color: 'white' });
    
    const secondStyle = styles[1];
    expect(secondStyle).toEqual({ color: 'blue', backgroundColor: 'yellow' });

    const thirdStyle = styles[2];
    expect(thirdStyle).toEqual({ fontSize: 100 });

    const fourthStyle = styles[3];
    expect(fourthStyle).toEqual({ backgroundColor: 'white' });
});

test('only style & when key:value should pass', () => {
    const media = defaultMedia();
    const [style] = media({
        when: true,
        style: { backgroundColor: 'white' },
    });
    expect(style).toEqual({ backgroundColor: 'white' });
});

test('no width and height should always pass', () => {
    const media = defaultMedia();
    const [style] = media([{
        when: 'lt',
        style: { backgroundColor: 'white' },
    }]);
    expect(style).toEqual({ backgroundColor: 'white' });
});

test('2d arrays should flatten', () => {
    const media = defaultMedia();
    const style1 = [{
        when: true,
        style: { backgroundColor: 'white' },
    }, {
        when: 'gt',
        width: 100,
        style: { fontSize: 100 },
    }];
    const style2 = [{
        when: 'lt',
        width: 1000,
        style: { color: 'white' },
    }];
    const [res1, res2, res3] = media([style1, style2]);
    expect(res1).toEqual({ backgroundColor: 'white' });
    expect(res2).toEqual({ fontSize: 100 });
    expect(res3).toEqual({ color: 'white' });
});

test('throw when no value associated with style key', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            when: 'lt',
            width: 600,
        }]);    
    }).toThrow();
});

test('throw on wrong data structure 1', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 2', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            when: ['lt', 'gt'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 3', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            when: 'string-func-that-does-not-exist',
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 4', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            whenAny: ['hey', 'now'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});


test('throw on wrong data structure 5', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            whenAll: ['hey', 'now'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 6', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            when: 'gt',
            whenAll: ['lt'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 7', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            when: 'gt',
            whenAny: ['lt'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});

test('throw on wrong data structure 8', () => {
    const media = defaultMedia();
    expect(() => {
        media([{
            whenAll: 'gt',
            whenAny: ['lt'],
            width: 400,
            height: 700,
            style: { fontSize: 100 },
        }]);
    }).toThrow();
});
