export type RoleIconType = "admin" | "viewer";

export type RoleButtonType = "primary" | "default";

export interface RoleConfig {
  id: string;
  title: string;
  description: string;
  iconType: RoleIconType;
  buttonText: string;
  buttonType: RoleButtonType;
  path: string;
}
