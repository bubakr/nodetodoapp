const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');



const userOneID = new ObjectID();
const userTwoID = new ObjectID();


const newtodos = [{
    _id: new ObjectID(),
    text: 'First todo',
    completed: true,
    completedAt: new Date().getTime(),
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    _creator: userTwoID
}];

const newusers = [{
    _id: userOneID,
    email: 'andrew@example.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
},{
    _id: userTwoID,
    email: 'jane@example.com',
    password: 'user2pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID.toHexString(), access: 'auth'}, 'abc123').toString()
    }]

}];


const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        Todo.insertMany(newtodos);
    }).then(()=> done());
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(newusers[0]).save();
        var userTwo = new User(newusers[1]).save();

        return Promise.all([userOne,userTwo]);
    }).then(()=>{
        done();
    });
};


module.exports = {newtodos, populateTodos, newusers, populateUsers};
