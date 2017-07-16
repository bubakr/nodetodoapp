// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        return console.log('Unable to connect to Mongo database server!');
    }

    console.log('Successfuly connected to Mongo database server!');

    db.collection('Todos').find({

    }).count().then((count)=>{
        console.log('Todos');
        console.log(`Todos count: ${count}`);
    }, (error) =>{
        console.log('Unable to find any todos', error);
    });
    // db.collection('Todos').find({
    //     _id: ObjectId('596b4b8e6411a9d495db55b1')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) =>{
    //     console.log('Unable to find any todos', error);
    // });

    db.close();
});
