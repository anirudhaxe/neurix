"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

type JobStatus = "QUEUED" | "CANCELLED" | "PROCESSING" | "ERROR" | "PROCESSED";

type JobType = "TEXT";

const jobTypes: JobType[] = ["TEXT"];

const statusConfig = {
  QUEUED: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-muted",
  },
  PROCESSING: {
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  PROCESSED: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  ERROR: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
};

interface SelectedJob {
  jobId: string;
  jobName: string;
}

interface JobsSectionProps {
  selectedJobs: SelectedJob[];
  onJobSelectionChange: (selectedJobs: SelectedJob[]) => void;
}

export function JobsSection({
  selectedJobs = [],
  onJobSelectionChange,
}: JobsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<JobType>("TEXT");
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>();

  const { data: jobs = [], refetch } = trpc.job.getJobs.useQuery({
    nameSearchQuery: searchQuery,
    status: selectedStatus,
    type: selectedType,
  });

  const { mutate: deleteJob } = trpc.job.deleteJob.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleRetry = (jobId: string) => {
    // TODO: Implement retry logic
    console.log("Retrying job:", jobId);
  };

  const handleDelete = (jobId: string) => {
    deleteJob({ jobId });
  };

  const handleJobSelection = (jobId: string, jobName: string) => {
    const isSelected = selectedJobs.some((job) => job.jobId === jobId);
    let newSelection: SelectedJob[];

    if (isSelected) {
      newSelection = selectedJobs.filter((job) => job.jobId !== jobId);
    } else {
      newSelection = [...selectedJobs, { jobId, jobName }];
    }

    if (onJobSelectionChange) {
      onJobSelectionChange(newSelection);
    }
  };

  const runningJobsCount = jobs.filter((j) => j.status === "PROCESSING").length;
  const hasRunningJobs = runningJobsCount > 0;

  // Get selected job IDs for easy checking
  const selectedJobIds = selectedJobs.map((job) => job.jobId);

  const toggleTypeFilter = (type: JobType) => {
    setSelectedType(type);
  };

  const toggleStatusFilter = (status: JobStatus) => {
    setSelectedStatus(status);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 border-t border-border/50 bg-linear-to-t from-transparent via-card/30 to-card/50 px-2 pb-3 md:px-4 pt-2">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "group flex w-full items-center justify-between gap-2 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 transition-all duration-200 hover:border-primary/50 hover:bg-card/80 brand-shadow-sm",
          hasRunningJobs &&
            "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10",
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-6 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300",
              hasRunningJobs && "bg-blue-500/20 animate-pulse",
            )}
          >
            <BookOpen
              className={cn(
                "size-4 text-primary transition-all duration-300",
                hasRunningJobs && "text-blue-500",
              )}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            Select Context
          </span>

          {hasRunningJobs && (
            <Badge
              variant="outline"
              className="text-xs text-blue-500 border-blue-500/20 bg-blue-500/10 animate-pulse"
            >
              {runningJobsCount} processing
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground transition-transform duration-200" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200" />
          )}
        </div>
      </Button>

      {/* Collapsible Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-3">
          {/* Filters Section */}
          <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 brand-shadow-sm">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Type Filters */}
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Job Type
              </p>
              <div className="flex flex-wrap gap-1">
                {jobTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={
                      selectedType.includes(type) ? "default" : "outline"
                    }
                    className="cursor-pointer text-xs transition-all duration-200 hover:scale-105"
                    onClick={() => toggleTypeFilter(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <Badge
                      key={status}
                      variant={
                        selectedStatus === status ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer text-xs transition-all duration-200 hover:scale-105",
                        selectedStatus === status ? "" : config.color,
                      )}
                      onClick={() => toggleStatusFilter(status as JobStatus)}
                    >
                      <Icon className="size-3 mr-1" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-3 brand-shadow-sm">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="size-8 mb-2" />
                <p className="text-sm">No jobs found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobs.map((job, index) => {
                  const StatusIcon = statusConfig[job.status].icon;
                  const isSelected = selectedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className={cn(
                        "group flex flex-col gap-2 rounded-lg border p-3 transition-all duration-200 hover:bg-card/80 hover:border-primary/30 animate-in fade-in slide-in-from-bottom-2 h-full cursor-pointer",
                        statusConfig[job.status].borderColor,
                        statusConfig[job.status].bgColor,
                        isSelected &&
                          "border-primary bg-primary/10 ring-2 ring-primary/20",
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleJobSelection(job.id, job.name)}
                    >
                      {/* Header with Status Icon, Selection Indicator, and Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* Selection Checkbox */}
                          <div
                            className={cn(
                              "flex size-5 items-center justify-center rounded border transition-all duration-200 shrink-0",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/50",
                            )}
                          >
                            {isSelected && (
                              <svg
                                className="size-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Status Icon */}
                          <div
                            className={cn(
                              "flex size-6 items-center justify-center rounded-full transition-all duration-300 shrink-0",
                              statusConfig[job.status].bgColor,
                              job.status === "PROCESSING" && "animate-spin",
                            )}
                          >
                            <StatusIcon
                              className={cn(
                                "size-3",
                                statusConfig[job.status].color,
                              )}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                          {job.status === "ERROR" && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRetry(job.id);
                              }}
                              className="h-6 w-6 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 p-0"
                              title="Retry job"
                            >
                              <RefreshCw className="size-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(job.id);
                            }}
                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0"
                            title="Delete job"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-xs font-medium text-foreground truncate leading-tight">
                            {job.name}
                          </p>
                        </div>
                        <Badge variant="default" className="text-xs mb-2 h-5">
                          {job.type}
                        </Badge>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(job.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
