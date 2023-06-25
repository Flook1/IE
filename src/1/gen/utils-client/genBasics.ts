export const titleCase = (string: string) => {
  if(string == undefined) {
    return null
  }

  const lowerList = string.toLowerCase().split(" ");
  for (let i = 0; i < lowerList.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lowerList[i] = lowerList[i]!.charAt(0).toUpperCase() + lowerList[i]!.slice(1);
  }
  return lowerList.join(" ");
};

export const titleCaseBasic = (string: string) => {
  if(string == undefined) {
    return null
  }

  const lower = string.toLowerCase();
  return string.charAt(0).toUpperCase() + lower.slice(1);
};


export const urlRemoveEnd = (url: string) => {
  return url.substring(0, url.lastIndexOf("/"));
};
