dotenv.config();
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {database} from './database';
import {fetchGameBySlug, fetchDeveloperBySlug, fetchPlatformsBySlug, fetchGenresBySlug} from "./apiClient";

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '../CSS')));
app.use(express.static(path.join(__dirname, '../public')));

database()
    .then(async (connection) => {
        app.listen(process.env.PORT, () => console.log('Server Running On Port 8080...'));
    })
    .catch((error) => console.error(error));

app.get('/signup', (req, res) => {
    res.render('pages/signup/signup');
});
app.get('/login', (req, res) => {
    res.render('pages/login/login');
});
app.get('/wishlist', (req, res) => {
    res.render('pages/wishlist/wishlist');
});
app.get('/search', (req, res) => {
    res.render('pages/search/search');
});



app.get('/game/:slug', async (req, res) => {
    const game = await fetchGameBySlug(req.params.slug);
    //removes html tags from game description
    let description = game.description;
    let gameDescription = description.replace(/(<([^>]+)>)/gi, '');

    res.render('pages/game/game', {
        name: `${game.name}`,
        description: `${gameDescription}`,
        rating: `${game.rating}`,
        website: `${game.website}`,
        platform: `${game.platform}`,
        released: `${game.released}`,
        image: `${game.background_image}`,
        alternate: `${game.background_image_additional}`,
    });
});



app.get('/developer/:slug', async (req, res) => {
    const developer = await fetchDeveloperBySlug(req.params.slug);
    res.render('pages/developer/developer', {
        name: `${developer.name}`,
        games: `${developer.games_count}`,
        gameslist: `${developer.games}`,
        image: `${developer.image_background}`,
    });
});


app.get('/platforms/:slug', async (req, res) => {
    const platform = await fetchPlatformsBySlug(req.params.slug);

    res.render('pages/platforms/platforms', {
        name: `${platform.name}`,
        year_start: `${platform.year_start}`,
        games_count: `${platform.games_count}`,
    });
});



app.get('/genre/:slug', async (req, res) => {
    const genre = await fetchGenresBySlug(req.params.slug);
    let description = genre.description;
    let genreDescription = description.replace(/(<([^>]+)>)/gi, '');
    res.render('pages/genre/genre', {
        name: `${genre.name}`,
        games: `${genre.games}`,
        games_count: `${genre.games_count}`,
        image: `${genre.image_background}`,
        description: `${genreDescription}`,
    });
});

app.get('/home', (req, res) => {
    res.render('pages/home/home');
});


// AUTH

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {SALT, SESSION_SECRET, SERVER_PORT} = process.env;
const options = {verbose: console.log};
const Database = require('better-sqlite3');

const db = new Database('./users.db', options);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.session());
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());

// SIGN UP
app.get('/signup', (req, res) => {
    res.render(
        '/Users/aidancarvalhodev/Documents/Workspace/Projects/GameLib Project Official/Views/pages/signup/signup.pug',
        {error: null}
    );
});

app.get('/login', (req, res) => {
    let error = null;

    if (req.session && req.session.messages && req.session.messages.length > 0) {
        error = {message: req.session.messages[0]};
    }
    res.render(
        '/Users/aidancarvalhodev/Documents/Workspace/Projects/GameLib Project Official/Views/pages/login/login.pug',
        {
            user: req.user,
            error: error,
            signUpSuccessful: false,
        }
    );
});

app.post('/signup', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;

        if (username.length < 6) {
            throw new Error('Password Must Be At Least 6 characters');
        }
        if (password.length > 16) {
            throw new Error('Password Must Be Less Than 16 characters');
        }
        if (password == 'password') {
            throw new Error('Password cannot be password');
        }

        const user = db
            .prepare('SELECT * FROM users WHERE username = ?')
            .get(username);
        console.log(user);

        if (user) {
            throw new Error('Username In Use');
        }
        const results = db
            .prepare(
                `INSERT INTO users (username, password) VALUES (@username,@password)`
            )
            .run({username, password});

        const newUser = db
            .prepare('SELECT * FROM users WHERE username = ?')
            .get(username);
        if (newUser) {
            res.render(
                '/Users/aidancarvalhodev/Documents/Workspace/Projects/GameLib Project Official/Views/pages/login/login.pug',
                {user: null, signUpSuccessful: true}
            );
        }
        // const saltedPassword = await hashedPassword(req.body.password);
    } catch (error) {
        console.log(error);
        res.status(400).render(
            '/Users/aidancarvalhodev/Documents/Workspace/Projects/GameLib Project Official/Views/pages/signup/signup.pug',

            {error: error}
        );
    }
});

//PASSPORT STRATEGY

passport.use(
    new LocalStrategy(
        {passReqToCallback: true},
        async (req, username, password, done) => {
            req.session.messages = [];
            try {
                const user = db
                    .prepare('SELECT * FROM users WHERE username = ?')
                    .get(username);
                if (!user) {
                    return done(null, false, {message: 'Incorrect Username'});
                }
                if (user.password != password) {
                    return done(null, false, {message: 'Incorrect Password'});
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

app.get('/fail', (req, res) => {
    res.send(' {failed: true} ');
});

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/wishlist',
        failureRedirect: '/fail',
        failureMessage: true,
    })
);
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// PASSPORT SERIALIZE
passport.serializeUser(function (user, done) {
    done(null, user.username);
});
//PASSPORT DFSERIALIZE
passport.deserializeUser(async (username, done) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username);
        if (!user) {
            done({message: 'incorrect Username'});
        }
        return done(null, user);
    } catch (error) {
        done(error);
    }
});
module.exports = app;
