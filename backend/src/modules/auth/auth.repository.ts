import { getUsersCollection } from "../../lib/mongodb.js";
import { type User } from "./auth.types.js";
import { ObjectId } from "mongodb";

export class AuthRepository {
  private collection = getUsersCollection();

  async findByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email }) as Promise<User | null>;
  }

  // Inside AuthRepository class
  async findById(id: string): Promise<User | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    return user as User | null;
  }

  async create(
    userData: Omit<User, "_id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const now = new Date();
    const result = await this.collection.insertOne({
      ...userData,
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...userData,
      _id: result.insertedId.toString(),
      createdAt: now,
      updatedAt: now,
    } as User;
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken: hashedRefreshToken, updatedAt: new Date() } },
    );
  }
}
