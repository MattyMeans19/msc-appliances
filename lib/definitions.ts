
export type Employee = {
    fname: string,
    lname: string,
    access: "Admin" | "Manager" | "Employee",
}

export type Employee_Login = {
    username: string, 
    password: string
}

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

  export type SessionPayload = {
    username: string, 
    expiresAt: Date
  }

  export type Specials = {
    name: string,
    info: string,
    textColor: string,
    bgImage: string,
    current: boolean
  }