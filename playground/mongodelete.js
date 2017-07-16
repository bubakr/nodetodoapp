// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        return console.log('Unable to connect to Mongo database server!');
    }

    console.log('Successfuly connected to Mongo database server!');

    //delete many
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result)=>{
    //     console.log(result);
    // });
    // //delete one
    // db.collection('Todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then((result)=>{
    //     console.log(result);
    // });

    //findone and delete
    db.collection('Todos').findOneAndDelete({
        completed: false
    }).then((result)=>{
        console.log(result);
    });


    db.close();
});
