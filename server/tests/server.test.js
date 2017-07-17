const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')
const {Todo} = require('./../models/todo');


const dummyTodos = [{
    text: 'First todo'
}, {
    text: 'Second todo'
}];

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
