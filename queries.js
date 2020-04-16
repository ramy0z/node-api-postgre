
const { Pool, Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
// const pool = new Pool({
//   user: 'user',
//   host: 'localhost',
//   database: 'database',
//   password: 'password',
//   port: 5432,
// })
// var conString = "postgres://postgres:123123@localhost:5432/test";

// const pool = new Pool({connectionString: conString});
const pool = new Pool({connectionString: process.env.DATABASE_URL,
  ssl: true});
 
async function getUsers (request, response){
  // validation request 
    return await pool.query('SELECT * FROM users ORDER BY id ASC');
      //response.status(200).json(results.rows)
}

  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        //throw error
        response.status(400).json({"ErrorMessage":error})
      }
      let result =(results.rows.length >0) ? {"Message" :"OK" , "data":results.rows}  : {"Message" :"No User Available" , "data":[]} ;
      response.status(200).json(result)
    })
  }

  const createUser = (request, response) => {
    // vaildation 
    const { name, email } = request.body
    if( name == undefined){
      response.status(200).send(`Name is Requied`);
    }
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
      if (error) {
        throw error
      }
      console.log(results);
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
  }

  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
    //let updatedCol='';
    //updatedCol array of straing >> push >> join with ,
    //updatedCol +=(name!= undefined)?"name = "+name+",":"";
    //updatedCol +=(email!= undefined)?"email = "+email+",":"";

    let updatedCol=[];
   if(name!= undefined)updatedCol.push( `name = '${name}'`);
   if(email!= undefined)updatedCol.push( `email = '${email}'`);

    let finalupdatedCols=updatedCol.toString();
    console.log(finalupdatedCols);
    pool.query(
      'UPDATE users SET '+ finalupdatedCols +' WHERE id ='+id,
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  async function getMyUsers (request, response) {
      let Res=  await getUsers(request, response);
      console.log("result2",Res);
      response.status(200).json(Res)
  }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMyUsers,
  }