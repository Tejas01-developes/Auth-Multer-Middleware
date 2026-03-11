
import { db } from "../dbconnection/db_connections.js"
import { refreshtoken } from "../tokens/tokens.js"

export const insertquery=(data)=>{
    return new Promise((resolve,reject)=>{
        
        db.query(
            'insert into users (id,name,email,password) values (?,?,?,?)',
            [data.id,data.name,data.email,data.password],
            (err)=>{
                if(err){
                 return reject("user not inserted",err)
                }
              return resolve("user insert succesfully")
            }
            
        )

    })
}


export const loginquery=(data)=>{
    return new Promise((resolve,reject)=>{
       
db.query(
    'select * from users where email=?',
    [data.email],
    (err,res)=>{
        if(err){
            return reject("db can not give info",err)
        }
        return resolve(res)
    }
    )}
)

}


export const inserttoken=(data)=>{
    return new Promise((resolve,reject)=>{
        const userid=data.userid;
        const refresh=refreshtoken(userid)
        db.query(
            'insert into refreshtoken (user_id,token,added_at,expired_at) values (?,?,now(),date_add(now(),interval 7 day))',
            [data.userid,refresh],
            (err)=>{
                if(err){
                  reject("token not inserted",err)
                 console.log("insertion problam from db")
                 return
                }
              return resolve("token insert succesfully",refresh)
            }
            
        )

    })
}



export const checktoken=(data)=>{
    console.log("entered to check token")
    return new Promise((resolve,reject)=>{
       
db.query(
    'select * from refreshtoken where user_id=?',
    [data.userid],
    (err,res)=>{
        if(err){
             reject("db can not give info",err)
            console.log("db can not give info")
            return
        }
        if(res.length === 0){
            // return reject("no user with this id")
            inserttoken(data)
            .then(resolve)
            .catch(reject);
            console.log("new token inserted")
        }
        return resolve(res)
    }
    )}
)

}

export const updatetoken=(data)=>{
    console.log("entered to update token")
    return new Promise((resolve,reject)=>{
        const userid=data.userid;
        const refresh=refreshtoken(userid)
        db.query(
            'update refreshtoken set token=? where user_id=?',
            [refresh,data.userid],
            (err)=>{
                if(err){
                    return reject("error updating token")
                }
                return resolve("update token success",refresh)
            }
        )
    })
}