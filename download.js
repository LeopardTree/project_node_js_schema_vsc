const superagent = require('superagent').agent()

const molk_moodle = async() => {
    let dashboard = await superagent
    .post('http://moodle.molk.se/login/index.php')
    .send({username: 'ludvigvive@gmail.com', password: 'qwer1369'})
    .set('Content-Type', 'text/html; charset=utf-8')
    console.log(dashboard.text);
};
molk_moodle();