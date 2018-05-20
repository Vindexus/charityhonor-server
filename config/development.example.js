module.exports = {
  reddit: {
    userAgent: "",
    clientId: "",
    clientSecret: "",
    refreshToken: ""
  },
  port: 3000,
  pandaPay: {
    publicKey: "pk_test_jDT1TStVcXG5lpFouAxBsg",
    secretKey: "sk_test_HaBAI4FUEIdXJW8PwR0baA",
    javaScriptSrc: "//d2t45z63lq9zlh.cloudfront.net/panda-v0.0.5.min.js"
  },
  sequelize: require('./config').development
}
