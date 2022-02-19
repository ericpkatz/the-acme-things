const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_things_db');

const Thing = sequelize.define('thing', {
  name: {
    type: Sequelize.STRING
  }
});

const express = require('express');
const app = express();
const path = require('path');
app.use('/src', express.static(path.join(__dirname, 'src')));


app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/things', async(req, res, next)=> {
  try {
    res.send(await Thing.findAll());
  }
  catch(ex){
    next(ex);
  }
});

const init = async()=> {
  try {
    await sequelize.sync({ force: true });
    await Thing.create({ name: 'foo'});
    await Thing.create({ name: 'bar'});
    await Thing.create({ name: 'bazz'});
    await Thing.create({ name: 'quq'});
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();
