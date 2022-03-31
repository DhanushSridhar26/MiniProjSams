const { Client } = require('pg')
const redis = require('./redis')
var amqp = require('amqplib/callback_api');
var pkey = {'job':'job_id','hr':'h_id','candidate':'u_id','manager':'m_id'}
//helper
async function getVal(table,coloumn,id,pk){
    let c1 = await redis.cli.get(`${table}_${id}`);
    if(c1){
        console.log('HIT')
        console.log(JSON.parse(c1)[0][coloumn])
        return JSON.parse(c1)[0][coloumn]
    }
    else{
        console.log('MISS')
       let results =  await client.query(`SELECT * FROM ${table} where ${pk} = ${id}`)
        
       await redis.cli.setEx(`${table}_${id}`, 1440, JSON.stringify(results.rows));
        console.log('in')
        console.log(results.rows[0][coloumn])

        console.log('out')
        return results.rows[0][coloumn]

    }
    console.log('OVER!')
    } 

const getv = async (req,res)=>{

    const {table,col,id,pk} = req.params

    var a = await getVal(table,col,id,pk)

    console.log('hahaha')
    console.log(a)
    res.send(a)
}


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

  //get time
  const  getTime = (req,res)=>{
    console.log('hello');
    q = 'select now()'
    var s = client.query(q, (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(results)
      })

    console.log('HELLO');
}

//login
const login = (req,res)=>{
    const uname= req.body.username
    const pass = req.body.password
    const {user} = req.params
    console.log(user,uname,pass)
    client.query(`SELECT * FROM ${user} where username = '${uname}'`, (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows.length>0){
            if(results.rows[0]['password'] == pass){
                res.send('SUCCESS')
            }
            else{
                res.send('FAIL')
            }
        }
        else{
            res.send('NO USER')
        }
    })
    
}

//DeleteData
const delData = (request, response) => {
    const {table,id} = request.body
    const pk = pkey[table]
    client.query(`DELETE FROM ${table} where ${pk} = ${id}`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send('DONE!')
    })
  }

//list all jobs
  const getJobs = (request, response) => {
    client.query('SELECT * FROM job', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  //get candidates
  const getCandidates = (request, response) => {
    client.query('SELECT * FROM candidate', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const canReg = (req,res) => {
    const { u_id , firstname ,lastname,phone, email,address,status ,h_id} = req.body;
    client.query(`INSERT INTO "candidate" ("u_id" ,"firstname" ,"lastname", "phone","email","address", "status" ,"h_id") VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,[u_id , firstname ,lastname,phone, email,address,status ,h_id], (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
  }

  const getTable = (request, response) => {
      const {table} = request.params

      if(table=='job'){
        client.query(`SELECT * FROM ${table} where status = 'active'`, (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).json(results.rows)

          })

      }
      else
      client.query(`SELECT * FROM ${table}`, (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
  

  const insertDb = (req,res) => {
    const {table} = req.params

    if(table == 'candidate'){
    const { u_id , firstname ,lastname,phone, email,address,status ,h_id} = req.body;
    
    client.query(`INSERT INTO "candidate" ("u_id" ,"firstname" ,"lastname", "phone","email","address", "status" ,"h_id") VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,[u_id , firstname ,lastname,phone, email,address,status ,h_id], (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
    }
    else if(table == 'hr'){

        const {h_id , firstname ,  lastname ,  phone ,  email} = req.body
        client.query(`INSERT INTO "hr" ("h_id" ,"firstname" ,"lastname", "phone","email") VALUES ($1,$2,$3,$4,$5);`,[h_id , firstname ,lastname,phone, email], (error, results) => {
            if (error) {
              throw error
            }
            res.status(200).json(results.rows)
          })

    }
    else if(table == 'manager'){
        const {m_id , firstname ,  lastname ,  phone ,  email} = req.body
        client.query(`INSERT INTO "manager" ("m_id" ,"firstname" ,"lastname", "phone","email") VALUES ($1,$2,$3,$4,$5);`,[m_id , firstname ,lastname,phone, email], (error, results) => {
            if (error) {
              throw error
            }
            res.status(200).json(results.rows)
          })
    }
    else if(table =='job'){
        const {job_id,position,description,pay,vacant_count,h_id} = req.body

        client.query(`INSERT INTO "job" ("job_id","position","description","pay","vacant_count","h_id") VALUES ($1,$2,$3,$4,$5,$6)`,[],(error, results) => {
            if (error) {
              throw error
            }
            res.status(200).json(results.rows)
          })
    }
  }

  const listJob = async (req,res)=> {
    const {jobID} = req.params;
    console.log(jobID)

    var c = await redis.cli.get(`${jobID}`);
    if(c){
        console.log('HIT')
        res.send(JSON.parse(c))
    }
    else{
        console.log('MISS')
        client.query(`SELECT * FROM job where job_id = ${jobID}`, (error, results) => {
                if (error) {
                  throw error
                }
        redis.cli.setEx(jobID, 1440, JSON.stringify(results.rows));
        res.status(200).json(results.rows)
              })

    }
    console.log('OVER!')
    } 

    const mail = async (req,res)=>{

    amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(async function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'mail';
        var id = req.params.id ;
        var email = await getVal('candidate','email',id,'u_id')

        msg = {
            'to':email,
            'subject':req.body.subject,
            'text':req.body.content
        }
        msg1 = JSON.stringify(msg)

        channel.assertQueue(queue, {
            durable: true
        });

        channel.sendToQueue(queue, Buffer.from(msg1));

        console.log(" [x] Sent %s", msg1);
    });

});

res.send('MAIL SNENT')
    }

    
//DeleteData
const updateJobStat = (request, response) => {
    const {id} = request.params
    client.query(`UPDATE job set status = 'inactive' where job_id = ${id}`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send('DONE!')
    })
  }

  const getApplicants = (request, response) => {
    const {jid} = request.params

    client.query(`select * from applies_for natural join candidate where job_id = ${jid}`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    })
  }
  const applyJob = (request, response) => {
    const {uid,jid} = request.params
    client.query(`Insert into "applies_for" ("job_id","u_id") values($1,$2)`,[jid,uid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send('Applied!')
    })
  }
  module.exports = {
      getJobs,getTime,getCandidates,canReg,getTable, insertDb,listJob,getv,mail,login,delData,updateJobStat,getApplicants,applyJob
  }
