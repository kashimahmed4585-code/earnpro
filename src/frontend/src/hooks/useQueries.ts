import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Application, Job, UserProfile, UserRole } from "../backend.d";
import { ApplicationStatus, JobCategory, JobStatus } from "../backend.d";
import { useActor } from "./useActor";

export { ApplicationStatus, JobCategory, JobStatus };
export type { Job, Application, UserProfile, UserRole };

export function useGetOpenJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["openJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpenJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["allJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJob(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Job | null>({
    queryKey: ["job", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getJob(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopEarners(limit: number) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["topEarners", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopEarners(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobApplications(jobId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["jobApplications", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === null) return [];
      return actor.getJobApplications(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
  });
}

export function useApplyToJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.applyToJob(jobId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userApplications"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: JobCategory;
      payRate: number;
      requirements: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createJob(
        data.title,
        data.description,
        data.category,
        data.payRate,
        data.requirements,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allJobs"] });
      qc.invalidateQueries({ queryKey: ["openJobs"] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      category: JobCategory;
      payRate: number;
      requirements: string;
      status: JobStatus;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateJob(
        data.id,
        data.title,
        data.description,
        data.category,
        data.payRate,
        data.requirements,
        data.status,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allJobs"] });
      qc.invalidateQueries({ queryKey: ["openJobs"] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteJob(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allJobs"] });
      qc.invalidateQueries({ queryKey: ["openJobs"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      applicationId: bigint;
      status: ApplicationStatus;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateApplicationStatus(data.applicationId, data.status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobApplications"] });
      qc.invalidateQueries({ queryKey: ["userApplications"] });
    },
  });
}

export function useGetUserApplications(principal: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["userApplications", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getUserApplications(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}
