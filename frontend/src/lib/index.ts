export function omit(o: any) {
  let clone = {...o}
  Object.keys(clone).forEach((key) => clone[key] === undefined && delete clone[key])
  return clone
}

export const sleep = (t: number = 1000) => new Promise((resolve) => setTimeout(resolve, t))
