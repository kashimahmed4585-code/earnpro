import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    id: bigint;
    status: JobStatus;
    title: string;
    creator: Principal;
    createdAt: bigint;
    description: string;
    category: JobCategory;
    requirements: string;
    payRate: number;
}
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    applicant: Principal;
    appliedAt: bigint;
    jobId: bigint;
    updatedAt: bigint;
}
export interface UserProfile {
    bio: string;
    completedJobs: bigint;
    totalEarnings: number;
    skills: Array<string>;
}
export enum ApplicationStatus {
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    accepted = "accepted"
}
export enum JobCategory {
    marketing = "marketing",
    design = "design",
    writing = "writing",
    development = "development",
    dataEntry = "dataEntry"
}
export enum JobStatus {
    closed = "closed",
    open = "open"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobId: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJob(title: string, description: string, category: JobCategory, payRate: number, requirements: string): Promise<bigint>;
    deleteJob(id: bigint): Promise<void>;
    getAllJobs(): Promise<Array<Job>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(id: bigint): Promise<Job | null>;
    getJobApplications(jobId: bigint): Promise<Array<Application>>;
    getOpenJobs(): Promise<Array<Job>>;
    getTopEarners(limit: bigint): Promise<Array<UserProfile>>;
    getUserApplications(user: Principal): Promise<Array<Application>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApplicationStatus(applicationId: bigint, status: ApplicationStatus): Promise<void>;
    updateJob(id: bigint, title: string, description: string, category: JobCategory, payRate: number, requirements: string, status: JobStatus): Promise<void>;
}
