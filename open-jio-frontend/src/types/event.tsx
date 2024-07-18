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
  Joined? : boolean;
  Imageurls: string[];
  Iscreator : boolean;
};

export type ProcessedEvent = {
  ID: number;
  UserID: number;
  Title: string;
  Description: string;
  Date: string;
  Time : string;
  Location: string;

}
