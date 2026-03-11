import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type JobCategory = {
    #writing;
    #design;
    #development;
    #dataEntry;
    #marketing;
  };

  type JobStatus = {
    #open;
    #closed;
  };

  type ApplicationStatus = {
    #pending;
    #accepted;
    #rejected;
    #completed;
  };

  type Job = {
    id : Nat;
    title : Text;
    description : Text;
    category : JobCategory;
    payRate : Float;
    requirements : Text;
    status : JobStatus;
    creator : Principal;
    createdAt : Int;
  };

  type Application = {
    id : Nat;
    jobId : Nat;
    applicant : Principal;
    status : ApplicationStatus;
    appliedAt : Int;
    updatedAt : Int;
  };

  type UserProfile = {
    bio : Text;
    skills : [Text];
    totalEarnings : Float;
    completedJobs : Nat;
  };

  let jobs = Map.empty<Nat, Job>();
  let applications = Map.empty<Nat, Application>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var jobIdCounter = 1;
  var applicationIdCounter = 1;

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize with seed data
  private func initSeedData() {
    let adminPrincipal = Principal.fromText("aaaaa-aa");
    
    // Seed job 1 - Writing
    let job1 : Job = {
      id = jobIdCounter;
      title = "Content Writer for Tech Blog";
      description = "Write engaging articles about emerging technologies";
      category = #writing;
      payRate = 50.0;
      requirements = "Strong writing skills, tech knowledge";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job1);
    jobIdCounter += 1;

    // Seed job 2 - Design
    let job2 : Job = {
      id = jobIdCounter;
      title = "Logo Designer";
      description = "Create modern logo for startup company";
      category = #design;
      payRate = 150.0;
      requirements = "Portfolio required, Adobe Illustrator experience";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job2);
    jobIdCounter += 1;

    // Seed job 3 - Development
    let job3 : Job = {
      id = jobIdCounter;
      title = "Frontend Developer";
      description = "Build responsive web application using React";
      category = #development;
      payRate = 75.0;
      requirements = "React, TypeScript, 2+ years experience";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job3);
    jobIdCounter += 1;

    // Seed job 4 - Data Entry
    let job4 : Job = {
      id = jobIdCounter;
      title = "Data Entry Specialist";
      description = "Enter customer information into database";
      category = #dataEntry;
      payRate = 20.0;
      requirements = "Attention to detail, fast typing";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job4);
    jobIdCounter += 1;

    // Seed job 5 - Marketing
    let job5 : Job = {
      id = jobIdCounter;
      title = "Social Media Manager";
      description = "Manage social media accounts and create content";
      category = #marketing;
      payRate = 60.0;
      requirements = "Social media experience, content creation skills";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job5);
    jobIdCounter += 1;

    // Seed job 6 - Writing (closed)
    let job6 : Job = {
      id = jobIdCounter;
      title = "Technical Documentation Writer";
      description = "Write API documentation for software product";
      category = #writing;
      payRate = 65.0;
      requirements = "Technical writing experience, API knowledge";
      status = #closed;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job6);
    jobIdCounter += 1;

    // Seed job 7 - Design
    let job7 : Job = {
      id = jobIdCounter;
      title = "UI/UX Designer";
      description = "Design user interface for mobile app";
      category = #design;
      payRate = 80.0;
      requirements = "Figma, mobile design experience";
      status = #open;
      creator = adminPrincipal;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job7);
    jobIdCounter += 1;
  };

  // Call seed data initialization
  initSeedData();

  // Job Management - Admin only
  public shared ({ caller }) func createJob(
    title : Text,
    description : Text,
    category : JobCategory,
    payRate : Float,
    requirements : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create jobs");
    };

    let job : Job = {
      id = jobIdCounter;
      title;
      description;
      category;
      payRate;
      requirements;
      status = #open;
      creator = caller;
      createdAt = Time.now();
    };
    jobs.add(jobIdCounter, job);
    jobIdCounter += 1;
    job.id;
  };

  public shared ({ caller }) func updateJob(
    id : Nat,
    title : Text,
    description : Text,
    category : JobCategory,
    payRate : Float,
    requirements : Text,
    status : JobStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update jobs");
    };

    switch (jobs.get(id)) {
      case (?existingJob) {
        let updatedJob : Job = {
          id = existingJob.id;
          title;
          description;
          category;
          payRate;
          requirements;
          status;
          creator = existingJob.creator;
          createdAt = existingJob.createdAt;
        };
        jobs.add(id, updatedJob);
      };
      case (null) { Runtime.trap("Job not found") };
    };
  };

  public shared ({ caller }) func deleteJob(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete jobs");
    };

    if (not jobs.containsKey(id)) {
      Runtime.trap("Job not found");
    };
    jobs.remove(id);
  };

  public query func getJob(id : Nat) : async ?Job {
    jobs.get(id);
  };

  public query func getAllJobs() : async [Job] {
    let jobsArray = jobs.values().toArray();
    jobsArray.sort(func(a : Job, b : Job) : Order.Order {
      Nat.compare(a.id, b.id)
    });
  };

  public query func getOpenJobs() : async [Job] {
    let openJobs = jobs.values().filter(
      func(job : Job) : Bool {
        job.status == #open;
      }
    );
    let openJobsArray = openJobs.toArray();
    openJobsArray.sort(func(a : Job, b : Job) : Order.Order {
      Nat.compare(a.id, b.id)
    });
  };

  // Application Management
  public shared ({ caller }) func applyToJob(jobId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply to jobs");
    };

    // Verify job exists and is open
    switch (jobs.get(jobId)) {
      case (?job) {
        if (job.status != #open) {
          Runtime.trap("Job is not open for applications");
        };
      };
      case (null) { Runtime.trap("Job not found") };
    };

    let application : Application = {
      id = applicationIdCounter;
      jobId;
      applicant = caller;
      status = #pending;
      appliedAt = Time.now();
      updatedAt = Time.now();
    };
    applications.add(applicationIdCounter, application);
    applicationIdCounter += 1;
    application.id;
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : Nat, status : ApplicationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };

    switch (applications.get(applicationId)) {
      case (?application) {
        let updatedApplication : Application = {
          id = application.id;
          jobId = application.jobId;
          applicant = application.applicant;
          status;
          appliedAt = application.appliedAt;
          updatedAt = Time.now();
        };
        applications.add(applicationId, updatedApplication);

        // If completed, update user earnings
        if (status == #completed) {
          switch (jobs.get(application.jobId)) {
            case (?job) {
              switch (userProfiles.get(application.applicant)) {
                case (?profile) {
                  let updatedProfile : UserProfile = {
                    bio = profile.bio;
                    skills = profile.skills;
                    totalEarnings = profile.totalEarnings + job.payRate;
                    completedJobs = profile.completedJobs + 1;
                  };
                  userProfiles.add(application.applicant, updatedProfile);
                };
                case (null) {
                  // Create profile if doesn't exist
                  let newProfile : UserProfile = {
                    bio = "";
                    skills = [];
                    totalEarnings = job.payRate;
                    completedJobs = 1;
                  };
                  userProfiles.add(application.applicant, newProfile);
                };
              };
            };
            case (null) { };
          };
        };
      };
      case (null) { Runtime.trap("Application not found") };
    };
  };

  public query func getUserApplications(user : Principal) : async [Application] {
    let userApps = applications.values().filter(
      func(app : Application) : Bool { app.applicant == user }
    );
    userApps.toArray();
  };

  public query func getJobApplications(jobId : Nat) : async [Application] {
    let jobApps = applications.values().filter(
      func(app : Application) : Bool { app.jobId == jobId }
    );
    jobApps.toArray();
  };

  // Earnings & Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Leaderboard - Public access
  public query func getTopEarners(limit : Nat) : async [UserProfile] {
    let profilesArray = userProfiles.values().toArray();
    let sorted = profilesArray.sort(func(a : UserProfile, b : UserProfile) : Order.Order {
      Float.compare(b.totalEarnings, a.totalEarnings)
    });
    
    let actualLimit = if (limit > sorted.size()) { sorted.size() } else { limit };
    Array.tabulate<UserProfile>(actualLimit, func(i : Nat) : UserProfile {
      sorted[i]
    });
  };
};
