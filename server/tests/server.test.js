const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server')
const {Todo} = require('./../models/todo');


const newtodos = [{
    _id: new ObjectID(),
    text: 'First todo',
    completed: true,
    completedAt: new Date().getTime()
}, {
    _id: new ObjectID(),
    text: 'Second todo'
}];

const newObjectID = new ObjectID();

//Wipe all todos document in database
beforeEach((done)=>{
    Todo.remove({}).then(()=> {
        Todo.insertMany(newtodos);
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
            .get(`/todos/${newtodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(newtodos[0].text);
            })
            .end(done);
    });


    it('Should return 404 if todo not found', (done)=>{
        request(app)
            .get(`/todos/${newObjectID}`)
            .expect(404)
            .end(done);
    });


    it('Should return 404 if id is not a valid ObjectID', (done)=>{
        request(app)
            .get('/todos/1123123')
            .expect(404)
            .end(done);
    });
});




describe('DELETE /todo/:id', ()=>{
    it('Should remove a todo', (done)=>{
        var hexId = newtodos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch((e)=>done(e));
            });

    });

    it('Should return 404 if todo not found', (done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it('Should return 404 if ObjectID is invalid', (done)=>{
        var id = '123123';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);

    });
});




describe('PATCH /todos/:id', ()=>{
    it('Should update the todo', (done)=>{
        var hexId = newtodos[0]._id.toHexString();
        var newtext = 'This is a new text from the test case';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: newtext
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(newtext);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');

            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done)=>{

        var hexId = newtodos[1]._id.toHexString();
        var newtext = 'This is a new text from the test case 2';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: newtext
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(newtext);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();

            })
            .end(done);

    })
});
