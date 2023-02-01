import { LabelColors } from "@deskpro/deskpro-ui";

export const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const toDotList = (obj: object) => {
  const walk = (
    into: {
      [key: string]: number | string;
    },
    obj: object,
    prefix: string[] = []
  ) => {
    Object.entries(obj).forEach(([key, val]) => {
      if (typeof val === "object" && !Array.isArray(val))
        walk(into, val, [...prefix, key]);
      else into[[...prefix, key].join(".")] = val;
    });
  };
  const out = {};
  walk(out, obj);
  return out;
};

export const defaultInitialDataArr = {
  initialData: {
    value: [] || {},
    count: 0,
  },
};

export const defaultInitialDataObj = {
  initialData: {
    value: {},
    count: 0,
  },
};

export const colors: LabelColors[] = [
  {
    textColor: "#4C4F50",
    backgroundColor: "#FDF8F7",
    borderColor: "#EC6C4E",
  },
  {
    backgroundColor: "#F3F9F9",
    borderColor: "#5BB6B1",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#912066",
    backgroundColor: "#F4E9F0",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#F2C94C",
    backgroundColor: "#FEF9E7",
    textColor: "#4C4F50",
  },
];

export const splitArrEvery2 = (arr: string[]) => {
  const newArr: string[][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1]) {
      newArr.push([arr[i], arr[i + 1]]);
    } else {
      newArr.push([arr[i]]);
    }
  }
  return newArr;
};

export const parseJsonErrorMessage = (error: string) => {
  return error;
};
