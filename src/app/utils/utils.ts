export const getDropDownData = (dict: any) => {
    const ddList: any = [];
    for (const key in dict) {
      const ddDict: any = {};
      ddDict["label"] = dict[key];
      ddDict["value"] = Number(key);
  
      ddList.push(ddDict);
    }
    return ddList;
};



export const PAGE_SIZE = 10;

export function get_pagination_data(current_page = 1) {
  const page_size = PAGE_SIZE
  const limit = page_size * current_page
  const skip = limit - page_size;
  return skip
}


