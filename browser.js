import LitePage from "./index.js";
globalThis.LitePage = LitePage;

function escape2Html(str) {
  let arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}

globalThis.from = (sele) => {
  const a = document.querySelector(sele).innerHTML;
  const b = document.querySelector(sele);
  b.parentElement.removeChild(b);
  return escape2Html(a);
};

globalThis.fromAll = (sele) => {
  const a = document.querySelectorAll(sele);
  const answer = Array.from(a).map(e=>{
    const text = e.outerHTML;
    e.parentElement.removeChild(e);
    return escape2Html(text);
  });
  return answer;
}

export default LitePage;

export const from = globalThis.from;
export const fromAll = globalThis.fromAll;
