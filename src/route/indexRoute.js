const Todo = require('../connection/todo.js');

function route(app) {

    app.get('/', async (req, res) => {
        await Todo.find({ delete: false })
            .then(showData => {
                showData = showData.map(showData => showData.toObject());
                res.render('home', { showData });
            })
            .catch((err) => {
                console.log(err);
            })
    });

    app.post('/api', async (req, res) => {
        const newTodo = new Todo({ title: `${req.body.title}`, completed: false, date: new Date(), delete: false });
        newTodo.save().then(() => console.log("saved!"));
        res.render('home');
    })

    app.put('/api/delete', async (req, res) => {
        await Todo.findOneAndUpdate({ _id: req.body._id }, { delete: true }, { new: true })
            .then(() => { res.render('home'); console.log('Deleted!') })
            .catch((err) => {
                console.log(err);
            })
    })
}

module.exports = route;
