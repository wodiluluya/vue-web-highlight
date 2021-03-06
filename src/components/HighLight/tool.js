// 将HTML转义为实体
export function escape(html) {
  var elem = document.createElement("div");
  var txt = document.createTextNode(html);
  elem.appendChild(txt);
  return elem.innerHTML;
}

// 将实体转回为HTML
export function unescape(str) {
  var elem = document.createElement("div");
  elem.innerHTML = str;
  return elem.innerText || elem.textContent || "";
}

/**
 * 设置class
 */

export function classNames(...arg) {
  // @ts-ignore
  const classNameMap = {};

  for (let i = 0; i < arg.length; i++) {
    const name = arg[i];
    if (typeof name === "string") {
      classNameMap[name] = true;
    } else if (typeof name === "object") {
      Object.keys(name).forEach((key) => {
        if (name[key]) {
          classNameMap[key] = true;
        }
      });
    }
  }

  return Object.keys(classNameMap).join(" ");
}

export const getDomFromHTMLTemp = (HTMLTemp) => {
  const div = document.createElement("div");
  HTMLTemp = HTMLTemp.trim();
  div.innerHTML = HTMLTemp;
  return div.childNodes;
};
