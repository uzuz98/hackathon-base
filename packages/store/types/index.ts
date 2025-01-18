export type TPluginData = {
  id: string
  name: string
  url?: string
  description?: string
  image?: string
  position?: number
  size?: string
  status: 'active' | 'inactive'
  plugin: any
}

export type TUserInfo = {
  address: string
  imgToken: string
  name: string
  balance: number
  percentChange: number
  addressToken: string
}
