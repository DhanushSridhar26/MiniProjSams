const express = require('express')
const db = require('./query')
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const app = express()
const port = 3000



app.use(express.json())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(upload.array()); 

//APP
app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/time', db.getTime)


app.get('/view_jobs',db.getJobs)
app.get('/view_candidates',db.getCandidates)
app.get('/view/:table',db.getTable)

app.get('get/:table/:col/:id/:pk',db.getv)

app.post('/candidate/register',db.canReg)
app.post('/:table/insert',db.insertDb)
app.get('/hr/listjob/:jobID',db.listJob)

app.post('/:user/login',db.login)

app.delete('delete/:table/:id',db.delData)
app.put('/deljob/:id/',db.updateJobStat)

app.post('/mail/:id',db.mail)
app.post('/applyJob/:uid/:jid',db.applyJob)
app.get('/applicants/:jid',db.getApplicants)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})