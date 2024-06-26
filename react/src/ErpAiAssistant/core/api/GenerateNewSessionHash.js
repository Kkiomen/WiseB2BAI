import axiosClient from "../../../axios-client.js";

const generateHash = function(setSessionHash, setCookie){
  axiosClient.get(`/session`)
    .then(({data}) => {
      setSessionHash(data.session_hash);
      setCookie("sessionHash_", data.session_hash)
    })
}
export default generateHash;
