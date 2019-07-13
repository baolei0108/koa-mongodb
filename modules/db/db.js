var MongoClient = require("mongodb").MongoClient;

//引入objectid 用户处理 根据Id查找相应的数据
const ObjectId = require("mongodb").ObjectID;

var dbUrl = 'mongodb://127.0.0.1:27017/';

var dbName = 'koa';

class DB {

    //设计单例
    static getInstance() {
        if(!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;

    }

    constructor () {
        // console.log('这是构造函数')
        this.dbClient = '';
        this.connectFun();  //实例化的时候 就实力话时间

    }

    connectFun() {
        let _that = this;
        return new Promise( (resolve, reject)=> {
           if(!_that.dbClient) {
                // console.log('111')
                MongoClient.connect(dbUrl, (err, client)=> {
                if(err) {
                    reject(err);
                    return;
                }
                  //连接数据库
                  var db = client.db(dbName);
                  _that.dbClient = db;
                //   console.log('0000')
                //   console.log(_that.dbClient)
                //   console.log('9999')
                  resolve(db);
              })
          }
                
            
         else {
            //  console.log('else')
            //  console.log(_that.dbClient)
             resolve(_that.dbClient);
          }
            
        })

    }

    find(dbName, json) {
        var that = this;
        return new Promise( (resolve, reject)=> {
            that.connectFun().then(function(client) {

                //查找具体表格 具体数据
                var result = client.collection(dbName).find(json);

                result.toArray(function(err, res) {
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(res);
                })

            })


        })



    }


    insert(dbName, json) {
        return new Promise ( (resolve, reject)=> {
            this.connectFun().then( (db)=> {
                db.collection(dbName).insertOne(json, function(err, result) {
                    if(err) {
                        reject(err)
                    }else {
                        resolve(result)
                    }

                })

            })


        })
    }

    update(dbName, json1, json2) {
        return new Promise ( (resolve, reject)=> {
            this.connectFun().then( (db)=> {
                db.collection(dbName).updateOne(json1, {$set: json2}, function(err, result) {
                    if(err) {
                        reject(err)
                    }else {
                        resolve(result)
                    }

                })

            })


        })
    }



    remove(dbName, json) {
        return new Promise ( (resolve, reject)=> {
            this.connectFun().then( (db)=> {
                db.collection(dbName).removeOne(json, function(err, result) {
                    if(err) {
                        reject(err)
                    }else {
                        resolve(result)
                    }

                })

            })


        })
    }



    getObjectid(id) {
        return new ObjectId(id);
         
    }





}



module.exports = DB.getInstance();



