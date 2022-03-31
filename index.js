const Hapi = require('hapi');
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
const { Client } = require('pg')

//DB credentials
const client = new Client({
    user: 'ecom-dhanush.s1',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  })
 client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

async function fun(query) {
    var data = [];
    console.log(client);
    var sql = await client.query(query);
  
    return sql.rows;
  }


//app def

const app = async () => {  
const server = new Hapi.Server({
    host:'localhost',
    port:3001
});

  
server.route([
   /* {
    method: 'POST',
    path: '/signup',
    handler: function (request, h) {

        const payload = request.payload;

        return `Welcome ${payload.username}!`;
    }

    },

{
    method: 'POST',
    path: '/hello/{user}',
    handler: function (request, h) {

        return `Hello ${request.params.user}!`;
}
}*/
{
method: ['PUT', 'POST'],
    path: '/',
    handler: function (request, h) {

        return 'I did something!';
    }
}
,

{
    method : 'GET',
    path:'/hi',
    handler:(req,r)=>{
    console.log('hello');
    
    return fun('select * from hr');    }

}

]);

//await server.register({plugin:require('inert')});

   

await server.start((err)=>{
if(err){
    throw err;
}
console.log(server.info.address);
console.log('hiiiii')


});


}
app();
/*
var server = http.createServer(handler);

server.listen(8080);*/