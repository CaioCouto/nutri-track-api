export type UserProfile = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
};

export type Patient = {
  nome: string;
  data_nascimento: string;
  sexo: string;
};