const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server')
const {Todo} = require('./../models/todo');


const dummyTodos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo'
}];

const newObjectID = new ObjectID();

//Wipe all todos document in database
beforeEach((done)=>{
    Todo.remove({}).then(()=> {
        Todo.insertMany(dummyTodos);
    }).then(()=> done());
});

//strart test case
describe('POST / Todos', ()=>{


    it('Should create a new todo', (done)=>{
        var text = 'I am the captain of my ship';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));

            });
    });



    it('should not create a todo with invalid data', (done)=>{
        var text = "";

        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end((err, res) => {
            if (err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });


});



describe('GET /todos', ()=>{
    it('Should get all todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) =>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done());
    });
});



describe('GET /todo/:id', ()=>{
    it('Should return a todo doc.', (done)=>{
        request(app)
            .get(`/todo/${dummyTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
            })
            .end(done);
    });


    it('Should return 404 if todo not found', (done)=>{
        request(app)
            .get(`/todo/${newObjectID}`)
            .expect(404)
            .end(done);
    });


    it('Should return 404 if id is not a valid ObjectID', (done)=>{
        request(app)
            .get('/todo/1123123')
            .expect(404)
            .end(done);
    });
});
