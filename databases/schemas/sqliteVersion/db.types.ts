// AUTO-GENERATED FILE — DO NOT EDIT

export interface Users {
  id: number
  email: string
  nickname: string | null
  is_active: number
  created_at: string
}

export interface Posts {
  id: number
  user_id: number
  title: string
  display_name: string
  metadata: string | null
  tags: string
}

