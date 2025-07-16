import mongoose from 'mongoose';

// Interface cho TypeScript
export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    bio?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    location?: string;
    role: 'user' | 'admin' | 'moderator';
    isActive: boolean;
    emailVerified: boolean;
    reputation: number;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    favoriteCodeExamples: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema định nghĩa cấu trúc dữ liệu User
const UserSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            match: /^[a-zA-Z0-9_]+$/,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
            match: /^https?:\/\/.+/,
        },
        github: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        reputation: {
            type: Number,
            default: 0,
            min: 0,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        favoriteCodeExamples: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CodeExample',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Additional indexes (unique constraints are handled in schema)
UserSchema.index({ reputation: -1 });
UserSchema.index({ createdAt: -1 });

// Virtual fields
UserSchema.virtual('followerCount').get(function () {
    return this.followers.length;
});

UserSchema.virtual('followingCount').get(function () {
    return this.following.length;
});

UserSchema.virtual('isPopular').get(function () {
    return this.reputation > 1000;
});

// Instance methods
UserSchema.methods.follow = function (userId: mongoose.Types.ObjectId) {
    if (!this.following.includes(userId)) {
        this.following.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

UserSchema.methods.unfollow = function (userId: mongoose.Types.ObjectId) {
    this.following = this.following.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId),
    );
    return this.save();
};

UserSchema.methods.addToFavorites = function (
    codeExampleId: mongoose.Types.ObjectId,
) {
    if (!this.favoriteCodeExamples.includes(codeExampleId)) {
        this.favoriteCodeExamples.push(codeExampleId);
        return this.save();
    }
    return Promise.resolve(this);
};

UserSchema.methods.removeFromFavorites = function (
    codeExampleId: mongoose.Types.ObjectId,
) {
    this.favoriteCodeExamples = this.favoriteCodeExamples.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(codeExampleId),
    );
    return this.save();
};

// Static methods
UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username, isActive: true });
};

UserSchema.statics.findTopContributors = function (limit: number = 10) {
    return this.find({ isActive: true }).sort({ reputation: -1 }).limit(limit);
};

// Export model
export default mongoose.models.User ||
    mongoose.model<IUser>('User', UserSchema);
