declare namespace PbsxSpace {
  interface publishInfo {
    pbEnv: string
    pbVersion: string
    pbDesc: string
  }

  interface appidObj {
    dev: string
    fat: string
    rc: string
    prod: string
    [propName: string]: string
  }
}
