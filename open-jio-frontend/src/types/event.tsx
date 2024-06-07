export type Event = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  UserID: number;
  Title: string;
  Description: string;
  Time: string;
  Location: string;
  NumberOfLikes: number;
  Registrations: number;
  PollsOptions: number;
  Liked? : boolean;
};
