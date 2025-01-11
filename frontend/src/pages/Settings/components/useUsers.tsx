import { useState, useEffect } from "react";
import {
  get_current_user,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/users";
import type { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [currentUserData, usersListData] = await Promise.all([
        get_current_user(),
        getUsers(),
      ]);
      setUsers(usersListData);
      setCurrentUser(currentUserData);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (user: Omit<User, "id">): Promise<void> => {
    try {
      const newUser = await createUser(user);
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const updateUserDetails = async (updatedUser: Partial<User>): Promise<void> => {
    try {
      if (updatedUser.id === undefined) {
        throw new Error("User ID is required to update user");
      }
      const updated = await updateUser(updatedUser as User);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updated.id ? updated : user))
      );
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const deleteUserById = async (id: number): Promise<void> => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    currentUser,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser: updateUserDetails,
    deleteUser: deleteUserById,
  };
}
