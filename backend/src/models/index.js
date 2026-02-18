import { DataTypes } from 'sequelize';

export function defineModels(sequelize) {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
  }, { indexes: [{ unique: true, fields: ['email'] }, { unique: true, fields: ['username'] }] });

  const MoodEntry = sequelize.define('MoodEntry', {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    sleepHours: { type: DataTypes.FLOAT, allowNull: true },
    stressLevel: { type: DataTypes.INTEGER, allowNull: true },
    moodScore: { type: DataTypes.INTEGER, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, { indexes: [{ fields: ['date'] }] });

  const Post = sequelize.define('Post', {
    text: { type: DataTypes.TEXT, allowNull: false },
    scope: { type: DataTypes.ENUM('day', 'week'), allowNull: false, defaultValue: 'day' },
    attachedDate: { type: DataTypes.DATEONLY, allowNull: true },
    attachedMoodScore: { type: DataTypes.INTEGER, allowNull: true },
    photos: { // JSON array of URLs
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      get() {
        try { return JSON.parse(this.getDataValue('photos')); } catch { return []; }
      },
      set(val) {
        this.setDataValue('photos', JSON.stringify(Array.isArray(val) ? val : []));
      }
    },
  });

  const Comment = sequelize.define('Comment', {
    text: { type: DataTypes.TEXT, allowNull: false },
  });

  const Friendship = sequelize.define('Friendship', {
    status: { type: DataTypes.ENUM('pending', 'accepted', 'blocked'), allowNull: false, defaultValue: 'pending' },
  }, { indexes: [{ fields: ['status'] }] });

  const PostLike = sequelize.define('PostLike', {}, { timestamps: true });

  // Relations
  User.hasMany(MoodEntry, { foreignKey: { name: 'ownerId', allowNull: false }, onDelete: 'CASCADE' });
  MoodEntry.belongsTo(User, { as: 'owner', foreignKey: { name: 'ownerId', allowNull: false } });

  User.hasMany(Post, { foreignKey: { name: 'authorId', allowNull: false }, onDelete: 'CASCADE' });
  Post.belongsTo(User, { as: 'author', foreignKey: { name: 'authorId', allowNull: false } });

  Post.hasMany(Comment, { foreignKey: { name: 'postId', allowNull: false }, onDelete: 'CASCADE' });
  Comment.belongsTo(Post, { foreignKey: { name: 'postId', allowNull: false } });

  User.hasMany(Comment, { foreignKey: { name: 'authorId', allowNull: false }, onDelete: 'CASCADE' });
  Comment.belongsTo(User, { as: 'author', foreignKey: { name: 'authorId', allowNull: false } });

  // Friendships: requester -> addressee
  User.hasMany(Friendship, { as: 'sentFriendships', foreignKey: { name: 'requesterId', allowNull: false }, onDelete: 'CASCADE' });
  User.hasMany(Friendship, { as: 'receivedFriendships', foreignKey: { name: 'addresseeId', allowNull: false }, onDelete: 'CASCADE' });
  Friendship.belongsTo(User, { as: 'requester', foreignKey: { name: 'requesterId', allowNull: false } });
  Friendship.belongsTo(User, { as: 'addressee', foreignKey: { name: 'addresseeId', allowNull: false } });

  // Likes many-to-many via join table
  User.belongsToMany(Post, { through: PostLike, as: 'likedPosts', foreignKey: 'userId', otherKey: 'postId' });
  Post.belongsToMany(User, { through: PostLike, as: 'likes', foreignKey: 'postId', otherKey: 'userId' });

  // Attach to sequelize for easy access
  sequelize.models = { User, MoodEntry, Post, Comment, Friendship, PostLike };

  return sequelize.models;
}
