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

export default LitePage;

export const from = globalThis.from;
