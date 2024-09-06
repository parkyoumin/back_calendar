export interface GoogleUser {
  providerAccountId: string;
  name: string;
  email: string;
  type: "login" | "signup";
}
