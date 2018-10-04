 if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://insivika:insivika123 @ds123173.mlab.com:23173/vididea-prod'}
 } else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}

 }