const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')
const {Todo} = require('./../models/todo');

//Wipe all todos document in database
beforeEach((done)=>{
    Todo.remove({}).then(()=> done());
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

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));

            });
    });



    it('should not create a todo with invalid data', ()=>{
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
                expect(todos.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    })

});
