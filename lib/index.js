import {
    isNil,
    isEmpty,
    compose,
    filter,
    map,
    flatten,
    isString,
    omitBy,
    isFunction,
    pick,
} from 'lodash/fp';
import Yup from './yup';

const and = (...args) => {
    for (let i = 0; i < args.length; i++) {
        const v = args[i];
        if (!v) return v;
    }
    return true;
};

const or = (...args) => {
    for (let i = 0; i < args.length; i++) {
        const v = args[i];
        if (v) return v;
    }
    return false;
};

// Not typical comparators (see isNil check)
const lt = (a, b) => (isNil(b) ? true : a < b);
const gt = (a, b) => (isNil(b) ? true : a > b);
const equals = (a, b) => (isNil(b) ? true : a === b);

// ds = deviceSize, cs = constraintSize
const csEquals = (ds, cs) => equals(ds.width, cs.width) && equals(ds.height, cs.height);
const csLt = (ds, cs) => lt(ds.width, cs.width) && lt(ds.height, cs.height);
const csLte = (...args) => csLt(...args) || csEquals(...args);
const csGt = (ds, cs) => gt(ds.width, cs.width) && gt(ds.height, cs.height);
const csGte = (...args) => csGt(...args) || csEquals(...args);

const DEFAULT_CONSTRAINTS = {
    equals: csEquals,
    eq: csEquals,
    '==': csEquals,
    lt: csLt,
    '<': csLt,
    lte: csLte,
    '<=': csLte,
    'max-width': csLte,
    maxWidth: csLte,
    gt: csGt,
    '>': csGt,
    gte: csGte,
    '>=': csGte,
    'min-width': csLte,
    minWidth: csLte,
};

const singleWhenSchema = Yup.lazy((value) => {
    switch (typeof value) {
        case 'string':
            return Yup.string()
                .oneOf(Object.keys(DEFAULT_CONSTRAINTS))
                .min(1)
                .required();
        case 'function':
            return Yup.func().required();
        case 'boolean':
            return Yup.boolean().required();
        default:
            throw new Error('value must be of type string, func, or boolean');
    }
});

const multWhenSchema = Yup.lazy((value) => {
    if (Array.isArray(value)) {
        return Yup.array()
            .of(singleWhenSchema)
            .ensure();
    }
    return singleWhenSchema;
});

const constraintDefaultSchema = {
    width: Yup.number()
        .min(0)
        .notRequired(),
    height: Yup.number()
        .min(0)
        .notRequired(),
    style: Yup.mixed().required(),
};

const constraintSchemas = [
    Object.assign({}, constraintDefaultSchema, { when: singleWhenSchema }),
    Object.assign({}, constraintDefaultSchema, { whenAny: multWhenSchema }),
    Object.assign({}, constraintDefaultSchema, { whenAll: multWhenSchema }),
].map((s) =>
    Yup.object()
        .shape(s)
        .throwOnUnknown()
);

const constraintSchema = Yup.alternatives(constraintSchemas);

const validateConstraint = (skipValidation = false) => (constraint) => {
    if (!skipValidation) {
        constraintSchema.validateSync(constraint);
    }
    return constraint;
};

// Assumes validation has been performed on `constraint`
const normalizeConstraint = (constraint) => {
    const normalized = Object.assign({}, constraint);
    if (!isNil(normalized.when)) {
        normalized.whenAll = normalized.when;
    }

    const normalizeWhens = compose(
        (x) => (x.length === 0 ? null : x),
        (x) => x.map((when) => (isString(when) ? DEFAULT_CONSTRAINTS[when] : when)),
        filter((x) => !isNil(x)),
        (x) => [].concat(x)
    );
    normalized.whenAll = normalizeWhens(normalized.whenAll);
    normalized.whenAny = normalizeWhens(normalized.whenAny);

    normalized.style = [].concat(normalized.style);

    return omitBy((v, k) => isNil(v) || k === 'when', normalized);
};

const calcValidConstraints = ({ deviceSize, constraints, skipValidation }) => {
    let validConstraints = [];
    for (let i = 0; i < constraints.length; i++) {
        const constraint = compose(
            normalizeConstraint,
            validateConstraint(skipValidation)
        )(constraints[i]);
        const mapWhen = (when) =>
            isFunction(when)
                ? when(deviceSize, pick(['width', 'height'], constraint))
                : when;
        let doesPassConstraint;
        if (!isEmpty(constraint.whenAny)) {
            doesPassConstraint = or(...constraint.whenAny.map(mapWhen));
        } else if (!isEmpty(constraint.whenAll)) {
            doesPassConstraint = and(...constraint.whenAll.map(mapWhen));
        } else {
            throw new Error(`No 'whenAny' or 'whenAll' param found!`);
        }
        if (doesPassConstraint) {
            validConstraints.push(constraint);
        }
    }
    return validConstraints;
};

const styleConstraints = (deviceSize, { skipValidation } = {}) => (...constraints) => {
    const validConstraints = calcValidConstraints({
        deviceSize,
        constraints: flatten(constraints),
        skipValidation,
    });
    return compose(
        flatten,
        filter((style) => !isNil(style)),
        map((cs) => cs.style)
    )(validConstraints);
};

export default styleConstraints;
