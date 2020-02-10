'use strict';

module.exports = function(Cat) {

    //operationhooks
    Cat.observe('before save', function(context, next) {
        if (context.instance) context.instance.updated = new Date();
        next();
    });

    //remote hooks
    Cat.afterRemote('findById', function(context, cat, next) {
        cat.description = cat.name + ' is ' + cat.age +
            ' years old and is a ' + cat.breed;
        next();
    });

    //remote method
    Cat.adoptable = function(id, cb) {
        Cat.findById(id, function(err, cat) {
            if (err) return cb("Error", null);
            if (!cat) return cb("Cat not found", null);
            let canAdopt = false;
            if (cat.breed != 'tiger' || (cat.age >= 10)) canAdopt = true;
            cb(null, canAdopt);
        });
    }

    Cat.remoteMethod('adoptable', {
        accepts: { arg: 'id', type: 'any' },
        returns: { arg: 'adoptable', type: 'boolean' }
    });

    Cat.validatesInclusionOf('gender', { 'in': ['male', 'female'] });
    Cat.validatesNumericalityOf('age', { int: true });

    Cat.validate('age', function(err) {
        if (this.age <= 0) err();
    }, { message: 'Must be positive' });
};
