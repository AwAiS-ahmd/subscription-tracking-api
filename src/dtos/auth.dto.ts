type AuthCredentials = {
  email: string;
  password: string;
};

type SignUpDto = AuthCredentials & {
  name: string;
};

type SignInDto = AuthCredentials;

export type { SignUpDto,SignInDto };
