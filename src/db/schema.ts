import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Modèle multi-rôles (décision itération 1) : tout compte est acheteur par défaut ;
// « vendeur » et « livreur » sont des casquettes supplémentaires activées après
// vérification, matérialisées par l'existence d'un profil dédié.
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "banned",
  "deleted",
]);

export const profileStatusEnum = pgEnum("profile_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Identité gérée par Firebase Authentication
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  fullName: text("full_name"),
  isAdmin: boolean("is_admin").notNull().default(false),
  status: userStatusEnum("status").notNull().default("active"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Archive des comptes supprimés : la ligne `users` est anonymisée (l'id reste
// pour l'intégrité des commandes futures), l'identité est conservée ici comme
// trace (litiges, obligations légales, lutte anti-fraude).
export const userArchives = pgTable("user_archives", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  firebaseUid: text("firebase_uid").notNull(),
  email: text("email"),
  phone: text("phone"),
  fullName: text("full_name"),
  hadSellerProfile: boolean("had_seller_profile").notNull().default(false),
  hadCourierProfile: boolean("had_courier_profile").notNull().default(false),
  archivedAt: timestamp("archived_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Casquette vendeur (itération 2). La demande est créée avec status=pending
// puis validée/refusée par un admin. Les documents KYC sont stockés dans
// Firebase Storage (chemins privés, consultation via le serveur uniquement).
export const sellerProfiles = pgTable("seller_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  shopName: text("shop_name").notNull(),
  shopDescription: text("shop_description"),
  city: text("city").notNull().default("Lomé"),
  district: text("district"),
  contactPhone: text("contact_phone"),
  // N° RCCM (registre du commerce) — optionnel, beaucoup de vendeurs informels
  rccm: text("rccm"),
  idDocumentPath: text("id_document_path").notNull(),
  rccmDocumentPath: text("rccm_document_path"),
  status: profileStatusEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Casquette livreur (cf. docs/CHANGEMENTS.md §1) — détails (zone, véhicule, gains)
// au module Livraison.
export const courierProfiles = pgTable("courier_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  status: profileStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Adresses de livraison (MVP n°12 — ajout/modification/suppression)
export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label"),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  city: text("city").notNull().default("Lomé"),
  district: text("district"),
  details: text("details"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
