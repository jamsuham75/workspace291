//카카오계정테스트입니다.
//이번에는 내 차례다.

const express = require('express');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
//세션 관리
const session = require('express-session');

const app = express();

//미들웨어 설정
app.use(session({
    secret : '39fd09u29fh0937r90f',
    resave : false,
    saveUnintialized : true 
}))

//패스포트 미들웨어
app.use(passport.initialize()); 
app.use(passport.session()); 

const users = [];

passport.use(new kakaoStrategy(
    {
        clientID : 'c1c91dc58ac081c2694fc02937100e5b',
        callbackURL : '/auth/kakao/callback'
    },
    function(accessToken, refreshToken, profile, done){
        console.log(profile);

        var authId = 'Kakao' + profile.id;
        let user = users.find(user => user.authId === authId);

        if(!user){
            user = {
                authId : authId,
                displayName : profile.username || profile.displayName
            };
            users.push(user);
        }
        return done(null, user);
    }
))

passport.serializeUser(function(user, done){
    console.log("serializeUser");
    done(null, user.authId);
})

passport.deserializeUser(function(authId, done){
    console.log("deserializeUser");
    const user = users.find(user => user.authId === authId);
    done(null, user || false);
})

app.get('/', (req, res)=>{
    res.send(`
        <h1>카카오 로그인</h1>
        <a href = "/auth/kakao">로그인</a>
    `);
})

app.get('/auth/kakao', passport.authenticate('kakao'));

app.get('/auth/kakao/callback', passport.authenticate('kakao',{
    successRedirect : '/profile',
    failureRedirect:'/'
}));

app.get('/profile', (req, res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }
    res.send(`
        <h1>${req.user.displayName}님 반갑습니다.</h1>
        <a href = "/logout">로그아웃</a>
        `)
})

const PORT = 8081;
app.listen(PORT, () => console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`));
