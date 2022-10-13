export type Message = {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
  };
};
