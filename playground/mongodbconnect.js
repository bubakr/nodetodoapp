// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        return console.log('Unable to connect to Mongo database server!');
    }

    console.log('Successfuly connected to Mongo database server!');

    // db.collection('Users').insertOne({
    //     name: "Ahmad Abubakr",
    //     age: 30,
    //     location: "Cairo, Egypt."
    // }, (error, result) => {
    //     if (error){
    //         return console.log('Unable to insert new user.');
    //     }
    //
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    //
    // });

    db.close();
});
