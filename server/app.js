import express from "express";
import "dotenv/config";
import multer from "multer";
import {
  temporarySave,
  commit,
  editDiagram,
  updateSynopsis,
  updateDisclosure,
  addPoem,
  addNovel,
  addScenario,
  deleteWriting,
  updateKillingVerse,
  updateMemo,
  updateCover,
  updateProfileImage,
} from "./firebaseAdmin.js";

const app = express(); //Express 객체 생성
const port = 3001; //변수 'port' 선언

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

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/temporarySave", (req, res) => {
  temporarySave(
    JSON.parse(req.body.contents),
    req.body.writingDocID,
    req.body.genre
  )
    .then(() => {
      res.send(JSON.stringify(["임시 저장을 성공했습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["임시 저장을 실패했습니다.", "error", true]));
      res.end();
    });
});

app.post("/commit", (req, res) => {
  commit(
    JSON.parse(req.body.contents),
    req.body.writingDocID,
    req.body.genre,
    req.body.memo,
    req.body.userUID
  )
    .then(() => {
      res.send(JSON.stringify(["제출을 성공했습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["제출을 실패했습니다.", "error", true]));
      res.end();
    });
});
app.post("/editDiagram", (req, res) => {
  editDiagram(
    JSON.parse(req.body.diagram),
    req.body.writingDocID,
    req.body.genre
  )
    .then(() => {
      res.send(JSON.stringify(["변경을 저장했습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["저장을 실해했습니다.", "error", true]));
      res.end();
    });
});

app.post("/updateSynopsis", (req, res) => {
  updateSynopsis(req.body.genre, req.body.writingDocID, req.body.synopsis)
    .then(() => {
      res.send(JSON.stringify(["변경을 저장했습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["저장을 실해했습니다.", "error", true]));
      res.end();
    });
});

app.post("/updateDisclosure", (req, res) => {
  updateDisclosure(req.body.genre, req.body.writingDocID, req.body.disclosure)
    .then(() => {
      res.send(JSON.stringify(["변경을 저장했습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["저장을 실해했습니다.", "error", true]));
      res.end();
    });
});

app.post("/addPoem", (req, res) => {
  const data = JSON.parse(req.body.data);
  addPoem(data)
    .then(() => {
      res.send(
        JSON.stringify([
          `${data.title} 저장을 성공하였습니다.`,
          "success",
          true,
        ])
      );
      res.end();
    })
    .catch(() => {
      res.send(
        JSON.stringify([`${data.title} 저장을 실패하였습니다.`, "error", true])
      );
      res.end();
    });
});

app.post("/addNovel", (req, res) => {
  const data = JSON.parse(req.body.data);
  addNovel(data)
    .then(() => {
      res.send(
        JSON.stringify([
          `${data.title} 저장을 성공하였습니다.`,
          "success",
          true,
        ])
      );
      res.end();
    })
    .catch(() => {
      res.send(
        JSON.stringify([`${data.title} 저장을 실패하였습니다.`, "error", true])
      );
      res.end();
    });
});

app.post("/addScenario", (req, res) => {
  const data = JSON.parse(req.body.data);
  addScenario(data)
    .then(() => {
      res.send(
        JSON.stringify([
          `${data.title} 저장을 성공하였습니다.`,
          "success",
          true,
        ])
      );
      res.end();
    })
    .catch(() => {
      res.send(
        JSON.stringify([`${data.title} 저장을 실패하였습니다.`, "error", true])
      );
      res.end();
    });
});

app.post("/deleteWriting", (req, res) => {
  deleteWriting(req.body.writingDocID, req.body.genre)
    .then(() => {
      res.send(JSON.stringify(["삭제를 성공하였습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["삭제를 실패하였습니다.", "error", true]));
      res.end();
    });
});

app.post("/updateKillingVerse", (req, res) => {
  updateKillingVerse(
    req.body.genre,
    req.body.writingDocID,
    JSON.parse(req.body.killingVerse)
  )
    .then(() => {
      res.send(JSON.stringify(["변경을 성공하였습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["변경을 실패하였습니다.", "error", true]));
      res.end();
    });
});

app.post("/updateMemo", (req, res) => {
  updateMemo(req.body.genre, req.body.writingDocID, req.body.memo)
    .then(() => {
      res.send(JSON.stringify(["변경을 성공하였습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["변경을 실패하였습니다.", "error", true]));
      res.end();
    });
});
app.post("/updateMemo", (req, res) => {
  updateCover(req.body.genre, req.body.writingDocID, JSON.parse(req.body.cover))
    .then(() => {
      res.send(JSON.stringify(["변경을 성공하였습니다.", "success", true]));
      res.end();
    })
    .catch(() => {
      res.send(JSON.stringify(["변경을 실패하였습니다.", "error", true]));
      res.end();
    });
});
app.post("/updateProfileImage", upload.single("file"), (req, res) => {
  try {
    updateProfileImage(req.body.userUID, req.body.userEmail, req.file);
    res.send(
      JSON.stringify(["프로필 사진 변경을 성공하였습니다.", "success", true])
    );
    res.end();
  } catch (res) {
    res.send(JSON.stringify(["변경을 실패하였습니다.", "error", true]));
    res.end();
  }
});
app.listen(port, () => {
  console.log("Express server on port 3001!");
});
