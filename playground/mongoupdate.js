// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        return console.log('Unable to connect to Mongo database server!');
    }

    console.log('Successfuly connected to Mongo database server!');

    db.collection('Users').findOneAndUpdate({
        _id: ObjectId('596b46bb7c9966303fc5d16a')
    }, {
        $set:{
            completed: true,
            name: 'user'
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });


    db.close();
});
