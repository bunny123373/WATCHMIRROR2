import mongoose, { Schema, Document } from "mongoose";

export interface IContentDocument extends Document {
  type: "movie" | "series";
  title: string;
  slug: string;
  poster: string;
  banner: string;
  description: string;
  year: number;
  language: string;
  dubLanguage: string[];
  audioAvailable: string[];
  category: string;
  quality: string;
  rating: number;
  tags: string[];
  popularity: number;
  trailerEmbedUrl?: string;
  cast: { name: string; character: string; profileImage: string }[];
  metaTitle: string;
  metaDescription: string;
  hlsLink?: string;
  embedIframeLink?: string;
  streams?: { language: string; hlsLink: string; embedIframeLink: string }[];
  seasons?: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      episodeTitle: string;
      hlsLink?: string;
      embedIframeLink?: string;
      quality: string;
    }[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CastSchema = new Schema({
  name: { type: String, default: "" },
  character: { type: String, default: "" },
  profileImage: { type: String, default: "" },
}, { _id: false });

const EpisodeSchema = new Schema({
  episodeNumber: { type: Number, required: true },
  episodeTitle: { type: String, required: true },
  hlsLink: { type: String },
  embedIframeLink: { type: String },
  quality: { type: String, default: "1080p" },
}, { _id: false });

const SeasonSchema = new Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [EpisodeSchema],
}, { _id: false });

const ContentSchema = new Schema({
  type: { type: String, enum: ["movie", "series"], required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  poster: { type: String, default: "" },
  banner: { type: String, default: "" },
  description: { type: String, default: "" },
  year: { type: Number, required: true },
  language: { type: String, default: "English" },
  dubLanguage: [{ type: String }],
  audioAvailable: [{ type: String }],
  category: { type: String, required: true },
  quality: { type: String, default: "1080p" },
  rating: { type: Number, default: 0 },
  tags: [{ type: String }],
  popularity: { type: Number, default: 0 },
  trailerEmbedUrl: { type: String },
  cast: [CastSchema],
  metaTitle: { type: String },
  metaDescription: { type: String },
  hlsLink: { type: String },
  embedIframeLink: { type: String },
  streams: [{ type: Object }],
  seasons: [SeasonSchema],
}, {
  timestamps: true,
});

ContentSchema.index({ type: 1, popularity: -1 });
ContentSchema.index({ type: 1, year: -1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ language: 1 });

export const Content = mongoose.models.Content || mongoose.model<IContentDocument>("Content", ContentSchema);
