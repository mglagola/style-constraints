import Yup from 'yup';

class FunctionSchema extends Yup.mixed {
    _typeCheck(v) {
        return typeof v === 'function';
    }
}

class ObjectSchema extends Yup.object {
    throwOnUnknown (msg) {
        return this.test({
            name: 'throwOnUnknown',
            exclusive: true,
            params: {},
            message: msg || 'No unknown key:values allowed in object',
            test: (value) => {
                const res = this.noUnknown(true).validateSync(value);
                return Object.keys(res).length === Object.keys(value).length;
            },
        });
    }
}

class AlternativesSchema extends Yup.mixed {
    constructor(alternatives = []) {
        super();
        this.alternatives = alternatives;
    }
    validateSync (value) {
        const alts = this.alternatives;
        let errors = [];
        for (let i = 0; i < alts.length; i++) {
            try {
                const s = alts[i];
                const res = s.validateSync(value);
                return res;
            } catch (error) {
                errors.push(error);
            }
        }
        throw new Error(errors.map(e => e.message).join(' :: '));
    }
}

const createSchema = (type) => (...args) => {
    if (!(this instanceof type)) return new type(...args);
    return this;
};

export default Object.assign({}, Yup, {
    func: createSchema(FunctionSchema),
    object: createSchema(ObjectSchema),
    alternatives: createSchema(AlternativesSchema),
});
