'use strict';
import message from "./msgs.js";

export const responseSend = (res, code, msg, data) => {
  const result = {};
  const n_code = code ? code : 455;
  const m = message[n_code];

  result.success = m ? m.status : n_code;
  result.message = msg ? msg : m.message;
  result.result = data ? data : null;
  res.status(m ? m.httpCode : 280).send(result);
};