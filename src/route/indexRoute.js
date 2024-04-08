const Todo = require('../connection/todo.js');
const User = require('../connection/user.js');

function route(app) {

    app.get('/', async (req, res) => {
        if (req.query.username !== '' && req.query.username !== null && req.query.username !== undefined) {
            await Todo.find({username:req.query.username, delete: false })
                .then(showData => {
                    showData = showData.map(showData => showData.toObject());
                    res.render('home', { showData });
                })
                .catch((err) => {   
                    console.log(err);
                });
        } else {
            res.redirect('/login');
        }
    });


    app.post('/api', async (req, res) => {
        const checkUser = await User.findOne({username: req.body.username});
        if(checkUser){
            const newTodo = await new Todo({username: checkUser.username, title: `${req.body.title}`, completed: false, date: new Date(), delete: false });
            newTodo.save().then(() => console.log("saved todo!"));
            res.render('home');
        }
    })

    app.put('/api/delete', async (req, res) => {
        await Todo.findOneAndUpdate({ _id: req.body._id }, { delete: true }, { new: true })
            .then(() => { res.render('home'); console.log('Deleted!') })
            .catch((err) => {
                console.log(err);
            })
    })

    app.get('/login', (req, res) => {
        res.render('login');
    })
    app.post('/login', async (req, res) => {
        const checkUser = await User.find({ username: req.body.username, password: req.body.password });
        if (checkUser != '') {
            res.redirect(`/?username=${req.body.username}`);

        } else {
            res.render('login');
        }
    })
    app.get('/register', (req, res) => {
        res.render('register');
    })
    app.post('/register', async (req, res) => {
        const checkUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (checkUser != null) {
            if (checkUser.email === req.body.email) {
                res.redirect('/register?message=Email is already registered');
            }
            if (checkUser.username === req.body.username) {
                res.redirect('/register?message=Username is already registered');
            }
        } else {
            const newUser = new User({ username: req.body.username, password: req.body.rePassword, email: req.body.email });
            newUser.save().then(() => console.log("saved user!"));
            res.redirect(`/login`);
        }
    })
}

module.exports = route;
