const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Queue = require('./queue')


const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const catQueue = new Queue();
const dogQueue = new Queue();

const app = express();
const dog1 = {
    imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Golden Retriever',
    story: 'Owner Passed away'
  };
const dog2 = {
    imageURL: 'http://www.dogbreedslist.info/uploads/allimg/dog-pictures/German-Shepherd-Dog-1.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Tornado',
    sex: 'Female',
    age: 5,
    breed: 'German shepherd',
    story: 'Owner moved to a small aprtment'
  };
  const dog3 = {
    imageURL: 'http://img.freepik.com/free-photo/husky-breed-dog-with-tongue-out_1187-1500.jpg?size=338&ext=jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'June',
    sex: 'Female',
    age: 1,
    breed: 'Husky',
    story: 'Rejected by mother'
  }


    const cat1 = {
    imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  };
    const cat2 = {
    imageURL:'https://static.pexels.com/photos/20787/pexels-photo.jpg',
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Tina',
    sex: 'Female',
    age: 1,
    breed: 'Siamese',
    story: 'Abandoned by previous owner'
  };
    const cat3 = {
    imageURL:'http://www.catvet.ca/wp-content/uploads/2016/07/cathealth_kitty.jpg',
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Thunder',
    sex: 'Male',
    age: 3,
    breed: 'Tabby',
    story: 'Owner moved to another country'
  }




app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

catQueue.enqueue(cat1);
catQueue.enqueue(cat2);
catQueue.enqueue(cat3);

dogQueue.enqueue(dog1);
dogQueue.enqueue(dog2);
dogQueue.enqueue(dog3);



app.get('/api/cat', (req, res) => {
    return res.json(catQueue.peek());
})

app.get('/api/dog', (req, res) => {
    return res.json(dogQueue.peek());
})

app.delete('/api/dog', (req, res) => {
    dogQueue.dequeue();
    return res.status(204).end();
})

app.delete('/api/cat', (req, res) => {
    catQueue.dequeue();
    return res.status(204).end();
})



function runServer(port = PORT) {
    const server = app
        .listen(port, () => {
            console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
            console.error('Express failed to start');
            console.error(err);
        });
}

if (require.main === module) {
    dbConnect();
    runServer();
}

module.exports = {app};
