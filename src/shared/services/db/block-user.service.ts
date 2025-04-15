import mongoose from 'mongoose';
import { UserModel } from '@user/models/user.schema';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UpdateQuery } from 'mongoose';

class BlockUserService {
  public async blockUser(userId: string, followerId: string): Promise<void> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const followerObjId = new mongoose.Types.ObjectId(followerId);

    await UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userObjId, blocked: { $ne: followerObjId } },
          update: {
            $push: { blocked: followerObjId } as UpdateQuery<IUserDocument>
          }
        }
      },
      {
        updateOne: {
          filter: { _id: followerObjId, blockedBy: { $ne: userObjId } },
          update: {
            $push: { blockedBy: userObjId } as UpdateQuery<IUserDocument>
          }
        }
      }
    ]);
  }

  public async unblockUser(userId: string, followerId: string): Promise<void> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const followerObjId = new mongoose.Types.ObjectId(followerId);

    await UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userObjId },
          update: {
            $pull: { blocked: followerObjId } as UpdateQuery<IUserDocument>
          }
        }
      },
      {
        updateOne: {
          filter: { _id: followerObjId },
          update: {
            $pull: { blockedBy: userObjId } as UpdateQuery<IUserDocument>
          }
        }
      }
    ]);
  }
}

export const blockUserService: BlockUserService = new BlockUserService();
