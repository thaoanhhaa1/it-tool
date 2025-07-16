import mongoose from 'mongoose';

// Interface cho TypeScript
export interface IComment extends mongoose.Document {
    content: string;
    author: mongoose.Types.ObjectId;
    codeExample: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId;
    rating?: number;
    isHelpful: boolean;
    likes: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date;
    isReported: boolean;
    reportCount: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Schema định nghĩa cấu trúc dữ liệu Comment
const CommentSchema = new mongoose.Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 2000,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        codeExample: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CodeExample',
            required: true,
            index: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        isHelpful: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
            default: null,
        },
        isReported: {
            type: Boolean,
            default: false,
            index: true,
        },
        reportCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isApproved: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Indexes
CommentSchema.index({ codeExample: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ isApproved: 1, isReported: 1 });

// Virtual fields
CommentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

CommentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
});

CommentSchema.virtual('isReply').get(function () {
    return !!this.parentComment;
});

CommentSchema.virtual('replyCount').get(function () {
    return 0; // Will be populated separately when needed
});

// Pre-save middleware
CommentSchema.pre('save', function (next) {
    if (this.isModified('content') && !this.isNew) {
        this.isEdited = true;
        this.editedAt = new Date();
    }
    next();
});

// Static methods
CommentSchema.statics.findByCodeExample = function (
    codeExampleId: mongoose.Types.ObjectId,
) {
    return this.find({
        codeExample: codeExampleId,
        parentComment: null,
        isApproved: true,
    })
        .populate('author', 'username avatar reputation')
        .sort({ createdAt: -1 });
};

CommentSchema.statics.findReplies = function (
    parentCommentId: mongoose.Types.ObjectId,
) {
    return this.find({
        parentComment: parentCommentId,
        isApproved: true,
    })
        .populate('author', 'username avatar reputation')
        .sort({ createdAt: 1 });
};

CommentSchema.statics.findByAuthor = function (
    authorId: mongoose.Types.ObjectId,
    limit: number = 20,
) {
    return this.find({
        author: authorId,
        isApproved: true,
    })
        .populate('codeExample', 'name type library')
        .sort({ createdAt: -1 })
        .limit(limit);
};

CommentSchema.statics.findReported = function () {
    return this.find({
        isReported: true,
        reportCount: { $gte: 1 },
    })
        .populate('author', 'username email')
        .populate('codeExample', 'name')
        .sort({ reportCount: -1, createdAt: -1 });
};

CommentSchema.statics.getAverageRating = async function (
    codeExampleId: mongoose.Types.ObjectId,
) {
    const result = await this.aggregate([
        {
            $match: {
                codeExample: codeExampleId,
                rating: { $exists: true, $ne: null },
                isApproved: true,
            },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
            },
        },
    ]);

    return result.length > 0
        ? result[0]
        : { averageRating: 0, totalRatings: 0 };
};

// Instance methods
CommentSchema.methods.toggleLike = function (userId: mongoose.Types.ObjectId) {
    const isLiked = this.likes.includes(userId);

    if (isLiked) {
        this.likes = this.likes.filter(
            (id: mongoose.Types.ObjectId) => !id.equals(userId),
        );
    } else {
        this.likes.push(userId);
    }

    return this.save();
};

CommentSchema.methods.report = function () {
    this.isReported = true;
    this.reportCount += 1;
    return this.save();
};

CommentSchema.methods.approve = function () {
    this.isApproved = true;
    this.isReported = false;
    return this.save();
};

CommentSchema.methods.reject = function () {
    this.isApproved = false;
    return this.save();
};

// Export model
export default mongoose.models.Comment ||
    mongoose.model<IComment>('Comment', CommentSchema);
