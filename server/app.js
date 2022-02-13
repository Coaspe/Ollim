const express = require("express"); //express 모듈 가져오기.
const app = express(); //Express 객체 생성
const port = 3001; //변수 'port' 선언
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
// json request body를 받기 위해 사용한다. application/x-www-form-urlencoded
// &으로 분리되고, "=" 기호로 값과 키를 연결하는 key-value tuple로 인코딩되는 값입니다.
// 영어 알파벳이 아닌 문자들은 percent encoded 으로 인코딩됩니다.
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
//route
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

const axios = require("axios");
app.post("/searchWord", async (req, res) => {
  const result = await axios.get("https://opendict.korean.go.kr/api/search", {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    params: {
      key: process.env.OPENDICT_KEY,
      q: req.body.q,
      req_type: "json",
      num: 10,
    },
  });
  res.send(result.data);
  res.end();
});

//port
app.listen(port, () => {
  console.log("Express server on port 3001!");
}); /*위에서 선언한 port변수 , 그리고 요청대기 완료 시 실행 될 콜백함수 지정 -> (()=>{
    console.log("Express server on port 3000!");*/
