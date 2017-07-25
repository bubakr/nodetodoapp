const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server')
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {newtodos, populateTodos, newusers, populateUsers} = require('./seed/seed');


const newObjectID = new ObjectID();

//Wipe all todos document in database
beforeEach(populateUsers);
beforeEach(populateTodos);

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


describe('GET /users/me', ()=>{

    it('Should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', newusers[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(newusers[0]._id.toHexString());
                expect(res.body.email).toBe(newusers[0].email);

            })
            .end(done);
    });


    it('Should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', 'abc123')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);

    });

});


describe('POST /users', ()=>{
    it('should create a user', (done)=>{

        var email = 'email@example.com';
        var password = 'password1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.email).toBe(email);
                    expect(user.password).toNotBe(password);
                    done();
                });
            });

    });

    it('should return validation error if request invalid', (done)=>{
        var email = 'invalidemail@domain';
        var password = '123';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done)=>{
        var email = newusers[0].email;
        var password = '123';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);

    });

});
