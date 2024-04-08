const session = require('express-session');
const MongodbSession = require('connect-mongodb-session')(session);
const Todo = require('../connection/todo.js');
const User = require('../connection/user.js');

function route(app) {

    // Session
    const store = new MongodbSession({
        uri: 'mongodb://127.0.0.1/todo_list',
        collection: 'sessions',
    })

    app.use(session({
        secret: 'Boys',
        resave: false,
        saveUninitialized: true,
        store: store,
    }))

    const isAuth = (req, res, next) => {
        if (req.session.isAuth) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    app.get('/', isAuth, async (req, res) => {
        if (!req.originalUrl.includes(req.session.username)) {
            return res.redirect(`/?username=${req.session.username}`);
        }
        if (req.session.username !== '' && req.session.username !== null && req.session.username !== undefined) {
            await Todo.find({ username: req.session.username, delete: false })
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

    app.post('/api',isAuth, async (req, res) => {
        const checkUser = await User.findOne({ username: req.session.username });
        if (checkUser) {
            const newTodo = await new Todo({ username: checkUser.username, title: `${req.body.title}`, completed: false, date: new Date(), delete: false });
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
        const checkUser = await User.findOne({ username: req.body.username, password: req.body.password });
        if (checkUser) {
            req.session.isAuth = true;
            req.session.username = req.body.username;
            res.redirect(`/?username=${req.body.username}`);
        } else {
            res.redirect(`/login?message=Username or Password incorrect`);
        }
    })

    app.get('/register', (req, res) => {
        res.render('register');
    })

    app.post('/register', async (req, res) => {
        const checkUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (checkUser) {
            if (checkUser.email === req.body.email) {
                res.redirect('/register?message=Email is already registered');
            } else if (checkUser.username === req.body.username) {
                res.redirect('/register?message=Username is already registered');
            }
        } else {
            const newUser = new User({ username: req.body.username, password: req.body.rePassword, email: req.body.email });
            newUser.save().then(() => console.log("saved user!"));
            res.redirect(`/login`);
        }
    })

    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/login');
            }
        })
    })
}

module.exports = route;
