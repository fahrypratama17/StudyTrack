import { useEffect, useMemo, useState } from "react";

import { dummyCourses, dummyTasks } from "../data/data";

import type {
  DashboardTask,
  DashboardTaskWithPriority,
  TaskPriority,
} from "../types/type";

const ONE_DAY = 24 * 60 * 60 * 1000;

const getTaskPriority = (task: DashboardTask, now: number): TaskPriority => {
  if (task.status === "selesai") {
    return "selesai";
  }

  const deadline = new Date(task.deadline).getTime();

  if (Number.isNaN(deadline)) {
    return "normal";
  }

  const remaining = deadline - now;

  if (remaining < 0) {
    return "terlambat";
  }

  if (remaining < ONE_DAY) {
    return "mendesak";
  }

  return "normal";
};

export const useDashboard = () => {
  const [now, setNow] = useState(() => Date.now());

  // Update kategori deadline setiap menit
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const tasksWithPriority = useMemo<DashboardTaskWithPriority[]>(() => {
    return dummyTasks.map((task) => ({
      ...task,
      priority: getTaskPriority(task, now),
    }));
  }, [now]);

  const summary = useMemo(() => {
    const totalTasks = tasksWithPriority.length;

    const completed = tasksWithPriority.filter(
      (task) => task.status === "selesai",
    ).length;

    const urgent = tasksWithPriority.filter(
      (task) => task.priority === "mendesak",
    ).length;

    const overdue = tasksWithPriority.filter(
      (task) => task.priority === "terlambat",
    ).length;

    return {
      totalCourses: dummyCourses.length,
      totalTasks,
      completed,
      pending: totalTasks - completed,
      urgent,
      overdue,
      completionRate:
        totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100),
    };
  }, [tasksWithPriority]);

  const priorityTasks = useMemo(() => {
    const order: Record<TaskPriority, number> = {
      mendesak: 0,
      terlambat: 1,
      normal: 2,
      selesai: 3,
    };

    return tasksWithPriority
      .filter(
        (task) => task.priority === "mendesak" || task.priority === "terlambat",
      )
      .sort((a, b) => {
        const priorityDiff = order[a.priority] - order[b.priority];

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })
      .slice(0, 5);
  }, [tasksWithPriority]);

  const recentTasks = useMemo(() => {
    return [...tasksWithPriority]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [tasksWithPriority]);

  return {
    summary,
    priorityTasks,
    recentTasks,
  };
};
