type User = {
  id: number;
  name: string;
  email: string;
};

type CreateUserInput = Omit<User, "id">;

let users: User[] = [];
let id = 1;

// CREATE
export const createUserService = async (data: CreateUserInput): Promise<User> => {
  const user: User = { id: id++, ...data };
  users.push(user);
  return user;
};

// READ ALL
export const getUsersService = async (): Promise<User[]> => {
  return users;
};

// READ ONE
export const getUserByIdService = async (userId: number): Promise<User | undefined> => {
  return users.find(u => u.id === userId);
};

// UPDATE
export const updateUserService = async (
  userId: number,
  data: Partial<CreateUserInput>
): Promise<User | undefined> => {
  users = users.map(u =>
    u.id === userId ? { ...u, ...data } : u
  );

  return users.find(u => u.id === userId);
};

// DELETE
export const deleteUserService = async (userId: number): Promise<{ message: string }> => {
  users = users.filter(u => u.id !== userId);
  return { message: "deleted" };
};